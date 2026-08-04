"use client";

/*
  El micrófono que se acerca al atril mientras se recorre la sección del método. Son 96
  fotogramas renderizados en Blender con canal alfa, así que el micrófono se compone sobre la
  fotografía de la sala en lugar de traer su propio fondo: el atril está vacío en la foto y es
  el micrófono el que llega.

  Comparte técnica con SecuenciaScroll —ventana deslizante de ImageBitmap con close() de lo
  que sale de ella— pero no lo reutiliza, y por una razón que no es de estilo: aquel pinta
  fotogramas opacos y rellena el lienzo antes de dibujar, mientras que aquí cada fotograma
  tiene transparencia y hay que LIMPIAR. Con fillRect en vez de clearRect, los micrófonos se
  irían acumulando uno encima de otro a lo largo del recorrido.

  Solo se recorren los primeros 28 fotogramas de los 96, y no por peso sino por composición.
  La cámara del render orbita, así que a partir del fotograma 30 el micrófono se despega del
  atril y cruza el encuadre por la izquierda, flotando sobre las butacas; del 52 en adelante
  vuelve al centro pero ya ocupa la pantalla entera. En el tramo 1-28 crece apoyado sobre la
  madera, que es lo único que esta escena tiene que contar. De paso la descarga baja de 1,5 MB
  a 670 KB.

  La descarga es diferida por construcción: la ventana solo pide los diecisiete fotogramas
  que rodean al actual, así que la sección no cuesta nada hasta que el visitante se acerca.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

const RUTA_DE_LOS_FOTOGRAMAS = "/podio/microfono";
const PRIMER_FOTOGRAMA = 1;
const ULTIMO_FOTOGRAMA_DEL_RECORRIDO = 28;
const RADIO_DE_LA_VENTANA = 8;
const ANCHO_DE_CORTE_PARA_MOVIL = 768;
const DENSIDAD_MAXIMA = 2;

/*
  El micrófono viene encuadrado para llenar un plano completo; sobre la sala se reduce y se
  desplaza para que el pie caiga junto al atril en vez de flotar sobre las butacas. Las tres
  constantes son fracciones del lienzo, así que el ajuste se mantiene en cualquier tamaño.
*/
const ESCALA_SOBRE_LA_ESCENA = 0.78;
const DESPLAZAMIENTO_HORIZONTAL = -0.265;
const DESPLAZAMIENTO_VERTICAL = -0.028;

/*
  La cámara del render no hace un acercamiento frontal sino un arco: midiendo el centroide de
  los píxeles opacos, el micrófono cruza el 61,2 % del encuadre en horizontal y el 32,6 % en
  vertical entre el primer fotograma y el 28, es decir que se va del atril y termina flotando
  sobre las butacas de la izquierda.

  Estas dos constantes deshacen esa deriva desplazando el dibujo en sentido contrario según el
  avance, de modo que el micrófono se queda clavado sobre la madera y lo único que cambia es
  su tamaño, que es la lectura que la escena necesita: no es la cámara la que orbita, es el
  micrófono el que llega.
*/
const DERIVA_HORIZONTAL_A_COMPENSAR = 0.612;
const DERIVA_VERTICAL_A_COMPENSAR = 0.326;

const RELACION_DE_ASPECTO = 16 / 9;
const FOTOGRAMA_EN_REPOSO = 24;

function construirRuta(carpeta: string, numero: number): string {
  return `${RUTA_DE_LOS_FOTOGRAMAS}/${carpeta}/alfa_${String(numero).padStart(4, "0")}.webp`;
}

class VentanaDeFotogramas {
  private readonly carpeta: string;
  private readonly alLlegarUno: (numero: number) => void;
  private readonly decodificados = new Map<number, ImageBitmap>();
  private readonly enCurso = new Map<number, Promise<void>>();
  private deseados = new Set<number>();
  private readonly abortar = new AbortController();
  private descartada = false;

