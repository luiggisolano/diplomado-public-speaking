"use client";

/*
  Hero de la dirección "Fusión". Toma la coreografía tipográfica de Cámara Anecoica
  (revelado palabra a palabra con SplitText, anclaje editorial a la izquierda, rail de
  metadatos y señal de scroll) y la monta sobre la SECUENCIA DE FRAMES scroll-driven que
  antes era un video en bucle: el mismo dolly-in de auditorio, pero avanzado por la
  posición de scroll en vez de por el reloj del reproductor.

  El cambio no es solo de formato. Un video en autoplay corre a su ritmo y el visitante
  llega tarde o temprano a un fotograma cualquiera; aquí la cámara solo avanza si él la
  empuja, y el recorrido termina siempre en el primer plano del micrófono, que es el
  remate que la pieza necesita. Por eso la sección se pinnea: durante el recorrido el
  titular se mantiene y, pasado el tramo medio, se retira para dejar el último tercio del
  travelling limpio antes de soltar el pin.

  El velo lateral e inferior (fus-hero-scrim) sigue garantizando el contraste del texto
  hueso sobre la imagen. Con reduced-motion SecuenciaScroll no instala el ScrollTrigger:
  dibuja un frame representativo, la sección deja de pinnearse y el texto queda visible de
  inmediato a plena opacidad. El lienzo es aria-hidden (decorativo); el copy proviene de
  lib/variants-content (fuente única).
*/

import { useCallback, useEffect, useRef } from "react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import { SecuenciaScroll } from "@/components/premium/podio/SecuenciaScroll";
import {
  SHARED_CONTACT,
  SHARED_CTA,
  SHARED_HERO,
} from "@/lib/variants-content";

/*
  Menos pantallas que en Podio (cuatro), donde el pin tiene que sostener el relevo de
  cuatro capítulos de texto. Aquí el copy es un solo bloque: con un recorrido más largo el
  visitante scrollearía mirando el mismo titular.
*/
const PANTALLAS_DE_RECORRIDO = 2.5;

/*
  Tramo en el que el bloque de texto se retira. Arranca pasada la mitad, cuando la cámara
  ya abandonó el plano general, y termina antes del final para que el primer plano del
  micrófono se vea sin nada encima.
*/
const PROGRESO_DE_INICIO_DE_SALIDA = 0.62;
const PROGRESO_DE_FIN_DE_SALIDA = 0.92;

/*
  La señal de scroll desaparece en cuanto la secuencia se mueve: ya cumplió su función de
  avisar de que la página responde al scroll.
*/
const PROGRESO_QUE_OCULTA_LA_SENAL = 0.04;

/*
  Por debajo de esta presencia el bloque está prácticamente invisible y deja de recibir
  puntero: un botón de inscripción transparente pero clicable es una trampa para quien
  pasa por encima buscando la imagen.
*/
const PRESENCIA_MINIMA_QUE_MANTIENE_EL_PUNTERO = 0.06;

function calcularPresenciaDelTexto(progreso: number): number {
  const avanceDeSalida =
    (progreso - PROGRESO_DE_INICIO_DE_SALIDA) /
    (PROGRESO_DE_FIN_DE_SALIDA - PROGRESO_DE_INICIO_DE_SALIDA);
  return 1 - Math.min(Math.max(avanceDeSalida, 0), 1);
}

