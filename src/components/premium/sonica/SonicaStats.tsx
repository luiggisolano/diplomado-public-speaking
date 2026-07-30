/*
  Banda de cifras en marquesina. Un ticker que corre horizontalmente (motivo de señal
  en directo) con los cuatro datos duros del diplomado. El grupo real lleva las cifras;
  el grupo duplicado (aria-hidden) solo alimenta el bucle continuo. Bajo reduced-motion
  el CSS detiene la marquesina y reordena las cifras en una fila estática y centrada,
  ocultando el duplicado. Server Component: markup puro, sin JS.
*/

import { SHARED_STATS } from "@/lib/variants-content";

export function SonicaStats() {
  return (
    <section className="son-section son-section--panel son-stats" aria-label="Datos del diplomado">
      <div className="son-marquee">
        <div className="son-marquee__track">
          <div className="son-marquee__group">
            {SHARED_STATS.map((stat) => (
              <div key={stat.label} className="son-marquee__item">
                <span className="son-signal" aria-hidden="true" />
                <span className="son-marquee__val">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="son-marquee__label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="son-marquee__group son-marquee__group--dup" aria-hidden="true">
            {SHARED_STATS.map((stat) => (
              <div key={`${stat.label}-dup`} className="son-marquee__item">
                <span className="son-signal" />
                <span className="son-marquee__val">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="son-marquee__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
