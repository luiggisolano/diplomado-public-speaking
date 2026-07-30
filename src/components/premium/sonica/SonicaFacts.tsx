/*
  Escena "Ficha técnica". Los datos duros del diplomado en una grilla de panel de
  instrumentos: etiqueta mono arriba, valor display abajo. Server Component.
*/

import { SHARED_FACTS } from "@/lib/variants-content";

export function SonicaFacts() {
  return (
    <section className="son-section son-facts" aria-labelledby="son-facts-heading">
      <div className="son-wrap">
        <p id="son-facts-heading" className="son-label" data-son-reveal>
          Ficha técnica
        </p>

        <dl className="son-facts__grid">
          {SHARED_FACTS.map((fact) => (
            <div key={fact.label} className="son-fact" data-son-reveal>
              <dt className="son-fact__label">{fact.label}</dt>
              <dd className="son-fact__value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
