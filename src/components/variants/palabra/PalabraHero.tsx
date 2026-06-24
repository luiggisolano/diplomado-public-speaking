"use client";

/*
  Hero de "La Palabra" — tipografía cinética.
  El protagonista es el texto: líneas enormes, animación de entrada por caracteres,
  palabra rotante en el subtítulo y CTA doble.
*/

import { useEffect, useRef } from "react";
import { SplitText } from "./SplitText";
import { useSplitReveal } from "./useSplitReveal";
import {
  SHARED_HERO,
  SHARED_CTA,
  SHARED_CONTACT,
} from "@/lib/variants-content";

const ROTATING_VERBS = ["decide", "recuerdan", "escuchan", "eligen", "confían"];

export function PalabraHero() {
  const line1Ref = useSplitReveal<HTMLDivElement>({
    mode: "words",
    staggerMs: 60,
    durationMs: 700,
    translateY: 28,
    threshold: 0.05,
  });

  const line2Ref = useSplitReveal<HTMLDivElement>({
    mode: "words",
    staggerMs: 55,
    durationMs: 650,
    delayMs: 180,
    translateY: 24,
    threshold: 0.05,
  });

  const accentRef = useSplitReveal<HTMLDivElement>({
    mode: "chars",
    staggerMs: 28,
    durationMs: 550,
    delayMs: 360,
    translateY: 20,
    threshold: 0.05,
  });

  const rotatingRef = useRef<HTMLSpanElement>(null);
  const verbIndexRef = useRef(0);

  useEffect(() => {
    const el = rotatingRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;

    const cycle = () => {
      if (!active || !el) return;
      verbIndexRef.current = (verbIndexRef.current + 1) % ROTATING_VERBS.length;
      const nextVerb = ROTATING_VERBS[verbIndexRef.current];

      import("animejs").then(({ animate }) => {
        if (!active) return;
        animate(el, {
          opacity: [1, 0],
          translateY: [0, -12],
          duration: 280,
          ease: "inQuart",
          onComplete: () => {
            if (!el || !active) return;
            el.textContent = nextVerb;
            animate(el, {
              opacity: [0, 1],
              translateY: [12, 0],
              duration: 340,
              ease: "outQuart",
            });
          },
        });
      });
    };

    const intervalId = setInterval(cycle, 2400);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      className="pal-hero-bg hero-field stage-a grain relative min-h-[100dvh] flex flex-col justify-center px-[clamp(1.5rem,5vw,5rem)] py-[clamp(4rem,8vw,7rem)] overflow-hidden"
      aria-labelledby="pal-hero-headline"
    >
      <div className="relative z-10 max-w-[1200px] mx-auto w-full">
        <p className="tech-label mb-[clamp(2rem,4vw,3.5rem)]" aria-hidden="true">
          {SHARED_HERO.kicker}
        </p>

        <div
          id="pal-hero-headline"
          className="mb-[clamp(0.5rem,1.5vw,1.2rem)]"
        >
          <div
            ref={line1Ref}
            aria-label={SHARED_HERO.line1}
            className="pal-hero-display block"
          >
            <SplitText
              text={SHARED_HERO.line1}
              mode="words"
              wordClassName="mr-[0.22em] last:mr-0"
            />
          </div>

          <div
            ref={line2Ref}
            aria-label={SHARED_HERO.line2}
            className="pal-hero-display pal-hero-display--sans block mt-[0.08em]"
          >
            <SplitText
              text={SHARED_HERO.line2}
              mode="words"
              wordClassName="mr-[0.2em] last:mr-0"
            />
          </div>

          <div
            ref={accentRef}
            aria-label={SHARED_HERO.accent}
            className="pal-hero-display pal-accent-word block mt-[0.06em]"
          >
            <SplitText
              text={SHARED_HERO.accent}
              mode="chars"
            />
          </div>
        </div>

        <div className="pal-rule pal-rule--gold my-[clamp(1.5rem,3vw,2.5rem)]" />

        <p className="text-[var(--color-mist)] font-sans max-w-[54ch] text-[clamp(1rem,0.85rem+0.6vw,1.15rem)] leading-relaxed mb-2">
          {SHARED_HERO.sub.split("—")[0]}
          {SHARED_HERO.sub.includes("—") && (
            <>
              <span className="text-[var(--color-paper)] font-medium">
                {" "}quien{" "}
                <span ref={rotatingRef} className="pal-rotating-word">
                  {ROTATING_VERBS[0]}
                </span>
                {" "}antes de escucharte
              </span>
            </>
          )}
        </p>

        <p className="text-[var(--color-mist)] font-sans max-w-[54ch] text-[clamp(0.9rem,0.78rem+0.45vw,1.05rem)] leading-relaxed mb-[clamp(2rem,4vw,3rem)]">
          {SHARED_HERO.sub}
        </p>

        <p className="tech-label text-[var(--color-gold)] mb-[clamp(1.5rem,3vw,2.5rem)] text-[0.68rem] tracking-[0.3em]">
          {SHARED_HERO.microcopy}
        </p>

        <div className="flex flex-wrap gap-[clamp(0.75rem,1.5vw,1rem)] items-center">
          <a
            href={SHARED_CTA.href}
            className="pal-cta focus-ring"
          >
            {SHARED_CTA.primary}
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
            href={SHARED_CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="pal-cta pal-cta--outline focus-ring"
          >
            {SHARED_CTA.whatsapp}
          </a>
        </div>
      </div>

      <div
        className="spotlight spotlight--gold absolute w-[500px] h-[500px] bottom-[-10%] right-[-5%] opacity-40"
        aria-hidden="true"
      />
    </section>
  );
}
