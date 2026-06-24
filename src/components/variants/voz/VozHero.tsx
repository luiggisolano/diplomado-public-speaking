"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { VozWaveCanvas } from "./VozWaveCanvas";
import { CountUp } from "@/components/motion/CountUp";
import { MicrophoneMotif } from "@/components/motion/MicrophoneMotif";
import {
  SHARED_HERO,
  SHARED_STATS,
  SHARED_CTA,
  SHARED_CONTACT,
} from "@/lib/variants-content";

/*
  Hero de "La Voz". Escenario cinematográfico: fondo navy-abismo con gradiente
  vocal, micrófono sutil y la waveform animada como identidad visual. El copy
  arranca dubitativo (kicker en mono) y asciende a un titular serif de autoridad.
  4 estadísticas con CountUp refuerzan la solidez institucional.
  La waveform scroll-driven vive debajo del hero como puente hacia el resto de
  la página — el primer tramo del viaje de la voz.
*/

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function VozHero() {
  const contentRef  = useRef<HTMLDivElement | null>(null);
  const reducedRef  = useRef<boolean>(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const content = contentRef.current;
    if (!content || reducedRef.current) return;

    const targets = Array.from(content.querySelectorAll<HTMLElement>("[data-hero-reveal]"));

    animate(targets, {
      opacity:    [0, 1],
      translateY: [24, 0],
      duration:   1000,
      delay:      stagger(120, { start: 180 }),
      ease:       "out(4)",
    });
  }, []);

  return (
    <section
      className="voz-hero-bg relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[color:var(--color-abyss)] px-6 pb-0 pt-24"
      aria-label="Presentación del diplomado"
    >
      {/* Grilla blueprint de fondo */}
      <div className="blueprint pointer-events-none absolute inset-0" aria-hidden />

      {/* Micrófono como fondo decorativo */}
      <div
        className="pointer-events-none absolute right-[3%] top-[10%] hidden w-52 opacity-10 md:block lg:w-64"
        aria-hidden
      >
        <MicrophoneMotif className="h-full w-full" />
      </div>

      {/* Contenido principal */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
      >
        {/* Kicker: estado inicial dubitativo → mono técnica */}
        <p
          data-hero-reveal
          className="tech-label opacity-0 text-[color:var(--color-blue-bright)]"
          style={{ opacity: 0 }}
        >
          {SHARED_HERO.kicker}
        </p>

        {/* Titular display: la voz encontrando su autoridad */}
        <h1
          className="max-w-3xl leading-[0.95] tracking-tight"
          style={{ fontSize: "var(--text-display)" }}
        >
          <span
            data-hero-reveal
            className="block font-light text-[color:var(--color-paper)] opacity-0"
            style={{ opacity: 0 }}
          >
            {SHARED_HERO.line1}
          </span>
          <span
            data-hero-reveal
            className="block font-light text-[color:var(--color-mist)] opacity-0"
            style={{ opacity: 0, fontFamily: "var(--font-sans)" }}
          >
            {SHARED_HERO.line2}
          </span>
          <span
            data-hero-reveal
            className="serif-accent block font-semibold italic text-[color:var(--color-gold)] opacity-0"
            style={{ opacity: 0, fontFamily: "var(--font-serif)" }}
          >
            {SHARED_HERO.accent}
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          data-hero-reveal
          className="max-w-xl text-base leading-relaxed text-[color:var(--color-mist)] opacity-0"
          style={{ opacity: 0 }}
        >
          {SHARED_HERO.sub}
        </p>

        {/* CTA principal */}
        <div data-hero-reveal className="flex flex-col items-center gap-3 opacity-0" style={{ opacity: 0 }}>
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
          <p className="text-[0.68rem] tracking-widest text-[color:var(--color-mist-dim)] uppercase">
            {SHARED_HERO.microcopy}
          </p>
        </div>

        {/* Stats con CountUp */}
        <div
          data-hero-reveal
          className="mt-4 grid grid-cols-2 gap-4 opacity-0 sm:grid-cols-4"
          style={{ opacity: 0 }}
        >
          {SHARED_STATS.map((stat) => (
            <div
              key={stat.label}
              className="voz-stat flex flex-col items-center gap-1 pb-3"
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

      {/* Waveform scroll-driven: el viaje de la voz comienza aquí */}
      <div className="relative z-10 mt-16 w-full max-w-4xl" aria-hidden>
        <VozWaveCanvas className="opacity-70" />
        <p className="mt-2 text-center text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--color-mist-dim)]">
          desplázate para descubrir el viaje
        </p>
      </div>

      {/* Gradiente de salida hacia la siguiente sección */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--color-abyss))",
        }}
        aria-hidden
      />
    </section>
  );
}