  constructor(carpeta: string, alLlegarUno: (numero: number) => void) {
    this.carpeta = carpeta;
    this.alLlegarUno = alLlegarUno;
  }

  centrarEn(numero: number, haciaDelante: boolean): void {
    if (this.descartada) {
      return;
    }

    const porOrdenDePrioridad: number[] = [numero];
    for (let distancia = 1; distancia <= RADIO_DE_LA_VENTANA; distancia += 1) {
      const delantero = haciaDelante ? numero + distancia : numero - distancia;
      const trasero = haciaDelante ? numero - distancia : numero + distancia;
      if (delantero >= PRIMER_FOTOGRAMA && delantero <= ULTIMO_FOTOGRAMA_DEL_RECORRIDO) {
        porOrdenDePrioridad.push(delantero);
      }
      if (trasero >= PRIMER_FOTOGRAMA && trasero <= ULTIMO_FOTOGRAMA_DEL_RECORRIDO) {
        porOrdenDePrioridad.push(trasero);
      }
    }

    this.deseados = new Set(porOrdenDePrioridad);
    this.liberarLosQueSobran();
    for (const cadaUno of porOrdenDePrioridad) {
      this.pedir(cadaUno);
    }
  }

  masCercanoDisponible(numero: number): ImageBitmap | null {
    const exacto = this.decodificados.get(numero);
    if (exacto) {
      return exacto;
    }
    for (let distancia = 1; distancia <= RADIO_DE_LA_VENTANA; distancia += 1) {
      const anterior = this.decodificados.get(numero - distancia);
      if (anterior) {
        return anterior;
      }
      const siguiente = this.decodificados.get(numero + distancia);
      if (siguiente) {
        return siguiente;
      }
    }
    return null;
  }

  descartar(): void {
    this.descartada = true;
    this.abortar.abort();
    this.deseados = new Set();
    this.liberarLosQueSobran();
  }

  private liberarLosQueSobran(): void {
    for (const [numero, fotograma] of this.decodificados) {
      if (!this.deseados.has(numero)) {
        fotograma.close();
        this.decodificados.delete(numero);
      }
    }
  }

  private pedir(numero: number): void {
    if (this.decodificados.has(numero) || this.enCurso.has(numero)) {
      return;
    }

    const descarga = (async () => {
      try {
        const respuesta = await fetch(construirRuta(this.carpeta, numero), {
          signal: this.abortar.signal,
        });
        if (!respuesta.ok) {
          return;
        }
        const fotograma = await createImageBitmap(await respuesta.blob());
        /*
          Entre la petición y la llegada la ventana pudo moverse: guardar aquí lo que ya nadie
          quiere es exactamente la fuga que esta clase existe para evitar.
        */
        if (this.descartada || !this.deseados.has(numero)) {
          fotograma.close();
          return;
        }
        this.decodificados.set(numero, fotograma);
        this.alLlegarUno(numero);
      } catch {
        return;
      } finally {
        this.enCurso.delete(numero);
      }
    })();

    this.enCurso.set(numero, descarga);
  }
}

