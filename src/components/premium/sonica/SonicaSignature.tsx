"use client";

/*
  Firma de autor "LS" adaptada a la dirección Sónica (invariante de marca del estudio).
  Cierra la pieza como la firma de un pintor: el monograma se dibuja solo al entrar al
  viewport (stroke-dasharray draw-on) y una micro-señal magenta parpadea al terminar el
  trazo, ecoando el motivo "en vivo" de toda la landing. Aquí el trazo es azul eléctrico,
  no dorado, para respetar la paleta de la variante. Honra prefers-reduced-motion
  mostrando la firma completa y deja una firma en consola para quien inspeccione.
*/

import { useEffect, useRef } from "react";
import { SHARED_AUTHOR } from "@/lib/variants-content";

const STROKE_SELECTOR = "[data-son-stroke]";
const SIGNAL_SELECTOR = "[data-son-signal-dot]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const VIEWPORT_TRIGGER_RATIO = 0.5;
const STROKE_DRAW_DURATION_MS = 1600;
const SIGNAL_RESTING_OPACITY = 0.9;

const CONSOLE_MONOGRAM_STYLE =
  "color:#e7b655;font-size:15px;font-weight:800;letter-spacing:0.2em;";
const CONSOLE_NOTE_STYLE = "color:#7c766a;font-size:11px;letter-spacing:0.04em;";

export function SonicaSignature() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const strokes = Array.from(root.querySelectorAll<SVGPathElement>(STROKE_SELECTOR));
    const signals = Array.from(root.querySelectorAll<SVGElement>(SIGNAL_SELECTOR));
    if (strokes.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (prefersReducedMotion) {
      strokes.forEach((stroke) => {
        stroke.style.strokeDasharray = "none";
        stroke.style.strokeDashoffset = "0";
      });
      signals.forEach((signal) => {
        signal.style.opacity = String(SIGNAL_RESTING_OPACITY);
      });
      return;
    }

    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.strokeDasharray = String(length);
      stroke.style.strokeDashoffset = String(length);
      stroke.style.transition = `stroke-dashoffset ${STROKE_DRAW_DURATION_MS}ms cubic-bezier(0.16,1,0.3,1)`;
    });
    signals.forEach((signal) => {
      signal.style.opacity = "0";
      signal.style.transition = "opacity 500ms ease";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          strokes.forEach((stroke) => {
            stroke.style.strokeDashoffset = "0";
          });
          window.setTimeout(() => {
            signals.forEach((signal) => {
              signal.style.opacity = String(SIGNAL_RESTING_OPACITY);
            });
          }, STROKE_DRAW_DURATION_MS - 200);
          observer.disconnect();
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
    <footer ref={rootRef} className="son-sign">
      <div className="son-wrap son-sign__inner">
        <svg
          viewBox="0 0 220 120"
          className="son-sign__mark"
          fill="none"
          role="img"
          aria-label={`Firma del estudio ${SHARED_AUTHOR.studio}`}
        >
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path data-son-stroke d="M44 26 L44 90 L96 90" strokeWidth={4} />
            <path
              data-son-stroke
              d="M170 40 C150 26 120 30 122 50 C124 66 158 62 160 80 C161 96 128 98 112 84"
              strokeWidth={4}
            />
            <path
              data-son-stroke
              d="M40 104 C96 94 150 112 182 98"
              strokeWidth={1.8}
              opacity={0.7}
            />
          </g>
          <g stroke="none">
            <circle data-son-signal-dot cx={190} cy={90} r={3} fill="var(--son-signal)" />
            <circle data-son-signal-dot cx={198} cy={82} r={1.6} fill="var(--son-signal)" />
          </g>
        </svg>

        <div className="son-sign__meta">
          <p className="son-sign__crafted son-label">
            {SHARED_AUTHOR.label} {SHARED_AUTHOR.studio} · {SHARED_AUTHOR.year}
          </p>
          <p className="son-sign__note">{SHARED_AUTHOR.note}</p>
        </div>
      </div>
    </footer>
  );
}
