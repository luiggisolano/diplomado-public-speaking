"use client";

/*
  Sección de metodología — "La Palabra".
  Cuatro pilares como tarjetas editoriales en grilla.
*/

import { useReveal } from "./useReveal";
import { SHARED_METHOD } from "@/lib/variants-content";

function MethodCard({
  t,
  d,
  index,
}: {
  t: string;
  d: string;
  index: number;
}) {
  const cardRef = useReveal<HTMLDivElement>({
    translateY: 24,
    durationMs: 620,
    delayMs: index * 80,
    threshold: 0.1,
  });

  return (
    <div ref={cardRef} className="pal-reveal-ready pal-method-card">
      <p className="pal-method-card-title">{t}</p>
      <p className="pal-method-card-desc">{d}</p>
    </div>
  );
}

export function PalabraMetodo() {
  return (
    <section
      className="stage-a px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-metodo-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(0.75rem,1.5vw,1.2rem)]">
          {SHARED_METHOD.eyebrow}
        </p>

        <h2
          id="pal-metodo-heading"
          className="font-serif font-bold italic text-[clamp(1.8rem,0.9rem+4vw,4rem)] leading-[1.08] tracking-[-0.025em] text-[var(--color-paper)] mb-[clamp(2.5rem,5vw,4rem)] max-w-[22ch]"
        >
          {SHARED_METHOD.headline}
        </h2>

        <div className="grid sm:grid-cols-2 gap-[clamp(0.75rem,1.5vw,1.2rem)]">
          {SHARED_METHOD.pillars.map((pillar, i) => (
            <MethodCard key={i} t={pillar.t} d={pillar.d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
