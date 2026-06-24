"use client";

/*
  FAQ acordeón editorial — "La Palabra".
  Preguntas en serif italic; respuestas en sans.
*/

import { useState } from "react";
import { useReveal } from "./useReveal";
import { SHARED_FAQ } from "@/lib/variants-content";

function FaqItem({
  q,
  a,
  index,
}: {
  q: string;
  a: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const itemRef = useReveal<HTMLDivElement>({
    translateY: 16,
    durationMs: 550,
    delayMs: index * 60,
    threshold: 0.05,
  });

  const answerId = `pal-faq-answer-${index}`;
  const triggerId = `pal-faq-trigger-${index}`;

  return (
    <div
      ref={itemRef}
      className="pal-reveal-ready pal-faq-item"
    >
      <button
        id={triggerId}
        aria-expanded={open}
        aria-controls={answerId}
        className="pal-faq-trigger focus-ring"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="pal-faq-q">{q}</span>
        <span
          className={`pal-faq-icon${open ? " pal-faq-icon--open" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {open && (
        <p
          id={answerId}
          role="region"
          aria-labelledby={triggerId}
          className="pal-faq-answer"
        >
          {a}
        </p>
      )}
    </div>
  );
}

export function PalabraFAQ() {
  return (
    <section
      className="stage-b px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-faq-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="tech-label mb-[clamp(1.5rem,3vw,2.5rem)]">Preguntas</p>

        <h2
          id="pal-faq-heading"
          className="font-sans font-bold text-[clamp(1.6rem,0.8rem+3.5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-[var(--color-paper)] mb-[clamp(2rem,4vw,3.5rem)] max-w-[22ch]"
        >
          Lo que preguntan antes de decidir.
        </h2>

        <div className="max-w-[680px]">
          {SHARED_FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
