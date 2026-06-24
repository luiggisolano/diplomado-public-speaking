"use client";

import { useState } from "react";
import { SHARED_FAQ } from "@/lib/variants-content";

/*
  FaqAccordion — preguntas frecuentes con toggle accesible.
  Usa atributo data-open para controlar la apariencia vía CSS.
  aria-expanded + aria-controls garantizan semántica de acordeón correcta.
*/

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleItem(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="esc-faq-list" role="list">
      {SHARED_FAQ.map((item, i) => {
        const isOpen = openIndex === i;
        const answerId = `esc-faq-answer-${i}`;
        const triggerId = `esc-faq-trigger-${i}`;

        return (
          <div
            key={i}
            className="esc-faq-item"
            data-open={isOpen ? "true" : "false"}
            role="listitem"
          >
            <button
              id={triggerId}
              className="esc-faq-trigger"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleItem(i)}
            >
              <span>{item.q}</span>
              <span className="esc-faq-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              id={answerId}
              className="esc-faq-answer"
              role="region"
              aria-labelledby={triggerId}
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