export function FusionHero() {
  const seccionRef = useRef<HTMLElement | null>(null);
  const salidaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const lineOneRef = useRef<HTMLSpanElement | null>(null);
  const lineTwoRef = useRef<HTMLSpanElement | null>(null);
  const lineThreeRef = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const microRef = useRef<HTMLParagraphElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  /*
    La retirada se escribe sobre el contenedor exterior, no sobre los elementos que anima
    el timeline de entrada: si compartieran nodo, ambos escribirían la misma propiedad y el
    revelado inicial pelearía con el scroll. La presencia viaja como variable CSS para que
    el navegador la resuelva en el compositor sin recalcular estilos por frame.
  */
  const responderAlProgreso = useCallback((progreso: number) => {
    const presencia = calcularPresenciaDelTexto(progreso);
    const bloqueDeSalida = salidaRef.current;
    if (bloqueDeSalida) {
      bloqueDeSalida.style.setProperty("--fus-presencia", String(presencia));
      bloqueDeSalida.dataset.retirado =
        presencia < PRESENCIA_MINIMA_QUE_MANTIENE_EL_PUNTERO ? "true" : "false";
    }
    if (cueRef.current) {
      cueRef.current.dataset.oculto =
        progreso > PROGRESO_QUE_OCULTA_LA_SENAL ? "true" : "false";
    }
  }, []);

  useEffect(() => {
    registerGsapPlugins();

    const content = contentRef.current;
    const cue = cueRef.current;
    const lineElements = [
      lineOneRef.current,
      lineTwoRef.current,
      lineThreeRef.current,
    ].filter((element): element is HTMLSpanElement => element !== null);

    if (prefersReducedMotionNow()) {
      content?.style.setProperty("opacity", "1");
      cue?.style.setProperty("opacity", "1");
      return;
    }

    const splits = lineElements.map(
      (element) =>
        new SplitText(element, { type: "words", wordsClass: "cam-word" }),
    );
    const words = splits.flatMap((split) => split.words);

    gsap.set(words, { yPercent: 115, opacity: 0 });
    gsap.set(
      [kickerRef.current, subRef.current, ctaRef.current, microRef.current],
      { opacity: 0, y: 14 },
    );
    gsap.set(cue, { opacity: 0, y: 12 });
    gsap.set(content, { opacity: 1 });

    const timeline = gsap.timeline({
      delay: 0.15,
      defaults: { ease: "power4.out" },
    });

    timeline
      .to(kickerRef.current, { opacity: 1, y: 0, duration: 0.7 })
      .to(
        words,
        { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.05 },
        "-=0.25",
      )
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
      .to(microRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
      .to(cue, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

    return () => {
      timeline.kill();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section
      ref={seccionRef}
      aria-labelledby="hero-title"
      className="fus-hero"
    >
      <SecuenciaScroll
        seccionRef={seccionRef}
        onProgreso={responderAlProgreso}
        claseDelLienzo="fus-hero-lienzo"
        pantallasDeRecorrido={PANTALLAS_DE_RECORRIDO}
        modoDeEncuadre="cubrir"
      />
      <div className="fus-hero-scrim" aria-hidden="true" />

      <div className="fus-hero-marco">
        <div className="cam-meta-rail mt-6 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
          <span className="text-blue-bright">Cámara Anecoica / Lab-01</span>
          <span className="hidden sm:inline">{SHARED_CONTACT.institution}</span>
        </div>

        <div ref={salidaRef} className="fus-hero-salida">
          <div ref={contentRef} className="cam-reveal max-w-4xl">
            <p ref={kickerRef} className="tech-label">
              {SHARED_HERO.kicker}
            </p>

            <h1
              id="hero-title"
              className="fus-hero-titulo mt-7 font-serif text-[var(--text-display)]"
            >
              <span ref={lineOneRef} className="cam-line text-paper">
                {SHARED_HERO.line1}
              </span>
              <span ref={lineTwoRef} className="cam-line text-paper/60">
                {SHARED_HERO.line2}
              </span>
              <span
                ref={lineThreeRef}
                className="cam-line fus-hero-remate text-blue-bright"
              >
                {SHARED_HERO.accent}
              </span>
            </h1>

            <p
              ref={subRef}
              className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-mist"
            >
              {SHARED_HERO.sub}
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <a href={SHARED_CTA.href} className="cam-btn-primary focus-ring">
                {SHARED_CTA.primary}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href={SHARED_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cam-btn-ghost focus-ring"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 13.5l1-2.6A5 5 0 1113 8a5 5 0 01-7.4 4.4l-3.1 1.1z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                {SHARED_CTA.whatsapp}
              </a>
            </div>

            <p ref={microRef} className="fus-hero-micro mt-6">
              {SHARED_HERO.microcopy}
            </p>
          </div>
        </div>

        <div ref={cueRef} className="fus-hero-cue cam-reveal">
          <div className="cam-scrollcue-line" aria-hidden="true" />
          <span className="fus-hero-cue-texto">Desliza · la cámara avanza</span>
        </div>
      </div>
    </section>
  );
}
