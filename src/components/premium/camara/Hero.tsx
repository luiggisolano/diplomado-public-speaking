"use client";

/*
  Hero de Cámara Anecoica. El visitante entra a la sala silenciosa: el campo de
  partículas respira detrás, en reposo, y el titular se revela palabra a palabra desde
  máscaras de línea, sincronizado con el pulso del campo. Anclaje editorial a la
  izquierda, rail de metadatos técnico arriba y una señal de scroll que invita a
  descender. La coreografía corre en el montaje (no en scroll) para que el primer
  golpe llegue de inmediato; con reduced-motion todo aparece estático y legible. Un
  scrim radial detrás del texto garantiza contraste sobre el campo en movimiento.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import {
  SHARED_CONTACT,
  SHARED_CTA,
  SHARED_HERO,
} from "@/lib/variants-content";

export function Hero() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const lineOneRef = useRef<HTMLSpanElement | null>(null);
  const lineTwoRef = useRef<HTMLSpanElement | null>(null);
  const lineThreeRef = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const microRef = useRef<HTMLParagraphElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerGsapPlugins();

    const content = contentRef.current;
    const cue = cueRef.current;
    const lineElements = [
      lineOneRef.current,
      lineTwoRef.current,
      lineThreeRef.current,
    ].filter((element): element is HTMLSpanElement => element !== null);

    if (prefersReducedMotionNow()) {
      content?.style.setProperty("opacity", "1");
      cue?.style.setProperty("opacity", "1");
      return;
    }

    const splits = lineElements.map(
      (element) =>
        new SplitText(element, { type: "words", wordsClass: "cam-word" }),
    );
    const words = splits.flatMap((split) => split.words);

    gsap.set(words, { yPercent: 115, opacity: 0 });
    gsap.set(
      [kickerRef.current, subRef.current, ctaRef.current, microRef.current],
      { opacity: 0, y: 14 },
    );
    gsap.set(cue, { opacity: 0, y: 12 });
    gsap.set(content, { opacity: 1 });

    const timeline = gsap.timeline({
      delay: 0.15,
      defaults: { ease: "power4.out" },
    });

    timeline
      .to(kickerRef.current, { opacity: 1, y: 0, duration: 0.7 })
      .to(
        words,
        { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.05 },
        "-=0.25",
      )
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
      .to(microRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
      .to(cue, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

    return () => {
      timeline.kill();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[100dvh] flex-col"
    >
      <div className="cam-scrim" />

      <div className="relative z-[1] mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <div className="cam-meta-rail mt-6 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
          <span className="text-blue-bright">Cámara Anecoica / Lab-01</span>
          <span className="hidden sm:inline">{SHARED_CONTACT.institution}</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-14">
          <div ref={contentRef} className="cam-reveal max-w-4xl">
            <p ref={kickerRef} className="tech-label">
              {SHARED_HERO.kicker}
            </p>

            <h1
              id="hero-title"
              className="mt-7 font-serif text-[var(--text-display)] font-medium leading-[1.04] tracking-[-0.025em]"
            >
              <span ref={lineOneRef} className="cam-line text-paper">
                {SHARED_HERO.line1}
              </span>
              <span ref={lineTwoRef} className="cam-line text-paper/60">
                {SHARED_HERO.line2}
              </span>
              <span
                ref={lineThreeRef}
                className="cam-line italic text-blue-bright"
              >
                {SHARED_HERO.accent}
              </span>
            </h1>

            <p
              ref={subRef}
              className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-mist"
            >
              {SHARED_HERO.sub}
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <a href={SHARED_CTA.href} className="cam-btn-primary focus-ring">
                {SHARED_CTA.primary}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href={SHARED_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cam-btn-ghost focus-ring"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 13.5l1-2.6A5 5 0 1113 8a5 5 0 01-7.4 4.4l-3.1 1.1z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                {SHARED_CTA.whatsapp}
              </a>
            </div>

            <p
              ref={microRef}
              className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-mist-dim"
            >
              {SHARED_HERO.microcopy}
            </p>
          </div>
        </div>

        <div
          ref={cueRef}
          className="cam-reveal flex items-center gap-4 pb-10"
        >
          <div className="cam-scrollcue-line" aria-hidden="true" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
            Desliza · campo en reposo
          </span>
        </div>
      </div>
    </section>
  );
}
