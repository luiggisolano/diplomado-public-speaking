"use client";

/*
  Acordeón de preguntas frecuentes para "La Síntesis".
  Accesible: button con aria-expanded, panel con id + aria-labelledby.
  El ícono rota 45° al abrir. La transición de max-height es suave.
*/

import { useState } from "react";
import { SHARED_FAQ } from "@/lib/variants-content";

export function SynFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <dl className="divide-y divide-[color:var(--color-line)]">
      {SHARED_FAQ.map((item, index) => {
        const isOpen    = openIndex === index;
        const headingId = `syn-faq-q-${index}`;
        const panelId   = `syn-faq-a-${index}`;

        return (
          <div
            key={headingId}
            className="syn-faq-item"
            data-open={isOpen ? "true" : "false"}
          >
            <dt>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="focus-ring flex w-full items-start justify-between gap-4 py-5 text-left"
              >
                <span className="text-sm font-medium leading-snug text-[color:var(--color-paper)]">
                  {item.q}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-blue-bright)] transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <path
                    d="M10 4v12M4 10h12"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              className="syn-faq-answer"
              style={{ maxHeight: isOpen ? "400px" : "0px" }}
            >
              <p className="pb-5 text-sm leading-relaxed text-[color:var(--color-mist)]">
                {item.a}
              </p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
