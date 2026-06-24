"use client";

/*
  Hero de "La Síntesis" — combinación curada de las tres variantes.

  Mecánica:
  - Fondo: atmósfera navy de La Voz (gradiente vocal + blueprint sutil).
  - Titular: tipografía cinética de La Palabra (split por palabras, stagger de
    ensamblaje al cargar), palabra-acento dorada en serif italic.
  - Haz: HeroBeam dorado desde el techo cayendo sobre el titular (El Escenario).
  - Stats: CountUp como en La Voz.
  - CTA: WhatsApp + ancla #inscripcion-sin.

  Accesibilidad: prefers-reduced-motion omite todas las animaciones; los spans
  de split son aria-hidden con aria-label en el contenedor.
*/

import { useEffect, useRef } from "react";
import { SynWaveCanvas } from "./SynWaveCanvas";
import { SynSplitText } from "./SynSplitText";
import { useSynSplitReveal } from "./useSynSplitReveal";
import { CountUp } from "@/components/motion/CountUp";
import { MicrophoneMotif } from "@/components/motion/MicrophoneMotif";
import {
  SHARED_HERO,
  SHARED_STATS,
  SHARED_CTA,
  SHARED_CONTACT,
} from "@/lib/variants-content";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function SynHero() {
  const beamRef = useRef<HTMLDivElement>(null);
  const coneRef = useRef<HTMLDivElement>(null);
  const ctaRef  = useRef<HTMLDivElement>(null);

  const line1Ref = useSynSplitReveal<HTMLDivElement>({
    mode: "words",
    staggerMs: 65,
    durationMs: 720,
    translateY: 28,
    threshold: 0.05,
  });

  const line2Ref = useSynSplitReveal<HTMLDivElement>({
    mode: "words",
    staggerMs: 60,
    durationMs: 680,
    delayMs: 200,
    translateY: 24,
    threshold: 0.05,
  });

  const accentRef = useSynSplitReveal<HTMLDivElement>({
    mode: "chars",
    staggerMs: 28,
    durationMs: 550,
    delayMs: 380,
    translateY: 20,
    threshold: 0.05,
  });

  /* Activar haz de luz y animación de entrada del CTA */
  useEffect(() => {
    const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const beam = beamRef.current;
    const cone = coneRef.current;
    const cta  = ctaRef.current;

    if (reduceMotion) {
      if (beam) beam.classList.add("syn-ceiling-beam--expanded");
      if (cone) cone.classList.add("syn-beam-cone--visible");
      if (cta)  { cta.style.opacity = "1"; }
      return;
    }

    const timeout = setTimeout(() => {
      if (beam) beam.classList.add("syn-ceiling-beam--expanded");
      if (cone) cone.classList.add("syn-beam-cone--visible");
    }, 200);

    if (cta) {
      cta.style.opacity   = "0";
      cta.style.transform = "translateY(20px)";
      const ctaTimeout = setTimeout(() => {
        import("animejs").then(({ animate }) => {
          animate(cta, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 700,
            ease: "outQuart",
          });
        });
      }, 900);

      return () => {
        clearTimeout(timeout);
        clearTimeout(ctaTimeout);
      };
    }

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      className="syn-hero syn-hero-bg relative"
      aria-labelledby="syn-hero-headline"
    >
      {/* Blueprint sutil de fondo */}
      <div className="syn-blueprint" aria-hidden />

      {/* Haz de luz dorado desde el techo — El Escenario */}
      <div ref={beamRef} className="syn-ceiling-beam" aria-hidden />
      <div ref={coneRef} className="syn-beam-cone" aria-hidden />

      {/* Micrófono decorativo — La Voz */}
      <div
        className="pointer-events-none absolute right-[3%] top-[10%] hidden w-48 opacity-8 md:block lg:w-60"
        style={{ opacity: 0.08 }}
        aria-hidden
      >
        <MicrophoneMotif className="h-full w-full" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">

        {/* Kicker */}
        <p className="syn-kicker" aria-hidden="true">
          {SHARED_HERO.kicker}
        </p>

        {/* Titular con tipografía cinética — La Palabra */}
        <div
          id="syn-hero-headline"
          className="mb-6"
        >
          <div
            ref={line1Ref}
            aria-label={SHARED_HERO.line1}
            className="syn-hero-display block"
          >
            <SynSplitText
              text={SHARED_HERO.line1}
              mode="words"
              wordClassName="mr-[0.22em] last:mr-0"
            />
          </div>

          <div
            ref={line2Ref}
            aria-label={SHARED_HERO.line2}
            className="syn-hero-display syn-hero-display--sans block mt-[0.08em]"
          >
            <SynSplitText
              text={SHARED_HERO.line2}
              mode="words"
              wordClassName="mr-[0.2em] last:mr-0"
            />
          </div>

          <div
            ref={accentRef}
            aria-label={SHARED_HERO.accent}
            className="syn-hero-display syn-hero-accent block mt-[0.06em]"
          >
            <SynSplitText
              text={SHARED_HERO.accent}
              mode="chars"
            />
          </div>
        </div>

        {/* Subtítulo */}
        <p className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-[color:var(--color-mist)]">
          {SHARED_HERO.sub}
        </p>

        <p className="mb-8 text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--color-mist-dim)]">
          {SHARED_HERO.microcopy}
        </p>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mb-10 flex flex-col items-center gap-3"
        >
          <a
            href={SHARED_CTA.href}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[color:var(--color-gold)] px-8 py-3.5 text-sm font-semibold text-[color:var(--color-abyss)] shadow-[0_0_32px_-8px_rgba(255,169,2,0.55)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_48px_-6px_rgba(255,169,2,0.7)]"
          >
            {SHARED_CTA.primary}
          </a>
          <a
            href={SHARED_CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring text-xs text-[color:var(--color-mist-dim)] underline-offset-4 hover:text-[color:var(--color-mist)] hover:underline"
          >
            {SHARED_CTA.whatsapp}
          </a>
        </div>

        {/* Stats con CountUp — La Voz */}
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SHARED_STATS.map((stat) => (
            <div
              key={stat.label}
              className="syn-stat flex flex-col items-center gap-1 pb-3"
            >
              <span className="text-3xl font-bold text-[color:var(--color-paper)]">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--color-mist-dim)]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Onda scroll-driven como puente hacia el contenido */}
      <div className="relative z-10 mt-12 w-full max-w-4xl" aria-hidden>
        <SynWaveCanvas className="opacity-60" />
        <p className="mt-2 text-center text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--color-mist-dim)]">
          desplázate para el viaje completo
        </p>
      </div>

      {/* Degradado de salida */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-abyss))" }}
        aria-hidden
      />
    </section>
  );
}
