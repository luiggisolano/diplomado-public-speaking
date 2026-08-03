"use client";

/*
  Secuencia de imágenes dibujada en un canvas y avanzada por la posición de scroll.

  Es el método de las páginas de producto de Apple: en lugar de scrubbear un <video>
  (que en Safari iOS salta entre keyframes y no responde bien al scroll hacia atrás),
  se precarga una secuencia de WebP y se dibuja el frame que corresponde al progreso.
  El control es exacto y bidireccional en todas las plataformas.

  Integrado con ScrollTrigger porque es el sistema de movimiento del resto de /g/*, y
  así hereda la sincronía con Lenis que monta SmoothScroll. El respaldo al frame más
  cercano ya cargado es propio: garantiza que un scroll rápido nunca deje el lienzo en
  blanco.

  Con prefers-reduced-motion no se instala el ScrollTrigger: se dibuja un único frame
  representativo y la sección se comporta como una imagen fija.

  Nació para /g/podio y hoy lo consume también el hero de /g/fusion, que sustituyó su
  video de fondo por esta misma secuencia. De ahí las tres propiedades opcionales de
  encuadre, duración y clase del lienzo: sus valores por defecto reproducen exactamente
  el comportamiento de Podio, así que montar la secuencia en otra ruta no la altera.

  MEMORIA (2026-08-03). El precio de este método no es el peso en disco sino el de la
  imagen ya descomprimida: los 96 WebP ocupan 3,4 MB en el servidor y 338 MiB en RAM en
  cuanto se dibujan (1280·720·4 bytes cada uno). La primera versión sostenía los 96 vivos
  a la vez y medía +440 MB de residente sobre la misma página sin lienzo. Por eso aquí:

    · Los frames se manejan como ImageBitmap y no como HTMLImageElement, porque son lo
      único que se puede liberar de forma determinista, con close(). Con un <img> la
      decisión de cuándo soltar el bitmap decodificado es del navegador, y no la suelta.
    · Solo se sostiene una ventana alrededor del frame en pantalla; lo que sale de ella se
      cierra en el acto. El techo pasa de los 96 frames a RADIO·2+1, unos 60 MB.
    · Recuperar un frame ya visto no vuelve a la red: el WebP sigue en el caché HTTP del
      navegador y solo se paga la decodificación, que además ocurre fuera del hilo
      principal porque createImageBitmap es asíncrono de verdad.
*/

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins } from "../_shared/gsapSetup";
import { prefersReducedMotionNow } from "../_shared/useReducedMotion";

const CANTIDAD_DE_FRAMES = 96;
const PRIMER_FRAME = 1;
const DIGITOS_DE_NUMERACION = 4;
const PREFIJO_DE_ARCHIVO = "frame_";
const EXTENSION_DE_ARCHIVO = "webp";
const RUTA_SECUENCIA_ESCRITORIO = "/podio/frames/desktop";
const RUTA_SECUENCIA_MOVIL = "/podio/frames/mobile";
const ANCHO_MAXIMO_PARA_SECUENCIA_MOVIL = 820;

/*
  Cuántos frames se sostienen a cada lado del que está en pantalla. Ocho cubre un tercio de
  segundo de recorrido a velocidad de lectura, que es cuanto tarda un frame en decodificarse
  desde el caché, y deja el techo de memoria en diecisiete frames: 60 MB en escritorio y
  23 MB en móvil, frente a los 338 y 132 MiB que costaba sostener la secuencia entera.
*/
const RADIO_DE_LA_VENTANA_DE_FRAMES = 8;
const FRAME_REPRESENTATIVO_SIN_MOVIMIENTO = 78;

const RELACION_DE_ASPECTO_DE_LA_SECUENCIA = 16 / 9;
const RELACION_MINIMA_PARA_RECORTAR = 1.25;
const FACTOR_DE_ENCUADRE_VERTICAL = 0.42;
const DENSIDAD_MAXIMA_DE_PIXELES = 2;
const COLOR_DE_FONDO_DEL_LIENZO = "#080603";

const DURACION_DEL_RECORRIDO_EN_PANTALLAS = 4;
const SUAVIZADO_DEL_SCRUB_EN_SEGUNDOS = 0.45;
const CLASE_DEL_LIENZO_POR_DEFECTO = "pod-secuencia__lienzo";

const SENTIDO_HACIA_ADELANTE = 1;

