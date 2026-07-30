/*
  Escena "Cómo aprenderás". Cuatro pilares del método en una grilla técnica. Server
  Component.
*/

import { SHARED_METHOD } from "@/lib/variants-content";

export function SonicaMethod() {
  return (
    <section className="son-section son-section--panel son-method" aria-labelledby="son-method-heading">
      <div className="son-wrap">
        <p className="son-label" data-son-reveal>
          {SHARED_METHOD.eyebrow}
        </p>
        <h2 id="son-method-heading" className="son-h son-method__heading" data-son-reveal>
          {SHARED_METHOD.headline}
        </h2>

        <div className="son-method__grid">
          {SHARED_METHOD.pillars.map((pillar, index) => (
            <article key={pillar.t} className="son-method__card" data-son-reveal>
              <span className="son-method__n">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="son-method__t">{pillar.t}</h3>
              <p className="son-method__d son-dim">{pillar.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
