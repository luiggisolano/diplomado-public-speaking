"use client";

import { SpokenHeadline } from "@/components/motion/SpokenHeadline";
import { VoiceWaveform } from "@/components/motion/VoiceWaveform";
import { CtaButton } from "@/components/CtaButton";
import { FINAL_CLOSE } from "@/lib/content";

/*
  Bloque 11 — Coda final, en el sistema "Aula Futura". Reprisa del titular del Hero con la
  motion-firma "palabra hablada" y la línea de cierre en acento serif dorado, último CTA
  principal y onda de voz que baja el telón. El bloque de contacto vive en el pie de página
  institucional; aquí queda la coda emocional para no duplicar información. Spotlight inferior
  azul que evoca el cono de luz del escenario futurista.
*/

export default function FinalClose() {
  return (
    <section className="stage-b relative overflow-hidden py-[var(--space-section)]">
      <span
        className="spotlight bottom-0 left-1/2 h-56 w-[36rem] -translate-x-1/2"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <SpokenHeadline
          text={FINAL_CLOSE.titleLineOne}
          accent={FINAL_CLOSE.titleAccent}
          as="h2"
          className="font-serif text-[length:var(--text-section)] font-semibold leading-[1.08] tracking-[-0.02em] text-paper"
          accentClassName="serif-accent serif-accent--italic font-normal text-gold"
        />

        <CtaButton size="large" microcopy={FINAL_CLOSE.microcopy} className="mt-12" />

        <VoiceWaveform className="mt-16" />
      </div>
    </section>
  );
}