/*
  «auto» respeta la relación de la secuencia y muestra el encuadre entero cuando la
  pantalla es más vertical que RELACION_MINIMA_PARA_RECORTAR, para que en un móvil no se
  pierda la sala llena del primer tramo: es lo que necesita Podio, donde la imagen ES la
  narración. «cubrir» llena siempre el lienzo recortando lo que sobre, que es lo que hacía
  el object-fit: cover del video al que sustituye en el hero de Fusión, donde la imagen es
  fondo cinematográfico detrás de un titular y las bandas negras la delatarían.
*/
type ModoDeEncuadre = "auto" | "cubrir";

type SecuenciaScrollProps = {
  seccionRef: React.RefObject<HTMLElement | null>;
  onProgreso?: (progreso: number) => void;
  claseDelLienzo?: string;
  pantallasDeRecorrido?: number;
  modoDeEncuadre?: ModoDeEncuadre;
};

function construirRutaDeFrame(carpetaBase: string, numeroDeFrame: number): string {
  const numeracion = String(numeroDeFrame).padStart(DIGITOS_DE_NUMERACION, "0");
  return `${carpetaBase}/${PREFIJO_DE_ARCHIVO}${numeracion}.${EXTENSION_DE_ARCHIVO}`;
}

function elegirCarpetaSegunAnchoDePantalla(): string {
  const esPantallaPequena = window.matchMedia(
    `(max-width: ${ANCHO_MAXIMO_PARA_SECUENCIA_MOVIL}px)`,
  ).matches;
  return esPantallaPequena ? RUTA_SECUENCIA_MOVIL : RUTA_SECUENCIA_ESCRITORIO;
}

function estaDentroDeLaSecuencia(numeroDeFrame: number): boolean {
  return numeroDeFrame >= PRIMER_FRAME && numeroDeFrame <= CANTIDAD_DE_FRAMES;
}

/*
  Sostiene los frames decodificados que hacen falta ahora mismo y solo esos. Cada llamada a
  asegurarVentana declara el nuevo centro; lo que queda fuera se cierra, y lo que falta se
  pide en orden de cercanía al centro, dando preferencia al sentido en que se está moviendo
  el scroll para que la decodificación vaya por delante de la vista y no por detrás.
*/
class BancoDeFrames {
  private readonly carpetaBase: string;
  private readonly alQuedarDisponibleUnFrame: (numeroDeFrame: number) => void;
  private readonly framesDecodificados = new Map<number, ImageBitmap>();
  private readonly cargasEnCurso = new Map<number, Promise<void>>();
  private readonly abortarDescargas = new AbortController();
  private framesDeseados = new Set<number>();
  private descartado = false;

  constructor(carpetaBase: string, alQuedarDisponibleUnFrame: (numeroDeFrame: number) => void) {
    this.carpetaBase = carpetaBase;
    this.alQuedarDisponibleUnFrame = alQuedarDisponibleUnFrame;
  }

  descartar(): void {
    this.descartado = true;
    this.abortarDescargas.abort();
    for (const frame of this.framesDecodificados.values()) {
      frame.close();
    }
    this.framesDecodificados.clear();
    this.framesDeseados.clear();
  }

  asegurarVentana(centro: number, sentido: number = SENTIDO_HACIA_ADELANTE): void {
    if (this.descartado) {
      return;
    }

    const enOrdenDePrioridad: number[] = [centro];
    for (let distancia = 1; distancia <= RADIO_DE_LA_VENTANA_DE_FRAMES; distancia += 1) {
      const delantero = centro + distancia * sentido;
      const trasero = centro - distancia * sentido;
      if (estaDentroDeLaSecuencia(delantero)) {
        enOrdenDePrioridad.push(delantero);
      }
      if (estaDentroDeLaSecuencia(trasero)) {
        enOrdenDePrioridad.push(trasero);
      }
    }

    this.framesDeseados = new Set(enOrdenDePrioridad);
    this.liberarLosQueSalieronDeLaVentana();

    for (const numeroDeFrame of enOrdenDePrioridad) {
      this.pedirFrame(numeroDeFrame);
    }
  }

  /*
    Camino aparte para movimiento reducido: ahí no hay recorrido, se dibuja un fotograma y
    ya, así que sostener una ventana entera sería pagar dieciséis decodificaciones que nadie
    va a ver.
  */
  cargarUnicoFrame(numeroDeFrame: number): void {
    if (this.descartado) {
      return;
    }
    this.framesDeseados = new Set([numeroDeFrame]);
    this.liberarLosQueSalieronDeLaVentana();
    this.pedirFrame(numeroDeFrame);
  }

