/*
  Escena "La idea". Una sola afirmación a pantalla, sin adorno: que tu palabra pese
  tanto como lo que sabes. Golpe editorial anclado a la izquierda con la tipografía
  display en su máxima escala. Server Component.
*/

import { SHARED_PROMISE } from "@/lib/variants-content";

export function SonicaPromise() {
  return (
    <section className="son-section son-promise" aria-labelledby="son-promise-heading">
      <div className="son-wrap">
        <p className="son-label" data-son-reveal>
          {SHARED_PROMISE.eyebrow}
        </p>
        <h2 id="son-promise-heading" className="son-h son-h--xl son-promise__headline" data-son-reveal>
          {SHARED_PROMISE.headline}
        </h2>
      </div>
    </section>
  );
}
