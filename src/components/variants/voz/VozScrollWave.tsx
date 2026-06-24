"use client";

import { useEffect, useRef } from "react";
import { VozWaveCanvas } from "./VozWaveCanvas";

/*
  Separador entre secciones: waveform sticky scroll-driven + ecualizador de barras.
  Actúa como el "entre-actos" del viaje vocal: mientras el usuario transita de
  una sección a la siguiente, la onda pulsa y el ecualizador de barras doradas
  marca el ritmo. El conjunto es decorativo y no interrumpe la lectura.
  Honra prefers-reduced-motion: las barras quedan en estado estático neutro.
*/

const EQ_BAR_COUNT    = 12;
const EQ_HEIGHTS_REM  = [0.8, 1.4, 2.0, 1.6, 2.4, 1.8, 2.6, 1.4, 2.0, 1.2, 1.8, 0.9];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type VozScrollWaveProps = {
  sectionLabel?: string;
};

export function VozScrollWave({ sectionLabel }: VozScrollWaveProps) {
  const eqRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const eq = eqRef.current;
    if (!eq || prefersReducedMotion) return;

    const bars = Array.from(eq.querySelectorAll<HTMLSpanElement>("[data-eq-bar]"));

    bars.forEach((bar, index) => {
      const delay     = index * 95;
      const duration  = 1100 + index * 80;
      bar.style.animationDelay    = `${delay}ms`;
      bar.style.animationDuration = `${duration}ms`;
      bar.classList.add("voz-eq-bar-animated");
    });
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-3 py-10"
      aria-hidden
      role="presentation"
    >
      {/* Ecualizador de barras doradas */}
      <div
        ref={eqRef}
        className="flex items-end gap-[3px]"
        aria-hidden
      >
        {EQ_HEIGHTS_REM.map((h, index) => (
          <span
            key={index}
            data-eq-bar
            className="voz-eq-bar"
            style={{ height: `${h}rem` }}
          />
        ))}
      </div>

      {/* Onda de separación */}
      <VozWaveCanvas className="max-w-lg opacity-40" />

      {/* Etiqueta de sección (opcional) */}
      {sectionLabel && (
        <p className="tech-label mt-1 text-[color:var(--color-blue-bright)]">
          {sectionLabel}
        </p>
      )}
    </div>
  );
}
