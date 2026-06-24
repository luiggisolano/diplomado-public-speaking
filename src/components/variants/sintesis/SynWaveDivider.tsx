"use client";

/*
  Separador entre secciones de "La Síntesis".
  Combina ecualizador de barras doradas + onda scroll-driven. Actúa como el
  "hilo conductor" vocal entre secciones. Decorativo, no interrumpe la lectura.
  Respeta prefers-reduced-motion: barras en estado estático neutro.
*/

import { useEffect, useRef } from "react";
import { SynWaveCanvas } from "./SynWaveCanvas";

const EQ_BAR_COUNT    = 12;
const EQ_HEIGHTS_REM  = [0.7, 1.3, 1.9, 1.5, 2.2, 1.7, 2.4, 1.3, 1.8, 1.1, 1.7, 0.8];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type SynWaveDividerProps = {
  sectionLabel?: string;
};

export function SynWaveDivider({ sectionLabel }: SynWaveDividerProps) {
  const eqRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const eq = eqRef.current;
    if (!eq || prefersReducedMotion) return;

    const bars = Array.from(eq.querySelectorAll<HTMLSpanElement>("[data-syn-bar]"));

    bars.forEach((bar, index) => {
      const delay    = index * 90;
      const duration = 1100 + index * 75;
      bar.style.animationDelay    = `${delay}ms`;
      bar.style.animationDuration = `${duration}ms`;
      bar.classList.add("syn-eq-bar--animated");
    });
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-3 py-8"
      aria-hidden
      role="presentation"
    >
      <div ref={eqRef} className="flex items-end gap-[3px]" aria-hidden>
        {EQ_HEIGHTS_REM.map((h, index) => (
          <span
            key={index}
            data-syn-bar
            className="syn-eq-bar"
            style={{ height: `${h}rem` }}
          />
        ))}
      </div>

      <SynWaveCanvas className="max-w-lg opacity-35" />

      {sectionLabel && (
        <p className="tech-label mt-1 text-[color:var(--color-blue-bright)]">
          {sectionLabel}
        </p>
      )}
    </div>
  );
}
