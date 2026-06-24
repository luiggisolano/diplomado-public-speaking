"use client";

/*
  Ficha académica — "La Palabra".
  Grilla de datos condensada con labels mono y valores sans.
*/

import { useReveal } from "./useReveal";
import { SHARED_FACTS } from "@/lib/variants-content";

export function PalabraFicha() {
  const containerRef = useReveal<HTMLDivElement>({
    translateY: 24,
    durationMs: 650,
    threshold: 0.1,
  });

  return (
    <section
      className="stage-a px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-ficha-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(1.5rem,3vw,2.5rem)]">
          Ficha académica
        </p>

        <h2 id="pal-ficha-heading" className="sr-only">
          Información académica del diplomado
        </h2>

        <div
          ref={containerRef}
          className="pal-reveal-ready max-w-[480px]"
        >
          <div className="pal-rule mb-0" />
          {SHARED_FACTS.map((fact, i) => (
            <dl key={i} className="pal-fact-row">
              <dt className="pal-fact-label self-center">{fact.label}</dt>
              <dd className="pal-fact-value">{fact.value}</dd>
            </dl>
          ))}
        </div>
      </div>
    </section>
  );
}
