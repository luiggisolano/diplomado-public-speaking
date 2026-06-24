"use client";

/*
  Sección de audiencia — "La Palabra".
  Perfiles como palabras tipográficas grandes en serif italic.
*/

import { useReveal } from "./useReveal";
import { SHARED_AUDIENCE } from "@/lib/variants-content";

export function PalabraPublico() {
  const headlineRef = useReveal<HTMLHeadingElement>({
    translateY: 28,
    durationMs: 680,
    threshold: 0.12,
  });

  return (
    <section
      className="stage-b px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-publico-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(1.5rem,3vw,2.5rem)]">
          {SHARED_AUDIENCE.eyebrow}
        </p>

        <h2
          ref={headlineRef}
          id="pal-publico-heading"
          className="pal-reveal-ready font-sans font-bold text-[clamp(1.6rem,0.8rem+3.5vw,3.5rem)] leading-[1.1] tracking-[-0.03em] text-[var(--color-paper)] max-w-[28ch] mb-[clamp(2.5rem,5vw,4rem)]"
        >
          {SHARED_AUDIENCE.headline}
        </h2>

        <ul
          className="flex flex-col gap-[clamp(0.6rem,1vw,0.9rem)]"
          role="list"
          aria-label="Perfiles de audiencia"
        >
          {SHARED_AUDIENCE.profiles.map((profile, i) => (
            <li key={i}>
              <span className="pal-audience-tag">{profile}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