  obtenerFrameMasCercanoDisponible(numeroDeFrame: number): ImageBitmap | null {
    const frameExacto = this.framesDecodificados.get(numeroDeFrame);
    if (frameExacto) {
      return frameExacto;
    }
    for (let distancia = 1; distancia <= RADIO_DE_LA_VENTANA_DE_FRAMES; distancia += 1) {
      const frameAnterior = this.framesDecodificados.get(numeroDeFrame - distancia);
      if (frameAnterior) {
        return frameAnterior;
      }
      const frameSiguiente = this.framesDecodificados.get(numeroDeFrame + distancia);
      if (frameSiguiente) {
        return frameSiguiente;
      }
    }
    return null;
  }

  private liberarLosQueSalieronDeLaVentana(): void {
    for (const [numeroDeFrame, frame] of this.framesDecodificados) {
      if (!this.framesDeseados.has(numeroDeFrame)) {
        frame.close();
        this.framesDecodificados.delete(numeroDeFrame);
      }
    }
  }

  private pedirFrame(numeroDeFrame: number): void {
    if (this.framesDecodificados.has(numeroDeFrame) || this.cargasEnCurso.has(numeroDeFrame)) {
      return;
    }

    const descarga = this.descargarYDecodificar(numeroDeFrame)
      .then((frame) => {
        this.cargasEnCurso.delete(numeroDeFrame);
        if (!frame) {
          return;
        }
        /*
          Entre que se pidió y llegó, la ventana pudo haberse movido. Guardar aquí un frame
          que ya nadie quiere sería exactamente la fuga que este banco existe para evitar.
        */
        if (this.descartado || !this.framesDeseados.has(numeroDeFrame)) {
          frame.close();
          return;
        }
        this.framesDecodificados.set(numeroDeFrame, frame);
        this.alQuedarDisponibleUnFrame(numeroDeFrame);
      })
      .catch(() => {
        this.cargasEnCurso.delete(numeroDeFrame);
      });

    this.cargasEnCurso.set(numeroDeFrame, descarga);
  }

  private async descargarYDecodificar(numeroDeFrame: number): Promise<ImageBitmap | null> {
    try {
      const respuesta = await fetch(construirRutaDeFrame(this.carpetaBase, numeroDeFrame), {
        signal: this.abortarDescargas.signal,
      });
      if (!respuesta.ok) {
        return null;
      }
      return await createImageBitmap(await respuesta.blob());
    } catch {
      return null;
    }
  }
}

class LienzoDeSecuencia {
  private readonly elementoCanvas: HTMLCanvasElement;
  private readonly contexto: CanvasRenderingContext2D | null;
  private readonly modoDeEncuadre: ModoDeEncuadre;

  constructor(elementoCanvas: HTMLCanvasElement, modoDeEncuadre: ModoDeEncuadre) {
    this.elementoCanvas = elementoCanvas;
    this.contexto = elementoCanvas.getContext("2d", { alpha: false });
    this.modoDeEncuadre = modoDeEncuadre;
    this.ajustarADimensionesDePantalla();
  }

  ajustarADimensionesDePantalla(): void {
    const densidadDePixeles = Math.min(window.devicePixelRatio || 1, DENSIDAD_MAXIMA_DE_PIXELES);
    this.elementoCanvas.width = Math.round(this.elementoCanvas.clientWidth * densidadDePixeles);
    this.elementoCanvas.height = Math.round(this.elementoCanvas.clientHeight * densidadDePixeles);
  }

  dibujarAjustado(imagen: ImageBitmap | null): void {
    if (!imagen || !this.contexto) {
      return;
    }
    const anchoDelLienzo = this.elementoCanvas.width;
    const altoDelLienzo = this.elementoCanvas.height;
    const relacionDelLienzo = anchoDelLienzo / altoDelLienzo;

    const debeMostrarseEntero =
      this.modoDeEncuadre === "auto" && relacionDelLienzo < RELACION_MINIMA_PARA_RECORTAR;
    let anchoDeDestino: number;
    let altoDeDestino: number;

    if (debeMostrarseEntero || relacionDelLienzo >= RELACION_DE_ASPECTO_DE_LA_SECUENCIA) {
      anchoDeDestino = anchoDelLienzo;
      altoDeDestino = anchoDelLienzo / RELACION_DE_ASPECTO_DE_LA_SECUENCIA;
    } else {
      altoDeDestino = altoDelLienzo;
      anchoDeDestino = altoDelLienzo * RELACION_DE_ASPECTO_DE_LA_SECUENCIA;
    }

    const desplazamientoX = (anchoDelLienzo - anchoDeDestino) / 2;
    const desplazamientoY = (altoDelLienzo - altoDeDestino) * FACTOR_DE_ENCUADRE_VERTICAL;

    this.contexto.fillStyle = COLOR_DE_FONDO_DEL_LIENZO;
    this.contexto.fillRect(0, 0, anchoDelLienzo, altoDelLienzo);
    this.contexto.drawImage(imagen, desplazamientoX, desplazamientoY, anchoDeDestino, altoDeDestino);
  }
}

