"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { LineIcon } from "@/components/LineIcon";
import { useReveal } from "@/components/motion/useReveal";
import { SOLUTION } from "@/lib/content";

/*
  Bloque 3 — La solución / enfoque, en el sistema "Aula Futura". Encabezado centrado con la
  tesis del programa, seguido de una rejilla de paneles card-tech con ícono lineal azul para
  los diferenciadores. Reposiciona el diplomado frente al "curso de oratoria". El eyebrow del
  bloque de diferenciadores va en mono técnica. Revelado on-scroll escalonado. Cada panel toma
  un ícono semántico del set sin alterar el copy verbatim.
*/

const DIFFERENTIATOR_ICON_SEQUENCE = [
  "brain",
  "voice",
  "stage",
  "target",
  "seal",
] as const;

export default function Solution() {
  const headerRef = useReveal<HTMLDivElement>();
  const cardsRef = useReveal<HTMLDivElement>({ staggerMs: 100 });

  return (
    <section className="stage-a relative py-[var(--space-section)]">
      <div ref={headerRef} className="mx-auto max-w-3xl px-6 text-center">
        <SectionHeading
          eyebrow={SOLUTION.eyebrow}
          title={SOLUTION.title}
          align="center"
        />

        <div className="mt-8 flex flex-col gap-5">
          {SOLUTION.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              data-reveal="up"
              className="reveal-init mx-auto max-w-[65ch] text-base leading-relaxed text-mist"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div ref={cardsRef} className="mx-auto mt-16 max-w-6xl px-6">
        <p
          data-reveal="up"
          className="reveal-init tech-label mb-8 justify-center text-center"
        >
          {SOLUTION.differentiatorsLead}
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTION.differentiators.map((item, index) => (
            <article
              key={item}
              data-reveal="rise"
              className="card-tech reveal-init flex flex-col gap-5 rounded-xl p-7 sm:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-blue-bright">
                <LineIcon
                  name={DIFFERENTIATOR_ICON_SEQUENCE[index] ?? "target"}
                  className="h-6 w-6"
                />
              </span>
              <p className="text-sm leading-relaxed text-paper">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
