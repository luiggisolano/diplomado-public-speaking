"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { useReveal } from "@/components/motion/useReveal";
import { METHODOLOGY } from "@/lib/content";

/*
  Bloque 7 — Cómo aprenderás / metodología, en el sistema "Aula Futura". Cuatro pilares en
  columnas separadas por filetes-hairline sobre navy, registro de blueprint de ingeniería.
  Cada columna abre con un índice grande en mono azul como ancla visual. Revelado on-scroll
  escalonado.
*/

export default function Methodology() {
  const headerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>({ staggerMs: 110 });

  return (
    <section
      id="metodologia"
      className="stage-a relative scroll-mt-24 py-[var(--space-section)]"
    >
      <div ref={headerRef} className="mx-auto max-w-3xl px-6 text-center">
        <SectionHeading
          eyebrow={METHODOLOGY.eyebrow}
          title={METHODOLOGY.title}
          align="center"
        />
        <p
          data-reveal="up"
          className="reveal-init mx-auto mt-8 max-w-[60ch] text-base leading-relaxed text-mist"
        >
          {METHODOLOGY.intro}
        </p>
      </div>

      <div
        ref={gridRef}
        className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-0"
      >
        {METHODOLOGY.pillars.map((pillar) => (
          <article
            key={pillar.number}
            data-reveal="rise"
            className="reveal-init flex flex-col gap-4 bg-navy p-8 lg:p-9"
          >
            <span
              className="mono-num text-3xl font-semibold text-blue-bright"
              aria-hidden
            >
              {pillar.number.padStart(2, "0")}
            </span>
            <h3 className="font-serif text-base font-semibold leading-snug text-paper">
              {pillar.title}
            </h3>
            <p className="text-sm leading-relaxed text-mist">
              {pillar.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
