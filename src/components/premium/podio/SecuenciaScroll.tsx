"use client";

/*
  Secuencia de imágenes dibujada en un canvas y avanzada por la posición de scroll.

  Es el método de las páginas de producto de Apple: en lugar de scrubbear un <video>
  (que en Safari iOS salta entre keyframes y no responde bien al scroll hacia atrás),
  se precarga una secuencia de WebP y se dibuja el frame que corresponde al progreso.
  El control es exacto y bidireccional en todas las plataformas.

  Integrado con ScrollTrigger porque es el sistema de movimiento del resto de /g/*, y
  así hereda la sincronía con Lenis que monta SmoothScroll. La lógica de precarga
  (frames clave primero, resto en tiempo ocioso) y el respaldo al frame más cercano ya
  cargado son propias: garantizan que un scroll rápido nunca deje el lienzo en blanco.

  Con prefers-reduced-motion no se instala el ScrollTrigger: se dibuja un único frame
  representativo y la sección se comporta como una imagen fija.

  Nació para /g/podio y hoy lo consume también el hero de /g/fusion, que sustituyó su
  video de fondo por esta misma secuencia. De ahí las tres propiedades opcionales de
  encuadre, duración y clase del lienzo: sus valores por defecto reproducen exactamente
  el comportamiento de Podio, así que montar la secuencia en otra ruta no la altera.
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

const FRAMES_DE_PRECARGA_PRIORITARIA = [1, 24, 48, 72, 96];
const CANTIDAD_DE_FRAMES_INICIALES = 12;
const FRAME_REPRESENTATIVO_SIN_MOVIMIENTO = 78;

const RELACION_DE_ASPECTO_DE_LA_SECUENCIA = 16 / 9;
const RELACION_MINIMA_PARA_RECORTAR = 1.25;
const FACTOR_DE_ENCUADRE_VERTICAL = 0.42;
const DENSIDAD_MAXIMA_DE_PIXELES = 2;
const COLOR_DE_FONDO_DEL_LIENZO = "#080603";

const DURACION_DEL_RECORRIDO_EN_PANTALLAS = 4;
const SUAVIZADO_DEL_SCRUB_EN_SEGUNDOS = 0.45;
const CLASE_DEL_LIENZO_POR_DEFECTO = "pod-secuencia__lienzo";

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

function cargarImagen(rutaDeImagen: string): Promise<HTMLImageElement | null> {
  return new Promise((resolver) => {
    const imagen = new Image();
    imagen.decoding = "async";
    imagen.onload = () => resolver(imagen);
    imagen.onerror = () => resolver(null);
    imagen.src = rutaDeImagen;
  });
}

class BancoDeFrames {
  private readonly carpetaBase: string;
  private readonly imagenes: Array<HTMLImageElement | null>;
  private readonly framesYaSolicitados: Set<number>;
  private descartado = false;

  constructor(carpetaBase: string) {
    this.carpetaBase = carpetaBase;
    this.imagenes = new Array(CANTIDAD_DE_FRAMES + PRIMER_FRAME).fill(null);
    this.framesYaSolicitados = new Set();
  }

  descartar(): void {
    this.descartado = true;
  }

  async cargarFrame(numeroDeFrame: number): Promise<HTMLImageElement | null> {
    if (this.framesYaSolicitados.has(numeroDeFrame)) {
      return this.imagenes[numeroDeFrame];
    }
    this.framesYaSolicitados.add(numeroDeFrame);
    const imagen = await cargarImagen(construirRutaDeFrame(this.carpetaBase, numeroDeFrame));
    if (!this.descartado) {
      this.imagenes[numeroDeFrame] = imagen;
    }
    return imagen;
  }

  async cargarFramesPrioritarios(): Promise<void> {
    await Promise.all(
      FRAMES_DE_PRECARGA_PRIORITARIA.map((numeroDeFrame) => this.cargarFrame(numeroDeFrame)),
    );
    const framesIniciales = Array.from(
      { length: CANTIDAD_DE_FRAMES_INICIALES },
      (_, indice) => PRIMER_FRAME + indice,
    );
    await Promise.all(framesIniciales.map((numeroDeFrame) => this.cargarFrame(numeroDeFrame)));
  }

  cargarRestoEnTiempoOcioso(): void {
    const agendarSiguiente = window.requestIdleCallback ?? window.requestAnimationFrame;
    const cargarDesde = (numeroDeFrame: number) => {
      if (numeroDeFrame > CANTIDAD_DE_FRAMES || this.descartado) {
        return;
      }
      void this.cargarFrame(numeroDeFrame).then(() => {
        agendarSiguiente(() => cargarDesde(numeroDeFrame + 1));
      });
    };
    cargarDesde(PRIMER_FRAME);
  }

  obtenerFrameMasCercanoDisponible(numeroDeFrame: number): HTMLImageElement | null {
    const frameExacto = this.imagenes[numeroDeFrame];
    if (frameExacto) {
      return frameExacto;
    }
    for (let distancia = 1; distancia < CANTIDAD_DE_FRAMES; distancia += 1) {
      const frameAnterior = this.imagenes[numeroDeFrame - distancia];
      if (frameAnterior) {
        return frameAnterior;
      }
      const frameSiguiente = this.imagenes[numeroDeFrame + distancia];
      if (frameSiguiente) {
        return frameSiguiente;
      }
    }
    return null;
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

  dibujarAjustado(imagen: HTMLImageElement | null): void {
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

    const banco = new BancoDeFrames(elegirCarpetaSegunAnchoDePantalla());
    const lienzo = new LienzoDeSecuencia(elementoCanvas, modoDeEncuadre);
    const sinMovimiento = prefersReducedMotionNow();

    let disparadorDeScroll: ScrollTrigger | null = null;
    let cancelado = false;

    const redibujarSegunProgreso = (progreso: number) => {
      const frameObjetivo = calcularFrameDesdeProgreso(progreso);
      void banco.cargarFrame(frameObjetivo);
      lienzo.dibujarAjustado(banco.obtenerFrameMasCercanoDisponible(frameObjetivo));
      notificarProgresoRef.current?.(progreso);
    };

    const atenderCambioDeTamano = () => {
      lienzo.ajustarADimensionesDePantalla();
      redibujarSegunProgreso(disparadorDeScroll?.progress ?? 0);
    };

    void banco.cargarFramesPrioritarios().then(() => {
      if (cancelado) {
        return;
      }
      elementoSeccion.dataset.secuenciaLista = "true";

      if (sinMovimiento) {
        lienzo.dibujarAjustado(
          banco.obtenerFrameMasCercanoDisponible(FRAME_REPRESENTATIVO_SIN_MOVIMIENTO),
        );
        banco.cargarRestoEnTiempoOcioso();
        return;
      }

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
      banco.cargarRestoEnTiempoOcioso();
    });

    window.addEventListener("resize", atenderCambioDeTamano);

    return () => {
      cancelado = true;
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
