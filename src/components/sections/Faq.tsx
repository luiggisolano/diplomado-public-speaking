"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQ } from "@/lib/content";

/*
  Bloque 10 — Preguntas frecuentes, en el sistema "Aula Futura". Acordeón accesible sobre
  paneles navy con filete-hairline, conservando el patrón button + aria-expanded / aria-controls
  (más robusto que <details> para lectores de pantalla). Un solo ítem abierto a la vez; la altura
  del panel se anima con grid-template-rows para no animar height directo. El indicador "+" gira a
  "×" en azul. Los dos ítems pendientes del cliente muestran su placeholder etiquetado en dorado.
*/

const PANEL_TRANSITION_CLASSNAME =
  "grid transition-[grid-template-rows] duration-300 ease-out";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="stage-a relative mx-auto max-w-3xl scroll-mt-24 px-6 py-[var(--space-section)]"
    >
      <div className="text-center">
        <SectionHeading eyebrow={FAQ.eyebrow} title={FAQ.title} align="center" />
      </div>

      <ul className="mt-12 flex flex-col gap-3">
        {FAQ.items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          const isPending = "pending" in item && item.pending === true;

          return (
            <li
              key={item.question}
              className="overflow-hidden rounded-xl border border-line bg-navy-raised/35"
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:text-blue-bright"
                >
                  <span className="font-serif text-base font-semibold text-paper sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 text-blue-bright transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      className="h-5 w-5"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`${PANEL_TRANSITION_CLASSNAME} ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6">
                    {isPending ? (
                      <p className="rounded-lg border border-dashed border-gold/50 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-mist">
                        <span className="tech-label mb-1 block text-[0.6rem] text-gold">
                          Pendiente del cliente (CEC)
                        </span>
                        {item.answer}
                      </p>
                    ) : (
                      <p className="text-sm leading-relaxed text-mist">
                        {item.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
