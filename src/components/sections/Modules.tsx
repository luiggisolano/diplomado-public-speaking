"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { SpokenHeadline } from "@/components/motion/SpokenHeadline";
import { ModuleIcon } from "@/components/sections/ModuleIcon";
import { useReveal } from "@/components/motion/useReveal";
import { CtaButton } from "@/components/CtaButton";
import { MODULES_DETAIL, MODULES_OVERVIEW, URGENCY } from "@/lib/content";

/*
  Bloque 4 — Los seis módulos / stack de valor. Pieza estrella del sistema "Aula Futura".
  Tres partes: la intro estratégica, el "mapa del comunicador integral" como tabla técnica con
  índices mono, y la rejilla 3×2 de fichas card-tech. Cada ficha lleva el NÚMERO grande en mono
  azul-brillante (que sube de opacidad al hover), un ícono lineal azul, área en mono, promesa,
  cuerpo y el resultado con etiqueta mono "Resultado" y la frase en acento serif dorado. Cierra
  con la segunda aparición del CTA principal tras el stack de valor.
*/

type ModuleIconKey = Parameters<typeof ModuleIcon>[0]["name"];

export default function Modules() {
  const overviewRef = useReveal<HTMLDivElement>();
  const cardsRef = useReveal<HTMLDivElement>({ staggerMs: 110 });

  return (
    <section
      id="modulos"
      className="stage-b relative scroll-mt-24 py-[var(--space-section)]"
    >
      <div ref={overviewRef} className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={MODULES_OVERVIEW.eyebrow}
          title={MODULES_OVERVIEW.title}
        />

        <p
          data-reveal="up"
          className="reveal-init mt-8 max-w-[65ch] text-base leading-relaxed text-mist"
        >
          {MODULES_OVERVIEW.intro}
        </p>

        <p
          data-reveal="up"
          className="reveal-init mt-14 font-serif text-2xl font-semibold text-paper"
        >
          El mapa del{" "}
          <span className="serif-accent serif-accent--italic font-normal text-gold">
            comunicador integral
          </span>
        </p>

        <div
          data-reveal="rise"
          className="reveal-init mt-6 overflow-hidden rounded-xl border border-line"
        >
          {MODULES_OVERVIEW.map.map((entry, index) => (
            <div
              key={entry.dimension}
              className={`grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8 sm:px-8 ${
                index % 2 === 0 ? "bg-navy-raised/45" : "bg-navy-deep/40"
              }`}
            >
              <p className="flex items-baseline gap-3 font-serif text-base font-semibold text-paper">
                <span
                  className="mono-num text-xs font-semibold text-blue-bright/70"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {entry.dimension}
              </p>
              <p className="text-sm leading-relaxed text-mist">
                {entry.description}
              </p>
            </div>
          ))}
        </div>

        <p
          data-reveal="up"
          className="reveal-init mt-8 max-w-[65ch] text-base italic leading-relaxed text-mist"
        >
          {MODULES_OVERVIEW.mapClosing}
        </p>
      </div>

      <div ref={cardsRef} className="mx-auto mt-24 max-w-6xl px-6">
        <SpokenHeadline
          text={MODULES_DETAIL.title}
          as="h3"
          className="max-w-2xl font-serif text-2xl font-semibold leading-tight tracking-[-0.01em] text-paper sm:text-3xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MODULES_DETAIL.modules.map((module) => (
            <article
              key={module.number}
              data-reveal="rise"
              className="card-tech group reveal-init flex flex-col gap-5 rounded-xl p-7 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span
                  className="mono-num text-[2.75rem] font-semibold leading-none text-blue-bright opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  {module.number}
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line text-blue-bright">
                  <ModuleIcon
                    name={module.iconKey as ModuleIconKey}
                    className="h-5 w-5"
                  />
                </span>
              </div>

              <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-mist-dim">
                {module.area}
              </p>

              <h4 className="font-serif text-lg font-semibold leading-snug text-paper">
                {module.promise}
              </h4>

              <p className="text-sm leading-relaxed text-mist">
                {module.body}
              </p>

              <p className="mt-auto border-t border-line pt-4 text-sm leading-relaxed">
                <span className="tech-label text-[0.62rem]">Resultado</span>
                <span className="mt-1.5 block serif-accent serif-accent--italic text-gold [font-size:0.95rem]">
                  {module.result}
                </span>
              </p>
            </article>
          ))}
        </div>

        <CtaButton microcopy={URGENCY.microcopy} className="mt-16" />
      </div>
    </section>
  );
}