function calcularFrameDesdeProgreso(progreso: number): number {
  const posicion = PRIMER_FRAME + progreso * (CANTIDAD_DE_FRAMES - PRIMER_FRAME);
  return Math.min(Math.max(Math.round(posicion), PRIMER_FRAME), CANTIDAD_DE_FRAMES);
}

export function SecuenciaScroll({
  seccionRef,
  onProgreso,
  claseDelLienzo = CLASE_DEL_LIENZO_POR_DEFECTO,
  pantallasDeRecorrido = DURACION_DEL_RECORRIDO_EN_PANTALLAS,
  modoDeEncuadre = "auto",
}: SecuenciaScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const notificarProgresoRef = useRef(onProgreso);

  useEffect(() => {
    notificarProgresoRef.current = onProgreso;
  }, [onProgreso]);

  useEffect(() => {
    const elementoCanvas = canvasRef.current;
    const elementoSeccion = seccionRef.current;
    if (!elementoCanvas || !elementoSeccion) {
      return;
    }

    registerGsapPlugins();

    const lienzo = new LienzoDeSecuencia(elementoCanvas, modoDeEncuadre);
    const sinMovimiento = prefersReducedMotionNow();

    let disparadorDeScroll: ScrollTrigger | null = null;
    let frameEnPantalla = PRIMER_FRAME;
    let elLienzoYaTieneImagen = false;

    /*
      Un frame que llega tarde solo se pinta si sigue siendo el que toca. Sin esta guarda,
      la ventana entera se dibujaría en cascada según fuera decodificando y el recorrido
      daría saltos hacia atrás.

      El primer frame que se pinta es además el que da por lista la sección: hasta entonces
      la portada mantiene su fondo macizo, porque retirarlo antes descubriría un lienzo en
      negro en lugar del auditorio.
    */
    const banco = new BancoDeFrames(elegirCarpetaSegunAnchoDePantalla(), (numeroDeFrame) => {
      if (numeroDeFrame !== frameEnPantalla) {
        return;
      }
      lienzo.dibujarAjustado(banco.obtenerFrameMasCercanoDisponible(numeroDeFrame));
      if (!elLienzoYaTieneImagen) {
        elLienzoYaTieneImagen = true;
        elementoSeccion.dataset.secuenciaLista = "true";
      }
    });

    const redibujarSegunProgreso = (progreso: number) => {
      const frameObjetivo = calcularFrameDesdeProgreso(progreso);
      const sentido = frameObjetivo >= frameEnPantalla ? 1 : -1;
      frameEnPantalla = frameObjetivo;
      banco.asegurarVentana(frameObjetivo, sentido);
      lienzo.dibujarAjustado(banco.obtenerFrameMasCercanoDisponible(frameObjetivo));
      notificarProgresoRef.current?.(progreso);
    };

    const atenderCambioDeTamano = () => {
      lienzo.ajustarADimensionesDePantalla();
      redibujarSegunProgreso(disparadorDeScroll?.progress ?? 0);
    };

    if (sinMovimiento) {
      frameEnPantalla = FRAME_REPRESENTATIVO_SIN_MOVIMIENTO;
      banco.cargarUnicoFrame(FRAME_REPRESENTATIVO_SIN_MOVIMIENTO);
    } else {
      disparadorDeScroll = ScrollTrigger.create({
        trigger: elementoSeccion,
        start: "top top",
        end: `+=${pantallasDeRecorrido * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: SUAVIZADO_DEL_SCRUB_EN_SEGUNDOS,
        onUpdate: (self) => redibujarSegunProgreso(self.progress),
        onRefresh: (self) => redibujarSegunProgreso(self.progress),
      });

      redibujarSegunProgreso(0);
    }

    window.addEventListener("resize", atenderCambioDeTamano);

    return () => {
      banco.descartar();
      window.removeEventListener("resize", atenderCambioDeTamano);
      disparadorDeScroll?.kill();
      gsap.killTweensOf(elementoCanvas);
    };
  }, [seccionRef, pantallasDeRecorrido, modoDeEncuadre]);

  return (
    <canvas
      ref={canvasRef}
      className={claseDelLienzo}
      aria-hidden="true"
      data-secuencia-canvas
    />
  );
}
