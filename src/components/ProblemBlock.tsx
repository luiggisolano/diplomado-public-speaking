import RevealOnScroll from "./RevealOnScroll";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

const problems = [
  "Tienes ideas brillantes que en reuniones suenan dubitativas.",
  "Te preparas durante días para presentaciones que olvidas en cuanto entras a la sala.",
  "Sientes que tu voz no proyecta la autoridad que tu trabajo merece.",
  "Las preguntas difíciles te ponen a la defensiva en lugar de al volante.",
  "Tu imagen comunica cosas que tú no decidiste comunicar.",
  "Otros, con menos conocimiento que tú, avanzan más rápido porque sí saben comunicar.",
] as const;

export default function ProblemBlock() {
  return (
    <section id="problema" className="section-padding bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <RevealOnScroll>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-semibold text-cream leading-[1.05]">
              Hay un momento en la carrera de toda persona profesional
            </h2>
            <div className="mt-8 space-y-5 text-cream-dim/80 text-lg leading-relaxed">
              <p>
                Hay un momento en el que ya no alcanza con saber del tema.
              </p>
              <p>
                Llega el día en que tienes que defender un proyecto frente a quienes
                deciden. Responder en una rueda de prensa. Hablar en nombre de una
                institución. Sostener una idea en un debate público. Convencer a un
                equipo. Cerrar un negocio que se decide en cinco minutos de exposición.
              </p>
              <p>
                Y ahí, la diferencia entre saber y comunicar lo que sabes deja de ser
                un detalle.
              </p>
              <p className="text-cream font-medium">
                Es lo que define si avanzas o te quedas.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/70 mb-6">
              Lo que sucede cuando esa habilidad no está entrenada
            </p>
            <ul className="space-y-4">
              {problems.map((problem, i) => (
                <li key={i} className="flex gap-4 text-cream-dim/80 text-[15px] leading-snug">
                  <span className="mt-0.5 shrink-0 text-muted/50">
                    <CheckCircle size={18} weight="light" />
                  </span>
                  {problem}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-cream font-semibold text-[17px] border-l-2 border-gold pl-4">
              Comunicar bien no es suficiente. Comunicar con estrategia es liderar.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