export function MicrofonoEnEscena() {
  const escenaRef = useRef<HTMLDivElement | null>(null);
  const lienzoRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const escena = escenaRef.current;
    const lienzo = lienzoRef.current;
    const contexto = lienzo?.getContext("2d");
    if (!escena || !lienzo || !contexto) {
      return;
    }

    registerGsapPlugins();

    const carpeta = window.innerWidth <= ANCHO_DE_CORTE_PARA_MOVIL ? "mobile" : "desktop";
    let ultimoDibujado = PRIMER_FOTOGRAMA;

    const ajustarLienzo = () => {
      const densidad = Math.min(window.devicePixelRatio || 1, DENSIDAD_MAXIMA);
      lienzo.width = Math.round(lienzo.clientWidth * densidad);
      lienzo.height = Math.round(lienzo.clientHeight * densidad);
    };

    const dibujar = (fotograma: ImageBitmap | null, numero: number) => {
      if (!fotograma) {
        return;
      }
      const avanceDelRecorrido =
        (numero - PRIMER_FOTOGRAMA) /
        (ULTIMO_FOTOGRAMA_DEL_RECORRIDO - PRIMER_FOTOGRAMA);
      const ancho = lienzo.width;
      const alto = lienzo.height;

      /*
        Limpiar y no rellenar: el fotograma trae transparencia y lo que hay debajo es la
        fotografía de la sala, que tiene que seguir viéndose.
      */
      contexto.clearRect(0, 0, ancho, alto);

      const anchoBase = ancho >= alto * RELACION_DE_ASPECTO ? ancho : alto * RELACION_DE_ASPECTO;
      const anchoDestino = anchoBase * ESCALA_SOBRE_LA_ESCENA;
      const altoDestino = anchoDestino / RELACION_DE_ASPECTO;
      const x =
        (ancho - anchoDestino) / 2 +
        ancho * DESPLAZAMIENTO_HORIZONTAL +
        anchoDestino * DERIVA_HORIZONTAL_A_COMPENSAR * avanceDelRecorrido;
      const y =
        (alto - altoDestino) / 2 +
        alto * DESPLAZAMIENTO_VERTICAL +
        altoDestino * DERIVA_VERTICAL_A_COMPENSAR * avanceDelRecorrido;

      contexto.drawImage(fotograma, x, y, anchoDestino, altoDestino);
    };

    const ventana = new VentanaDeFotogramas(carpeta, (numero) => {
      if (numero === ultimoDibujado) {
        dibujar(ventana.masCercanoDisponible(numero), numero);
      }
    });

    ajustarLienzo();

    if (prefersReducedMotionNow()) {
      ventana.centrarEn(FOTOGRAMA_EN_REPOSO, true);
      ultimoDibujado = FOTOGRAMA_EN_REPOSO;
      const alRedimensionar = () => {
        ajustarLienzo();
        dibujar(ventana.masCercanoDisponible(FOTOGRAMA_EN_REPOSO), FOTOGRAMA_EN_REPOSO);
      };
      window.addEventListener("resize", alRedimensionar);
      return () => {
        window.removeEventListener("resize", alRedimensionar);
        ventana.descartar();
      };
    }

    ventana.centrarEn(PRIMER_FOTOGRAMA, true);

    const avance = { fotograma: PRIMER_FOTOGRAMA };
    const recorrido = gsap.to(avance, {
      fotograma: ULTIMO_FOTOGRAMA_DEL_RECORRIDO,
      ease: "none",
      onUpdate: () => {
        const numero = Math.round(avance.fotograma);
        const haciaDelante = numero >= ultimoDibujado;
        if (numero !== ultimoDibujado) {
          ultimoDibujado = numero;
          ventana.centrarEn(numero, haciaDelante);
        }
        dibujar(ventana.masCercanoDisponible(numero), numero);
      },
      scrollTrigger: {
        trigger: escena,
        start: "top 88%",
        end: "bottom 42%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    const alRedimensionar = () => {
      ajustarLienzo();
      dibujar(ventana.masCercanoDisponible(ultimoDibujado), ultimoDibujado);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", alRedimensionar);

    return () => {
      window.removeEventListener("resize", alRedimensionar);
      recorrido.scrollTrigger?.kill();
      recorrido.kill();
      ventana.descartar();
    };
  }, []);

  return (
    <div ref={escenaRef} className="pod-microfono">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${RUTA_DE_LOS_FOTOGRAMAS}/atril-1600.webp`}
        srcSet={`${RUTA_DE_LOS_FOTOGRAMAS}/atril-900.webp 900w, ${RUTA_DE_LOS_FOTOGRAMAS}/atril-1600.webp 1600w`}
        sizes="(min-width: 78rem) 1152px, calc(100vw - 3rem)"
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        className="pod-microfono__sala"
      />
      <canvas ref={lienzoRef} className="pod-microfono__lienzo" aria-hidden="true" />
    </div>
  );
}
