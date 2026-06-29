import RevealOnScroll from "./RevealOnScroll";
import { profiles } from "@/data/content";

export default function AudienceBlock() {
  return (
    <section id="para-quien" className="section-padding bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="max-w-2xl mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-4">
            Para quién es este diplomado
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05]">
            Si te reconoces en alguno de estos perfiles, este diplomado es para ti
          </h2>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((profile, i) => (
            <RevealOnScroll key={i} delay={i * 80}>
              <div className="h-full p-6 rounded-2xl border border-line/60 bg-surface/30 hover:border-gold/30 hover:bg-surface/50 transition-all duration-200">
                <div className="w-6 h-0.5 bg-gold/60 mb-5" />
                <h3 className="font-display text-[18px] font-semibold text-cream mb-3 leading-snug">
                  {profile.title}
                </h3>
                <p className="text-cream-dim/70 text-[14px] leading-relaxed">
                  {profile.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
