import RevealOnScroll from "./RevealOnScroll";
import ProgressLine from "./ProgressLine";
import { pillars } from "@/data/content";

export default function MethodologyBlock() {
  return (
    <section id="metodologia" className="section-padding bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="max-w-2xl mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-4">
            Metodología
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05]">
            Una experiencia formativa diseñada para que apliques lo que aprendes
          </h2>
        </RevealOnScroll>

        <div className="max-w-3xl">
          <div className="relative pl-10">
            <ProgressLine />
            <div className="space-y-12">
              {pillars.map((pillar, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-5 h-5 rounded-full border-2 border-gold bg-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </div>
                    <span className="font-display text-4xl font-semibold text-gold/15 block mb-2">
                      {pillar.number}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-cream mb-3 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-cream-dim/70 text-[15px] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
