"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SHARED_HERO, SHARED_CTA, SHARED_CONTACT } from "@/lib/variants-content";
import { HeroBeam } from "./HeroBeam";

/*
  EscenarioHero — sección hero del escenario teatral.
  El haz de luz cae desde arriba; el titular y CTA entran con stagger anime.js.
  En el estado sin JS el contenido es visible (reveal-init queda sin estilo
  activo; los elementos tienen opacity:1 vía CSS de seguridad más abajo).
*/

export function EscenarioHero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const targets = [
      kickerRef.current,
      headlineRef.current,
      subRef.current,
      ctaRef.current,
    ].filter(Boolean) as HTMLElement[];

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
    });

    const loadAnime = async () => {
      try {
        const { animate, stagger } = await import("animejs");
        animate(targets, {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 900,
          delay: stagger(120, { start: 400 }),
          easing: "easeOutExpo",
        });
      } catch {
        targets.forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      }
    };

    loadAnime();
  }, []);

  return (
    <section className="esc-hero hero-field grain" aria-label="Presentación del diplomado">
      <HeroBeam />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", width: "100%" }}>
        <span ref={kickerRef} className="esc-hero-kicker">
          {SHARED_HERO.kicker}
        </span>

        <h1 ref={headlineRef} className="esc-hero-headline">
          {SHARED_HERO.line1}{" "}
          {SHARED_HERO.line2}{" "}
          <em className="esc-hero-accent">{SHARED_HERO.accent}</em>
        </h1>

        <p ref={subRef} className="esc-hero-sub">
          {SHARED_HERO.sub}
        </p>

        <div ref={ctaRef} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href={SHARED_CTA.href}
            className="esc-cta"
            aria-label={SHARED_CTA.primary}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {SHARED_CTA.primary}
          </Link>
          <a
            href={SHARED_CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="esc-cta esc-cta--ghost"
            aria-label={SHARED_CTA.whatsapp}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8.5 9.5c.3 1.2.9 2.3 1.7 3.2.9.9 2 1.5 3.2 1.7l1.1-1.1c.1-.1.3-.2.4-.1.6.3 1.2.5 1.9.6.2 0 .3.2.3.4v1.8c0 .2-.2.4-.4.4C9.9 16.4 7.6 14.1 7.6 8.9c0-.2.2-.4.4-.4H9.8c.2 0 .4.1.4.3.1.7.3 1.3.6 1.9.1.2 0 .3-.1.4l-1.1 1.1-.1-.7z" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {SHARED_CTA.whatsapp}
          </a>
        </div>

        <span className="esc-hero-microcopy">{SHARED_HERO.microcopy}</span>
      </div>
    </section>
  );
}
