"use client";

import { useRevealAnime } from "@/hooks/useRevealAnime";
import { modules } from "@/data/content";

export default function ModulesGrid() {
  const gridRef = useRevealAnime<HTMLDivElement>({
    selector: "[data-card]",
    stagger: 90,
    translateY: 40,
    duration: 720,
    threshold: 0.1,
  });

  return (
    <section id="modulos" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-4">
            El programa
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05]">
            Seis módulos. Seis especialistas. Una sola formación.
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {modules.map((module) => (
            <article
              key={module.id}
              data-card
              className="group flex flex-col p-6 rounded-2xl border border-line/60 bg-surface/30 hover:border-gold/40 hover:bg-surface/60 transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="font-display text-4xl font-semibold text-gold/20 group-hover:text-gold/40 transition-colors">
                  {module.id}
                </span>
                <div className="w-8 h-px bg-gold/30 mt-4" />
              </div>
              <h3 className="font-display text-[17px] font-semibold text-cream leading-snug mb-3">
                {module.title}
              </h3>
              <p className="text-gold/80 text-[13px] font-medium italic mb-4">
                {module.tagline}
              </p>
              <p className="text-cream-dim/60 text-[13px] leading-relaxed flex-1">
                {module.body}
              </p>
              <div className="mt-5 pt-4 border-t border-line/40">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-gold/60">
                  Resultado
                </p>
                <p className="text-cream-dim/70 text-[13px] leading-snug mt-1">
                  {module.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
