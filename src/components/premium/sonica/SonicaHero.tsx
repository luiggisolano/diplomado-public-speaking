"use client";

/*
  Hero de la dirección "Sónica". Wordmark brutalista masivo: las líneas de setup
  entran en gris atenuado y la afirmación final ("nadie lo nota.") se ensambla letra
  a letra con autoridad vía SplitText. Esa línea gigante lleva la aberración cromática
  CSS (fringe magenta/azul) que module su intensidad con --son-vel, la velocidad de
  scroll publicada por el backdrop WebGL. El texto es HTML real y legible: el shader
  vive detrás, nunca dentro de la tipografía.

  prefers-reduced-motion: sin SplitText ni animación, el wordmark queda estático y
  legible; la aberración cromática se apaga desde el CSS.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import { SHARED_HERO, SHARED_CTA, SHARED_CONTACT } from "@/lib/variants-content";

export function SonicaHero() {
  const displayRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    registerGsapPlugins();

    const display = displayRef.current;
    if (!display || prefersReducedMotionNow()) {
      return;
    }

    const split = new SplitText(display, { type: "lines,chars", linesClass: "son-split-line" });
    gsap.set(split.chars, { yPercent: 118, opacity: 0 });
    const tween = gsap.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.92,
      ease: "expo.out",
      stagger: 0.018,
      delay: 0.25,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  return (
    <section className="son-section son-section--immersive son-hero" aria-labelledby="son-hero-heading">
      <div className="son-hero__scrim" aria-hidden="true" />
      <div className="son-wrap son-hero__inner">
        <p className="son-label son-hero__kicker">{SHARED_HERO.kicker}</p>

        <h1 id="son-hero-heading" ref={displayRef} className="son-hero__display">
          <span className="son-hero__line son-hero__line--sm">{SHARED_HERO.line1}</span>
          <span className="son-hero__line son-hero__line--sm son-hero__line--dim">
            {SHARED_HERO.line2}
          </span>
          <span className="son-hero__line son-hero__accent">{SHARED_HERO.accent}</span>
        </h1>

        <p className="son-hero__sub son-body">{SHARED_HERO.sub}</p>

        <div className="son-hero__cta">
          <a href={SHARED_CTA.href} className="son-btn son-btn--primary">
            <span>{SHARED_CTA.primary}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path
                d="M4 12h15M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={SHARED_CONTACT.whatsappLink}
            className="son-btn son-btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path
                d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.5L3.5 20l1-4.5A8.5 8.5 0 1 1 20.5 11.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-.2-1.2-1.6-.5-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-.5-1.6L9.9 8.5c-.5 0-.9.4-.9 1Z"
                fill="currentColor"
              />
            </svg>
            <span>{SHARED_CTA.whatsapp}</span>
          </a>
        </div>

        <p className="son-hero__micro son-label">{SHARED_HERO.microcopy}</p>
      </div>

      <div className="son-hero__scroll" aria-hidden="true">
        <span className="son-label">Scroll</span>
        <span className="son-hero__scroll-track">
          <span className="son-hero__scroll-dot" />
        </span>
      </div>
    </section>
  );
}
