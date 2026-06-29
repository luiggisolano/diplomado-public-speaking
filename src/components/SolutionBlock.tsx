import RevealOnScroll from "./RevealOnScroll";
import GoldButton from "./GoldButton";
import { CTA_LINK } from "@/lib/constants";
import { Star } from "@phosphor-icons/react/dist/ssr";

const differentiators = [
  "Enfoque interdisciplinario real: seis disciplinas, seis especialistas, una sola formación integrada.",
  "Modalidad 100% en línea con sesiones sincrónicas los sábados, asincrónicas complementarias los domingos.",
  "Trabajo práctico desde la primera semana: simulaciones, ejercicios escénicos, construcción progresiva de discurso, análisis de casos.",
  "Proyecto integrador final con aplicación real: cada participante usa la oratoria como herramienta de inserción profesional en su propio campo.",
  "Aval universitario y certificación oficial de la Universidad Técnica de Machala.",
] as const;

export default function SolutionBlock() {
  return (
    <section id="programa" className="section-padding bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="max-w-3xl mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-5">
            La solución
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05] mb-6">
            Una formación diseñada para que tu palabra esté a la altura de tu trabajo
          </h2>
          <p className="text-cream-dim/80 text-lg leading-relaxed mb-4">
            El Diplomado en Public Speaking y Comunicación Persuasiva de Alto Impacto
            no es un curso de oratoria.
          </p>
          <p className="text-cream-dim/80 text-lg leading-relaxed">
            Es una formación universitaria interdisciplinaria que integra seis campos
            esenciales del comunicador contemporáneo: psicología, retórica, voz,
            presencia escénica, imagen y liderazgo aplicado.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={100} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {differentiators.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-5 rounded-xl border border-line/60 bg-surface/40 hover:border-gold/30 hover:bg-surface/70 transition-all duration-200"
            >
              <Star size={16} weight="fill" className="text-gold/60 shrink-0 mt-0.5" />
              <p className="text-cream-dim/80 text-[14px] leading-snug">{item}</p>
            </div>
          ))}
        </RevealOnScroll>

        <RevealOnScroll delay={200} className="text-center">
          <p className="text-cream-dim/60 text-[13px] mb-6">
            Cada módulo está dictado por un especialista en su área. Y todos confluyen
            en un objetivo único.
          </p>
          <GoldButton href={CTA_LINK}>Quiero inscribirme</GoldButton>
        </RevealOnScroll>
      </div>
    </section>
  );
}
