"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

/*
  Motivo de micrófono — emblema del diplomado. Micrófono de mano dibujado en línea
  (estética técnica/blueprint) cuya silueta se traza al montar (stroke-dashoffset), con
  la rejilla iluminada en ámbar institucional. A la derecha, tres arcos de onda sonora
  emiten en bucle hacia afuera (opacidad + desplazamiento), el "tell" de oratoria.

  Decorativo y semánticamente nulo (aria-hidden). Honra prefers-reduced-motion: silueta
  visible y ondas en estado estático, sin bucle.
*/

const STROKE_SELECTOR = "[data-mic-stroke]";
const WAVE_SELECTOR = "[data-mic-wave]";
const DRAW_DURATION_MS = 1700;
const WAVE_DURATION_MS = 2400;

type MicrophoneMotifProps = {
  className?: string;
};

export function MicrophoneMotif({ className }: MicrophoneMotifProps) {
  const rootRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const strokes = Array.from(
      root.querySelectorAll<SVGGeometryElement>(STROKE_SELECTOR),
    );
    const waves = Array.from(root.querySelectorAll<SVGElement>(WAVE_SELECTOR));

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.strokeDasharray = `${length}`;
      stroke.style.strokeDashoffset = prefersReducedMotion ? "0" : `${length}`;
    });

    if (prefersReducedMotion) {
      waves.forEach((wave) => {
        wave.style.opacity = "0.4";
      });
      return;
    }

    const draw = createTimeline({ defaults: { ease: "out(3)" } });
    draw.add(strokes, {
      strokeDashoffset: [
        (el: SVGGeometryElement) => el.getTotalLength(),
        0,
      ],
      duration: DRAW_DURATION_MS,
      delay: stagger(90),
    });

    const pulse = animate(waves, {
      opacity: [0, 0.7, 0],
      translateX: [-6, 10],
      scale: [0.85, 1.05],
      duration: WAVE_DURATION_MS,
      delay: stagger(380),
      loop: true,
      ease: "inOut(2)",
    });

    return () => {
      draw.pause();
      pulse.pause();
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 220 260"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="mic-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-blue-glow)" />
          <stop offset="100%" stopColor="var(--color-utmach)" />
        </linearGradient>
      </defs>

      {/* Ondas sonoras emitidas hacia la derecha */}
      <g transform="translate(150 84)">
        {[0, 1, 2].map((index) => (
          <path
            key={index}
            data-mic-wave
            d={`M 0 ${-18 - index * 14} A ${22 + index * 16} ${22 + index * 16} 0 0 1 0 ${18 + index * 14}`}
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0"
          />
        ))}
      </g>

      {/* Cápsula del micrófono */}
      <rect
        data-mic-stroke
        x="64"
        y="26"
        width="52"
        height="96"
        rx="26"
        stroke="url(#mic-body)"
        strokeWidth="3"
      />
      {/* Rejilla iluminada en ámbar */}
      {[44, 58, 72, 86, 100].map((y) => (
        <line
          key={y}
          data-mic-stroke
          x1="74"
          y1={y}
          x2="106"
          y2={y}
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {/* Yugo / arco de sujeción */}
      <path
        data-mic-stroke
        d="M 48 92 V 104 A 42 42 0 0 0 132 104 V 92"
        stroke="url(#mic-body)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Vástago y base */}
      <line
        data-mic-stroke
        x1="90"
        y1="146"
        x2="90"
        y2="210"
        stroke="url(#mic-body)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        data-mic-stroke
        x1="56"
        y1="212"
        x2="124"
        y2="212"
        stroke="url(#mic-body)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
