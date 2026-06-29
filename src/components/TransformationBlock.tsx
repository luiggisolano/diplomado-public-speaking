import RevealOnScroll from "./RevealOnScroll";
import { transformationBefore, transformationAfter } from "@/data/content";
import { X, Check } from "@phosphor-icons/react/dist/ssr";

export default function TransformationBlock() {
  return (
    <section id="transformacion" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-4">
            La transformación
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05]">
            Esto cambia en ti
          </h2>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="p-8 rounded-2xl border border-line/50 bg-surface/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full border border-muted/40 flex items-center justify-center">
                  <X size={14} weight="bold" className="text-muted" />
                </div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Antes del diplomado
                </h3>
              </div>
              <ul className="space-y-4">
                {transformationBefore.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-cream-dim/60 text-[14px] leading-snug"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted/40 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="p-8 rounded-2xl border border-gold/25 bg-surface/30 gold-border-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center">
                  <Check size={14} weight="bold" className="text-gold" />
                </div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Después del diplomado
                </h3>
              </div>
              <ul className="space-y-4">
                {transformationAfter.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-cream/80 text-[14px] leading-snug"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/50 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={200} className="text-center mt-12">
          <p className="font-display text-xl font-semibold text-cream-dim/80 italic">
            El comunicador que quieres ser empieza aquí.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
