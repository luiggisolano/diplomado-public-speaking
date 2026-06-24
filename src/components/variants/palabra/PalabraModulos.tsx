"use client";

/*
  Índice editorial de 6 módulos — "La Palabra".
  Numeración monoespaciada gigante tipo índice tipográfico.
  Títulos en serif italic; línea descriptiva en sans.
*/

import { useReveal } from "./useReveal";
import { SHARED_MODULES } from "@/lib/variants-content";

function ModuleEntry({
  n,
  title,
  line,
  index,
}: {
  n: string;
  title: string;
  line: string;
  index: number;
}) {
  const rowRef = useReveal<HTMLDivElement>({
    translateY: 20,
    durationMs: 600,
    delayMs: index * 60,
    threshold: 0.05,
  });

  return (
    <div ref={rowRef} className="pal-reveal-ready pal-module-entry">
      <span className="pal-module-index" aria-hidden="true">
        {n}
      </span>
      <div className="flex flex-col justify-center gap-[0.3rem] pt-[clamp(0.5rem,1vw,1rem)]">
        <h3 className="pal-module-title">{title}</h3>
        <p className="pal-module-line">{line}</p>
      </div>
    </div>
  );
}

export function PalabraModulos() {
  return (
    <section
      className="stage-a px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="pal-modulos-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-[clamp(1.5rem,3vw,2.5rem)]">
          <p className="tech-label">Programa</p>
          <p className="tech-label text-[var(--color-mist-dim)]">
            6 módulos · 160 h
          </p>
        </div>

        <h2 id="pal-modulos-heading" className="sr-only">
          Módulos del programa
        </h2>

        <div role="list">
          {SHARED_MODULES.map((mod, i) => (
            <div key={mod.key} role="listitem">
              <ModuleEntry
                n={mod.n}
                title={mod.title}
                line={mod.line}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
