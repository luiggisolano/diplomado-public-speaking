"use client";

import { useState } from "react";
import { SHARED_FAQ } from "@/lib/variants-content";

/*
  Accordion de preguntas frecuentes para "La Voz". Expandible mediante click
  o teclado; el panel de respuesta se abre/cierra con transición CSS.
  El ícono gira para indicar el estado. Semántica ARIA correcta: button con
  aria-expanded y panel con id + aria-labelledby.
*/

export function VozFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <dl className="divide-y divide-[color:var(--color-line)]">
      {SHARED_FAQ.map((item, index) => {
        const isOpen    = openIndex === index;
        const headingId = `voz-faq-q-${index}`;
        const panelId   = `voz-faq-a-${index}`;

        return (
          <div
            key={headingId}
            className="voz-faq-item"
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
              className="voz-faq-answer overflow-hidden"
              data-open={isOpen ? "true" : "false"}
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
