"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { SHARED_AUTHOR } from "@/lib/variants-content";

/*
  Firma de autor LS para la variante "La Voz". Cierra la pieza con el invariante
  de marca: monograma caligráfico draw-on-scroll en tinta dorada + data en mono.
  Variante de AuthorSignature.tsx adaptada al contenido de SHARED_AUTHOR.
*/

const STROKE_DRAW_DURATION_MS      = 1800;
const SPLATTER_FADE_DURATION_MS    = 700;
const SPLATTER_FADE_DELAY_MS       = 1500;
const VIEWPORT_TRIGGER_RATIO       = 0.5;
const REDUCED_MOTION_QUERY         = "(prefers-reduced-motion: reduce)";
const SIGNATURE_STROKE_SELECTOR    = "[data-voz-sig-stroke]";
const SPLATTER_SELECTOR            = "[data-voz-sig-splatter]";
const SPLATTER_RESTING_OPACITY     = 0.55;

export function VozAuthorSignature() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const strokes   = Array.from(root.querySelectorAll<SVGPathElement>(SIGNATURE_STROKE_SELECTOR));
    const splatters = Array.from(root.querySelectorAll<SVGElement>(SPLATTER_SELECTOR));

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (prefersReducedMotion) {
      strokes.forEach((s) => {
        s.style.strokeDasharray  = "none";
        s.style.strokeDashoffset = "0";
      });
      splatters.forEach((s) => {
        s.style.opacity = String(SPLATTER_RESTING_OPACITY);
      });
      return;
    }

    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.strokeDasharray  = String(length);
      stroke.style.strokeDashoffset = String(length);
    });
    splatters.forEach((s) => { s.style.opacity = "0"; });

    const drawSignature = () => {
      animate(strokes, {
        strokeDashoffset: [
          (stroke: SVGPathElement) => stroke.getTotalLength(),
          0,
        ],
        duration: STROKE_DRAW_DURATION_MS,
        ease:     "inOut(3)",
      });
      if (splatters.length > 0) {
        animate(splatters, {
          opacity:  [0, SPLATTER_RESTING_OPACITY],
          scale:    [0.2, 1],
          duration: SPLATTER_FADE_DURATION_MS,
          delay:    SPLATTER_FADE_DELAY_MS,
          ease:     "out(2)",
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            drawSignature();
            observer.disconnect();
          }
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const CONSOLE_MONOGRAM_STYLE =
      "color:#ffa902;font-size:15px;font-weight:800;letter-spacing:0.18em;";
    const CONSOLE_NOTE_STYLE =
      "color:#aebcd4;font-size:11px;letter-spacing:0.04em;";
    console.log(
      `%c${SHARED_AUTHOR.studio}%c  ${SHARED_AUTHOR.console}`,
      CONSOLE_MONOGRAM_STYLE,
      CONSOLE_NOTE_STYLE,
    );
  }, []);

  return (
    <footer
      ref={rootRef}
      className="voz-author-footer border-t border-[color:var(--color-line)] py-16"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <svg
          viewBox="0 0 240 120"
          className="h-20 w-auto text-[color:var(--color-gold)]"
          fill="none"
          role="img"
          aria-label={`Firma del estudio ${SHARED_AUTHOR.studio}`}
        >
          <defs>
            <filter id="voz-ink-texture" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves={1}
                seed={7}
                result="inkNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="inkNoise"
                scale={1.6}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g
            filter="url(#voz-ink-texture)"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              data-voz-sig-stroke
              d="M52 24 C 40 22, 36 32, 40 50 C 44 72, 44 86, 62 92 C 78 97, 98 86, 106 72"
              strokeWidth={3.2}
            />
            <path
              data-voz-sig-stroke
              d="M106 50 C 132 26, 158 40, 142 58 C 128 73, 120 79, 140 90 C 156 99, 178 91, 190 72"
              strokeWidth={3.2}
            />
            <path
              data-voz-sig-stroke
              d="M34 104 C 96 92, 168 116, 212 97 C 220 93, 215 86, 207 91"
              strokeWidth={1.8}
              opacity={0.85}
            />
          </g>

          <g fill="currentColor" stroke="none">
            <circle data-voz-sig-splatter cx={198} cy={64} r={2.1} />
            <circle data-voz-sig-splatter cx={207} cy={73} r={1.4} />
            <circle data-voz-sig-splatter cx={214} cy={59} r={1} />
            <circle data-voz-sig-splatter cx={189} cy={82} r={1.6} />
          </g>
        </svg>

        <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-mist-dim)]">
          {SHARED_AUTHOR.label} {SHARED_AUTHOR.studio} · {SHARED_AUTHOR.year}
        </p>
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[color:var(--color-mist-dim)]">
          {SHARED_AUTHOR.note}
        </p>
      </div>
    </footer>
  );
}
