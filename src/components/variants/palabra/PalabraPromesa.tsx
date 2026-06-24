"use client";

/*
  Sección de promesa — "La Palabra".
  Titular editorial enorme con reveal por palabras y eyebrow técnico.
*/

import { SplitText } from "./SplitText";
import { useSplitReveal } from "./useSplitReveal";
import { useReveal } from "./useReveal";
import { SHARED_PROMISE } from "@/lib/variants-content";

export function PalabraPromesa() {
  const headlineRef = useSplitReveal<HTMLHeadingElement>({
    mode: "words",
    staggerMs: 50,
    durationMs: 680,
    translateY: 30,
  });

  const bodyRef = useReveal<HTMLParagraphElement>({ delayMs: 300 });

  return (
    <section className="stage-b px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]">
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(1.5rem,3vw,2.5rem)]">
          {SHARED_PROMISE.eyebrow}
        </p>

        <div className="pal-rule mb-[clamp(1.5rem,3vw,2.5rem)]" />

        <h2
          ref={headlineRef}
          aria-label={SHARED_PROMISE.headline}
          className="font-serif font-bold italic text-[clamp(2.2rem,1.2rem+5vw,5rem)] leading-[1.0] tracking-[-0.03em] text-[var(--color-paper)] max-w-[18ch] mb-[clamp(2rem,4vw,3.5rem)]"
        >
          <SplitText
            text={SHARED_PROMISE.headline}
            mode="words"
            wordClassName="mr-[0.2em] last:mr-0"
          />
        </h2>

        <p
          ref={bodyRef}
          className="pal-reveal-ready font-sans text-[var(--color-mist)] text-[clamp(1rem,0.85rem+0.7vw,1.2rem)] leading-relaxed max-w-[52ch]"
        >
          {SHARED_PROMISE.body}
        </p>
      </div>
    </section>
  );
}
