/*
  Escena "La transformación": antes / después en dos columnas, cerrada con la cita que
  sintetiza la promesa. La diferencia antes/después se comunica por etiqueta, tinte de
  fondo y la señal magenta de los ítems "después" (nunca por una franja de borde).
  Server Component.
*/

import { SHARED_TRANSFORMATION } from "@/lib/variants-content";

export function SonicaTransformation() {
  return (
    <section className="son-section son-trans" aria-labelledby="son-trans-heading">
      <div className="son-wrap">
        <p className="son-label" data-son-reveal>
          {SHARED_TRANSFORMATION.eyebrow}
        </p>
        <h2 id="son-trans-heading" className="son-h son-trans__heading" data-son-reveal>
          {SHARED_TRANSFORMATION.headline}
        </h2>

        <div className="son-trans__cols">
          <div className="son-trans__col son-trans__col--before" data-son-reveal>
            <p className="son-trans__tag son-label">Antes</p>
            <ul className="son-trans__items">
              {SHARED_TRANSFORMATION.before.map((line) => (
                <li key={line} className="son-trans__item">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="son-trans__col son-trans__col--after" data-son-reveal>
            <p className="son-trans__tag son-label">Después</p>
            <ul className="son-trans__items">
              {SHARED_TRANSFORMATION.after.map((line) => (
                <li key={line} className="son-trans__item son-trans__item--after">
                  <span className="son-signal" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <blockquote className="son-quote" data-son-reveal>
          {SHARED_TRANSFORMATION.quote}
        </blockquote>
      </div>
    </section>
  );
}
