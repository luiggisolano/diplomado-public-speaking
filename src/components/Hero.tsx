"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { HERO } from "@/lib/content";

/*
  Bloque 1 — Hero. Pantalla completa cinematográfica. El fondo simula un orador a
  contraluz mediante capas de gradiente radial (cono de spotlight + viñeta) y una
  textura de grano. La entrada se orquesta con una timeline de anime.js: las líneas
  del título se revelan enmascaradas, el resto entra escalonado. Respeta
  prefers-reduced-motion mostrando todo sin animación.
*/

const MOUNT_DELAY_MS = 150;

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animatedNodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-hero]"),
    );

    if (prefersReducedMotion) {
      animatedNodes.forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "none";
      });
      return;
    }

    const timeline = createTimeline({
      defaults: { ease: "out(4)", duration: 1100 },
    });

    timeline
      .add(
        '[data-hero="pretitle"]',
        { opacity: [0, 1], translateY: [16, 0], duration: 800 },
        MOUNT_DELAY_MS,
      )
      .add(
        '[data-hero="line"]',
        { translateY: ["110%", "0%"], duration: 1200, delay: stagger(140) },
        "-=400",
      )
      .add(
        '[data-hero="subtitle"]',
        { opacity: [0, 1], translateY: [20, 0] },
        "-=700",
      )
      .add(
        '[data-hero="cta"]',
        { opacity: [0, 1], translateY: [20, 0], scale: [0.96, 1] },
        "-=850",
      )
      .add(
        '[data-hero="trust"]',
        { opacity: [0, 1], translateY: [12, 0], delay: stagger(60) },
        "-=750",
      )
      .add(
        '[data-hero="cue"]',
        { opacity: [0, 0.7], duration: 900 },
        "-=500",
      );

    return () => {
      timeline.pause();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="grain relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <HeroBackdrop />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <p
          data-hero="pretitle"
          className="mb-8 flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-coral opacity-0 sm:text-xs"
        >
          <span className="hidden h-px w-8 bg-coral/50 sm:inline-block" />
          {HERO.preTitle}
          <span className="hidden h-px w-8 bg-coral/50 sm:inline-block" />
        </p>

        <h1 className="font-display text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone sm:text-6xl lg:text-[4.6rem]">
          <span className="mask-line">
            <span data-hero="line" className="inline-block">
              {HERO.titleLineOne}
            </span>
          </span>
          <span className="mask-line">
            <span data-hero="line" className="inline-block">
              {HERO.titleLineTwo}{" "}
              <em className="bg-gradient-to-r from-coral-bright to-coral bg-clip-text not-italic text-transparent">
                {HERO.titleAccent}
              </em>
            </span>
          </span>
        </h1>

        <p
          data-hero="subtitle"
          className="mt-8 max-w-2xl text-base leading-relaxed text-bone-dim opacity-0 sm:text-lg"
        >
          {HERO.subtitle}
        </p>

        <div
          data-hero="cta"
          className="mt-11 flex flex-col items-center gap-4 opacity-0"
        >
          <a
            href="#inscripcion"
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-coral-bright to-coral px-9 py-4 text-sm font-semibold tracking-wide text-oxblood-deep transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(232,117,90,0.65)]"
          >
            {HERO.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <p className="max-w-md text-xs leading-relaxed text-bone-faint">
            {HERO.microcopy}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-16 w-full max-w-4xl border-t border-line pt-7">
        <p className="mb-4 text-[0.62rem] uppercase tracking-[0.24em] text-bone-faint">
          Aval institucional
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-bone-dim sm:text-sm">
          {HERO.trust.map((item, index) => (
            <li
              key={item}
              data-hero="trust"
              className="flex items-center gap-3 opacity-0"
            >
              {index > 0 && (
                <span className="h-1 w-1 rounded-full bg-coral/60" aria-hidden />
              )}
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        data-hero="cue"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
        aria-hidden
      >
        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-bone-faint">
          Descubre
        </span>
        <span className="h-9 w-px animate-pulse bg-gradient-to-b from-coral/70 to-transparent" />
      </div>
    </section>
  );
}

/*
  Capa de fondo. Spotlight cálido desde arriba, halo dorado tenue y viñeta inferior
  para fijar el texto. Lista para reemplazar por la fotografía real del orador:
  basta con sobreponer una <Image> y bajar la opacidad de los gradientes.
*/
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-oxblood" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -12%, rgba(232,117,90,0.30), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 6%, rgba(244,147,124,0.20), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 35%, rgba(29,9,12,0.72) 78%, #1d090c 100%)",
        }}
      />
    </div>
  );
}
