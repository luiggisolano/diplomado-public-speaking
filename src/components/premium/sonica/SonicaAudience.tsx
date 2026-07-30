/*
  Escena "Para quién es". Lista indexada de perfiles con numeración mono, registro de
  catálogo técnico. Server Component.
*/

import { SHARED_AUDIENCE } from "@/lib/variants-content";

export function SonicaAudience() {
  return (
    <section className="son-section son-section--panel son-aud" aria-labelledby="son-aud-heading">
      <div className="son-wrap">
        <p className="son-label" data-son-reveal>
          {SHARED_AUDIENCE.eyebrow}
        </p>
        <h2 id="son-aud-heading" className="son-h son-aud__heading" data-son-reveal>
          {SHARED_AUDIENCE.headline}
        </h2>

        <ul className="son-aud__list">
          {SHARED_AUDIENCE.profiles.map((profile, index) => (
            <li key={profile} className="son-aud__item" data-son-reveal>
              <span className="son-aud__idx">{String(index + 1).padStart(2, "0")}</span>
              <span className="son-aud__name">{profile}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
