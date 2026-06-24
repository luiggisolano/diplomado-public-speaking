"use client";

/*
  Sección de transformación antes/después — La Síntesis.
  Contraste tipográfico de La Palabra: tachado en serif italic (antes)
  vs afirmación en sans bold con punto dorado (después).
  La cita de cierre se revela con IntersectionObserver.
*/

import { useEffect, useRef } from "react";
import { SHARED_TRANSFORMATION } from "@/lib/variants-content";

export function SynTransformacion() {
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.opacity   = "0";
    el.style.transform = "translateY(28px)";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          import("animejs").then(({ animate }) => {
            animate(el, {
              opacity: [0, 1],
              translateY: [28, 0],
              duration: 750,
              ease: "outQuart",
            });
          });
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="bg-[color:var(--color-navy-deep)] px-[clamp(1.5rem,5vw,5rem)] py-[var(--space-section)]"
      aria-labelledby="syn-transformacion-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <p
          data-syn-reveal
          className="syn-eyebrow"
        >
          {SHARED_TRANSFORMATION.eyebrow}
        </p>

        <h2
          id="syn-transformacion-heading"
          data-syn-reveal
          className="syn-section-headline mb-[clamp(2.5rem,5vw,4rem)]"
        >
          {SHARED_TRANSFORMATION.headline}
        </h2>

        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] md:grid-cols-2 mb-[clamp(3rem,6vw,5rem)]">
          {/* Antes: serif italic tachado */}
          <div data-syn-reveal>
            <p className="tech-label text-[color:var(--color-mist-dim)] mb-4">
              Antes
            </p>
            <ul className="space-y-4" role="list">
              {SHARED_TRANSFORMATION.before.map((item, i) => (
                <li key={i} className="syn-before-text">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Después: sans bold con punto dorado */}
          <div data-syn-reveal>
            <p className="tech-label text-[color:var(--color-gold)] mb-4">
              Después
            </p>
            <ul className="space-y-4" role="list">
              {SHARED_TRANSFORMATION.after.map((item, i) => (
                <li key={i} className="syn-after-text">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cita central */}
        <blockquote ref={quoteRef} className="syn-quote">
          {SHARED_TRANSFORMATION.quote}
        </blockquote>
      </div>
    </section>
  );
}
