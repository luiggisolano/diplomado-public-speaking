/*
  Escena "Por qué ahora". Razones de la cohorte única, respuesta a la objeción del
  momento de compra. Server Component.
*/

import { SHARED_URGENCY } from "@/lib/variants-content";

export function SonicaUrgency() {
  return (
    <section className="son-section son-section--panel son-urg" aria-labelledby="son-urg-heading">
      <div className="son-wrap">
        <p className="son-label" data-son-reveal>
          {SHARED_URGENCY.eyebrow}
        </p>
        <h2 id="son-urg-heading" className="son-h son-urg__heading" data-son-reveal>
          {SHARED_URGENCY.headline}
        </h2>

        <div className="son-urg__grid">
          {SHARED_URGENCY.reasons.map((reason, index) => (
            <article key={reason.t} className="son-urg__card" data-son-reveal>
              <span className="son-urg__n">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="son-urg__t">{reason.t}</h3>
              <p className="son-urg__d son-dim">{reason.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
