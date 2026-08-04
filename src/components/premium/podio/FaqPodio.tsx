"use client";

/*
  Acordeón de preguntas frecuentes de la landing definitiva. Réplica del comportamiento del
  acordeón de Cámara, con su markup rehecho sobre las clases pod-* para que esta ruta no
  tenga que importar camara.css.

  Accesible por teclado: cada pregunta es un botón con aria-expanded y aria-controls que
  revela su respuesta. La altura se anima con la transición de grid-template-rows (0fr → 1fr),
  que abre sin reflow ni saltos, y queda anulada bajo reduced-motion. Solo una respuesta
  abierta a la vez, para que la lectura no se disperse.
*/

import { useId, useState } from "react";

type EntradaFaq = {
  q: string;
  a: string;
};

type FaqPodioProps = {
  items: readonly EntradaFaq[];
};

const INDICE_ABIERTO_INICIAL = 0;

export function FaqPodio({ items }: FaqPodioProps) {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(
    INDICE_ABIERTO_INICIAL,
  );
  const idBase = useId();

  return (
    <div className="pod-faq">
      {items.map((entrada, indice) => {
        const estaAbierta = indiceAbierto === indice;
        const idDisparador = `${idBase}-pregunta-${indice}`;
        const idPanel = `${idBase}-respuesta-${indice}`;

        return (
          <div key={entrada.q} className="pod-faq__item">
            <h3>
              <button
                type="button"
                id={idDisparador}
                className="pod-faq__pregunta"
                aria-expanded={estaAbierta}
                aria-controls={idPanel}
                onClick={() => setIndiceAbierto(estaAbierta ? null : indice)}
              >
                <span>{entrada.q}</span>
                <svg
                  className="pod-faq__icono"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 4v12M4 10h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={idPanel}
              role="region"
              aria-labelledby={idDisparador}
              className="pod-faq__panel"
              data-abierta={estaAbierta}
              inert={!estaAbierta}
            >
              <div className="pod-faq__panel-interior">
                <p className="pod-faq__respuesta">{entrada.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
