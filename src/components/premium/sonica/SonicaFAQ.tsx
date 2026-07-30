"use client";

/*
  Acordeón de preguntas frecuentes. Cada fila es un botón accesible (aria-expanded /
  aria-controls) que revela su respuesta animando grid-template-rows (0fr → 1fr), la
  técnica recomendada para transiciones de alto sin animar height. Teclado y lectores
  de pantalla lo operan de forma nativa; el icono es un signo que rota, sin depender
  del color para comunicar el estado.
*/

import { useState } from "react";
import { SHARED_FAQ } from "@/lib/variants-content";

export function SonicaFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="son-section son-section--panel son-faq" aria-labelledby="son-faq-heading">
      <div className="son-wrap">
        <p className="son-label" data-son-reveal>
          Preguntas
        </p>
        <h2 id="son-faq-heading" className="son-h son-faq__heading" data-son-reveal>
          Lo que necesitas saber antes de decidir.
        </h2>

        <ul className="son-faq__list">
          {SHARED_FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `son-faq-panel-${index}`;
            const buttonId = `son-faq-button-${index}`;
            return (
              <li key={item.q} className="son-faq__item" data-son-reveal data-open={isOpen}>
                <h3 className="son-faq__q-wrap">
                  <button
                    id={buttonId}
                    type="button"
                    className="son-faq__q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className="son-faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="son-faq__panel"
                >
                  <div className="son-faq__panel-inner">
                    <p className="son-faq__a son-body son-dim">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
