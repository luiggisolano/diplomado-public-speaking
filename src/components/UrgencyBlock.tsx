import RevealOnScroll from "./RevealOnScroll";
import CountdownTimer from "./CountdownTimer";
import GoldButton from "./GoldButton";
import { CTA_LINK } from "@/lib/constants";
import { Clock, Users, TrendUp } from "@phosphor-icons/react/dist/ssr";

const reasons = [
  {
    icon: Users,
    title: "Cupos limitados de verdad",
    description:
      "La modalidad sincrónica con atención personalizada hace que el número de participantes no pueda crecer indefinidamente. Garantizamos calidad de práctica, no volumen de inscritos.",
  },
  {
    icon: Clock,
    title: "La próxima cohorte abre dentro de un año",
    description:
      "El diseño del diplomado y la coordinación con los seis especialistas hace que abramos una sola cohorte por ciclo. Si esta no es tu fecha, la siguiente oportunidad será dentro de doce meses.",
  },
  {
    icon: TrendUp,
    title: "Inversión que se recupera con una sola intervención bien hecha",
    description:
      "Un cierre de negocio. Una entrevista decisiva. Una intervención pública que te posiciona. Una defensa que se gana. Cualquiera de esos momentos paga el diplomado completo.",
  },
] as const;

export default function UrgencyBlock() {
  return (
    <section id="inscribite" className="section-padding bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,92,0.05)_0%,transparent_65%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-4">
            Por qué ahora
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05]">
            Por qué inscribirte ahora
          </h2>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <RevealOnScroll key={i} delay={i * 100}>
                <div className="p-7 rounded-2xl border border-line/60 bg-surface/30 h-full">
                  <div className="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center mb-5">
                    <Icon size={20} weight="light" className="text-gold/70" />
                  </div>
                  <h3 className="font-display text-[17px] font-semibold text-cream mb-3 leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-cream-dim/70 text-[14px] leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll className="text-center">
          <p className="font-display text-xl text-cream-dim/80 mb-6 italic">
            Si llegaste hasta aquí, ya sabes si esto es para ti.
          </p>
          <CountdownTimer className="justify-center mb-8" />
          <GoldButton href={CTA_LINK} size="lg">
            Asegurar mi cupo ahora
          </GoldButton>
          <p className="mt-4 text-[12px] text-muted">
            Inscripciones abiertas · Cupos limitados · Inicio en julio
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
