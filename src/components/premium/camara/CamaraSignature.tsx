"use client";

/*
  Firma de autor "LS" — adaptación scoped a la paleta azul de Cámara Anecoica. La firma
  global del estudio usa dorado, fuera de gama en esta dirección monocroma; aquí el
  monograma se redibuja en azul-glow con el mismo gesto de trazo caligráfico que se
  dibuja solo al entrar al viewport, más una micro-salpicadura de tinta. El trazo se
  anima con Web Animations API (sin dependencias extra) y honra reduced-motion
  mostrando la firma completa. Deja además la firma en consola. Es el invariante de
  marca: cambie el cliente o la gama, esta firma cierra la pieza.
*/

import { useEffect, useRef } from "react";
import { SHARED_AUTHOR } from "@/lib/variants-content";

const STROKE_DRAW_DURATION_MS = 1900;
const SPLATTER_FADE_DURATION_MS = 650;
const SPLATTER_FADE_DELAY_MS = 1500;
const SPLATTER_RESTING_OPACITY = 0.55;
const VIEWPORT_TRIGGER_RATIO = 0.5;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const STROKE_SELECTOR = "[data-signature-stroke]";
const SPLATTER_SELECTOR = "[data-signature-splatter]";

const CONSOLE_MONOGRAM_STYLE =
  "color:#e7b655;font-size:15px;font-weight:800;letter-spacing:0.18em;";
const CONSOLE_NOTE_STYLE =
  "color:#7c766a;font-size:11px;letter-spacing:0.04em;";

export function CamaraSignature() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const strokes = Array.from(
      root.querySelectorAll<SVGPathElement>(STROKE_SELECTOR),
    );
    const splatters = Array.from(
      root.querySelectorAll<SVGElement>(SPLATTER_SELECTOR),
    );
    if (strokes.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (prefersReducedMotion) {
      strokes.forEach((stroke) => {
        stroke.style.strokeDasharray = "none";
        stroke.style.strokeDashoffset = "0";
      });
      splatters.forEach((splatter) => {
        splatter.style.opacity = String(SPLATTER_RESTING_OPACITY);
      });
      return;
    }

    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.strokeDasharray = String(length);
      stroke.style.strokeDashoffset = String(length);
    });

    const drawSignature = () => {
      strokes.forEach((stroke) => {
        stroke
          .animate(
            [{ strokeDashoffset: stroke.getTotalLength() }, { strokeDashoffset: 0 }],
            {
              duration: STROKE_DRAW_DURATION_MS,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              fill: "forwards",
            },
          )
          .finished.then(() => {
            stroke.style.strokeDashoffset = "0";
          })
          .catch(() => {
            stroke.style.strokeDashoffset = "0";
          });
      });

      splatters.forEach((splatter) => {
        splatter.animate(
          [
            { opacity: 0, transform: "scale(0.2)" },
            { opacity: SPLATTER_RESTING_OPACITY, transform: "scale(1)" },
          ],
          {
            duration: SPLATTER_FADE_DURATION_MS,
            delay: SPLATTER_FADE_DELAY_MS,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        );
      });
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
    console.log(
      `%c${SHARED_AUTHOR.studio}%c  ${SHARED_AUTHOR.console}`,
      CONSOLE_MONOGRAM_STYLE,
      CONSOLE_NOTE_STYLE,
    );
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative z-[1] border-t border-line bg-navy-deep py-16"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <svg
          viewBox="0 0 240 120"
          className="cam-monogram h-20 w-auto"
          fill="none"
          role="img"
          aria-label={`Firma del estudio ${SHARED_AUTHOR.studio}`}
        >
          <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              data-signature-stroke
              d="M52 24 C 40 22, 36 32, 40 50 C 44 72, 44 86, 62 92 C 78 97, 98 86, 106 72"
              strokeWidth={3.2}
            />
            <path
              data-signature-stroke
              d="M106 50 C 132 26, 158 40, 142 58 C 128 73, 120 79, 140 90 C 156 99, 178 91, 190 72"
              strokeWidth={3.2}
            />
            <path
              data-signature-stroke
              d="M34 104 C 96 92, 168 116, 212 97 C 220 93, 215 86, 207 91"
              strokeWidth={1.8}
              opacity={0.8}
            />
          </g>
          <g stroke="none">
            <circle data-signature-splatter cx={198} cy={64} r={2.1} />
            <circle data-signature-splatter cx={207} cy={73} r={1.4} />
            <circle data-signature-splatter cx={214} cy={59} r={1} />
            <circle data-signature-splatter cx={189} cy={82} r={1.6} />
          </g>
        </svg>

        <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-mist-dim">
          {SHARED_AUTHOR.label} {SHARED_AUTHOR.studio} · {SHARED_AUTHOR.year}
        </p>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mist-dim">
          {SHARED_AUTHOR.note}
        </p>
      </div>
    </footer>
  );
}
