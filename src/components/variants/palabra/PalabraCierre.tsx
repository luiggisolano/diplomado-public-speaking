"use client";

/*
  Cierre con CTA — "La Palabra".
  Titular display enorme, anchor #inscripcion, firma LS.
*/

import { SplitText } from "./SplitText";
import { useSplitReveal } from "./useSplitReveal";
import { useReveal } from "./useReveal";
import {
  SHARED_CLOSE,
  SHARED_CTA,
  SHARED_CONTACT,
  SHARED_AUTHOR,
} from "@/lib/variants-content";

export function PalabraCierre() {
  const headlineRef = useSplitReveal<HTMLHeadingElement>({
    mode: "words",
    staggerMs: 60,
    durationMs: 700,
    translateY: 30,
    threshold: 0.1,
  });

  const ctaRef = useReveal<HTMLDivElement>({ delayMs: 400 });

  return (
    <section
      id="inscripcion"
      className="stage-a px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)] relative overflow-hidden"
      aria-labelledby="pal-cierre-heading"
    >
      <div
        className="spotlight spotlight--gold absolute w-[600px] h-[600px] top-[-10%] right-[-8%] opacity-30"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <h2
          ref={headlineRef}
          id="pal-cierre-heading"
          aria-label={SHARED_CLOSE.headline}
          className="pal-close-headline mb-[clamp(2rem,4vw,3.5rem)]"
        >
          <SplitText
            text={SHARED_CLOSE.headline}
            mode="words"
            wordClassName="mr-[0.2em] last:mr-0"
          />
        </h2>

        <p className="tech-label text-[var(--color-gold)] mb-[clamp(2rem,4vw,3rem)] text-[0.68rem] tracking-[0.28em]">
          {SHARED_CLOSE.microcopy}
        </p>

        <div
          ref={ctaRef}
          className="pal-reveal-ready flex flex-wrap gap-[clamp(0.75rem,1.5vw,1rem)] items-center mb-[clamp(4rem,8vw,7rem)]"
        >
          <a
            href={SHARED_CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="pal-cta focus-ring"
          >
            {SHARED_CTA.whatsapp}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7h10M7 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={`mailto:${SHARED_CONTACT.email}`}
            className="pal-cta pal-cta--outline focus-ring"
          >
            Escribir por correo
          </a>
        </div>

        <div className="pal-rule mb-[clamp(1.5rem,3vw,2.5rem)]" />

        <footer className="flex flex-col gap-[0.3rem]">
          <p className="pal-author-sig">
            <strong>{SHARED_AUTHOR.studio}</strong>{" "}
            {SHARED_AUTHOR.label} · {SHARED_AUTHOR.note} · {SHARED_AUTHOR.year}
          </p>
          <p className="font-mono text-[0.65rem] tracking-[0.18em] text-[var(--color-mist-dim)] uppercase">
            {SHARED_CONTACT.institution}
          </p>
        </footer>
      </div>
    </section>
  );
}
