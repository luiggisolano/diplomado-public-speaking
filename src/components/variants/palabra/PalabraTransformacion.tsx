"use client";

/*
  Sección de transformación antes/después — "La Palabra".
  Contraste tipográfico: tachado en serif italic vs afirmación en sans bold.
  Cita central enorme.
*/

import { useReveal } from "./useReveal";
import { SHARED_TRANSFORMATION } from "@/lib/variants-content";

export function PalabraTransformacion() {
  const quoteRef = useReveal<HTMLQuoteElement>({
    translateY: 32,
    durationMs: 750,
    threshold: 0.15,
  });

  return (
    <section
      className="stage-b px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-transformacion-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(1.5rem,3vw,2.5rem)]">
          {SHARED_TRANSFORMATION.eyebrow}
        </p>

        <h2
          id="pal-transformacion-heading"
          className="font-sans font-bold text-[clamp(1.8rem,1rem+3.5vw,3.5rem)] leading-[1.1] tracking-[-0.03em] text-[var(--color-paper)] mb-[clamp(2.5rem,5vw,4rem)]"
        >
          {SHARED_TRANSFORMATION.headline}
        </h2>

        <div className="grid md:grid-cols-2 gap-[clamp(1.5rem,3vw,3rem)] mb-[clamp(3rem,6vw,5rem)]">
          <div>
            <p className="tech-label text-[var(--color-mist-dim)] mb-[clamp(1rem,2vw,1.5rem)]">
              Antes
            </p>
            <ul className="space-y-[clamp(0.9rem,1.5vw,1.2rem)]" role="list">
              {SHARED_TRANSFORMATION.before.map((item, i) => (
                <li key={i} className="pal-before-text">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="tech-label text-[var(--color-gold)] mb-[clamp(1rem,2vw,1.5rem)]">
              Después
            </p>
            <ul className="space-y-[clamp(0.9rem,1.5vw,1.2rem)]" role="list">
              {SHARED_TRANSFORMATION.after.map((item, i) => (
                <li key={i} className="pal-after-text">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pal-rule mb-[clamp(2rem,4vw,3.5rem)]" />

        <blockquote
          ref={quoteRef}
          className="pal-reveal-ready pal-quote"
        >
          {SHARED_TRANSFORMATION.quote}
        </blockquote>
      </div>
    </section>
  );
}
