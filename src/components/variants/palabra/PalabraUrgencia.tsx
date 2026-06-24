"use client";

/*
  Urgencia — "La Palabra".
  Titular display + tres razones como texto editorial.
*/

import { SplitText } from "./SplitText";
import { useSplitReveal } from "./useSplitReveal";
import { useReveal } from "./useReveal";
import { SHARED_URGENCY } from "@/lib/variants-content";

function UrgencyReason({
  t,
  d,
  index,
}: {
  t: string;
  d: string;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>({
    translateY: 20,
    durationMs: 580,
    delayMs: index * 100,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className="pal-reveal-ready border-l-2 border-[var(--color-gold)] pl-[clamp(1rem,1.5vw,1.5rem)]"
    >
      <p className="font-sans font-semibold text-[var(--color-paper)] text-[clamp(0.95rem,0.82rem+0.5vw,1.1rem)] mb-[0.4rem]">
        {t}
      </p>
      <p className="font-sans text-[var(--color-mist)] text-[clamp(0.82rem,0.72rem+0.4vw,0.94rem)] leading-relaxed">
        {d}
      </p>
    </div>
  );
}

export function PalabraUrgencia() {
  const headlineRef = useSplitReveal<HTMLHeadingElement>({
    mode: "words",
    staggerMs: 55,
    durationMs: 650,
    translateY: 28,
    threshold: 0.12,
  });

  return (
    <section
      className="stage-b px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-urgencia-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(1.5rem,3vw,2.5rem)]">
          {SHARED_URGENCY.eyebrow}
        </p>

        <h2
          ref={headlineRef}
          id="pal-urgencia-heading"
          aria-label={SHARED_URGENCY.headline}
          className="font-serif font-bold italic text-[clamp(2rem,1rem+5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-[var(--color-paper)] max-w-[20ch] mb-[clamp(2.5rem,5vw,4rem)]"
        >
          <SplitText
            text={SHARED_URGENCY.headline}
            mode="words"
            wordClassName="mr-[0.22em] last:mr-0"
          />
        </h2>

        <div className="grid md:grid-cols-3 gap-[clamp(1.5rem,3vw,2.5rem)]">
          {SHARED_URGENCY.reasons.map((reason, i) => (
            <UrgencyReason key={i} t={reason.t} d={reason.d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
