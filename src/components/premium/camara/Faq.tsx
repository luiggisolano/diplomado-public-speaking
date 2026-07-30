"use client";

/*
  Acordeón de preguntas frecuentes. Accesible por teclado: cada pregunta es un botón
  con aria-expanded y aria-controls que revela su respuesta. La animación de altura usa
  la transición de grid-template-rows (0fr -> 1fr), la técnica correcta para animar
  apertura sin reflow y sin saltos, y se anula bajo reduced-motion. Solo una respuesta
  abierta a la vez para mantener la lectura enfocada.
*/

import { useId, useState } from "react";

type FaqEntry = {
  q: string;
  a: string;
};

type FaqProps = {
  items: readonly FaqEntry[];
};

export function Faq({ items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.q} className="cam-faq-item">
            <h3>
              <button
                type="button"
                id={triggerId}
                className="cam-faq-trigger focus-ring"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.q}</span>
                <svg
                  className="cam-faq-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3.5v11M3.5 9h11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="cam-faq-panel"
              data-open={isOpen}
              inert={!isOpen}
            >
              <div className="cam-faq-panel-inner">
                <p className="max-w-2xl pb-6 text-[1.02rem] leading-relaxed text-mist">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
