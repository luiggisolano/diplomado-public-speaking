"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { LineIcon } from "@/components/LineIcon";
import { useReveal } from "@/components/motion/useReveal";
import { CONTACT, URGENCY } from "@/lib/content";

/*
  Bloque 9 — Urgencia y cierre, en el sistema "Aula Futura". Sobre un plano blueprint tenue que
  refuerza el registro futurista del cierre: un sello azul, tres razones reales en paneles
  card-tech, un titular de cierre con acento serif dorado, y una tarjeta de inscripción con un
  filete dorado, halo gold, pill flotante dorada y el CTA principal en grande. El CTA del cierre
  abre WhatsApp directo (wa.me) según la dirección creativa. Ancla #inscripcion: destino de los
  CTA de navegación de la página. Revelado on-scroll.
*/

export default function Urgency() {
  const containerRef = useReveal<HTMLDivElement>({ staggerMs: 110 });

  return (
    <section
      id="inscripcion"
      className="stage-a relative scroll-mt-24 py-[var(--space-section)]"
    >
      <div className="blueprint absolute inset-0" aria-hidden />

      <div ref={containerRef} className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center text-center">
          <span
            data-reveal="up"
            className="reveal-init mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-line-strong bg-navy-raised/60 text-blue-bright"
            aria-hidden
          >
            <LineIcon name="seal" className="h-8 w-8" strokeWidth={1.4} />
          </span>
          <SectionHeading
            eyebrow={URGENCY.eyebrow}
            title={URGENCY.title}
            align="center"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {URGENCY.reasons.map((reason) => (
            <article
              key={reason.title}
              data-reveal="rise"
              className="card-tech reveal-init flex flex-col gap-3 rounded-xl p-7"
            >
              <h3 className="font-serif text-base font-semibold leading-snug text-blue-bright">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-mist">
                {reason.body}
              </p>
            </article>
          ))}
        </div>

        <p
          data-reveal="up"
          className="reveal-init mt-16 text-center font-serif text-2xl font-semibold text-paper sm:text-3xl"
        >
          <span className="serif-accent serif-accent--italic font-normal text-gold">
            {URGENCY.closing}
          </span>
        </p>

        <div
          data-reveal="rise"
          className="reveal-init relative mt-14 overflow-hidden rounded-3xl border-2 border-gold/45 bg-navy-raised/70 px-6 pb-14 pt-16 text-center shadow-glow-gold sm:px-12"
        >
          <span
            className="spotlight--gold spotlight left-1/2 top-0 h-52 w-96 -translate-x-1/2"
            aria-hidden
          />
          <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 translate-y-5 rounded-full bg-gradient-to-b from-gold-soft to-gold px-7 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-abyss shadow-[0_12px_30px_-12px_rgba(255,169,2,0.7)]">
            {URGENCY.pill}
          </span>
          <h3 className="relative font-serif text-2xl font-semibold leading-tight text-paper sm:text-4xl">
            {URGENCY.closeCardTitle}
          </h3>
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-blue-bright to-blue px-12 py-6 text-lg font-semibold tracking-wide text-paper transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_26px_70px_-16px_rgba(77,147,245,0.7)] sm:w-auto"
          >
            {URGENCY.closeCtaLabel}
            <LineIcon name="arrow-right" className="h-5 w-5" strokeWidth={1.8} />
          </a>
          <p className="relative mt-6 text-sm leading-relaxed text-mist">
            {URGENCY.microcopy}
          </p>
        </div>
      </div>
    </section>
  );
}
