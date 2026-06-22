"use client";

import { useEffect, useRef } from "react";

/*
  Motif de onda de voz. Separador SVG sutil que actúa como hilo entre secciones.
  Las barras laten con una amplitud derivada del progreso de scroll del elemento
  dentro del viewport: la onda "habla" mientras el usuario recorre la página, sin
  animación en bucle que distraiga. Honra prefers-reduced-motion congelando la onda
  en una amplitud de reposo discreta. Decorativo: oculto a tecnologías de asistencia.
*/

const BAR_COUNT = 56;
const BAR_WIDTH_PX = 2;
const BAR_GAP_PX = 4;
const VIEWBOX_HEIGHT = 48;
const MIN_AMPLITUDE = 3;
const MAX_AMPLITUDE = 20;
const REST_AMPLITUDE = 6;
const CENTER_Y = VIEWBOX_HEIGHT / 2;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const VIEWBOX_WIDTH = BAR_COUNT * (BAR_WIDTH_PX + BAR_GAP_PX);

function computeBarAmplitude(barIndex: number, scrollProgress: number): number {
  const normalizedPosition = barIndex / (BAR_COUNT - 1);
  const envelope = Math.sin(normalizedPosition * Math.PI);
  const traveling = Math.sin(
    normalizedPosition * Math.PI * 6 + scrollProgress * Math.PI * 4,
  );
  const dynamicRange = MAX_AMPLITUDE - MIN_AMPLITUDE;
  const energy = (traveling * 0.5 + 0.5) * envelope * scrollProgress;
  return MIN_AMPLITUDE + energy * dynamicRange;
}

type VoiceWaveformProps = {
  className?: string;
};

export function VoiceWaveform({ className }: VoiceWaveformProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<Array<SVGRectElement | null>>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    const applyAmplitudes = (scrollProgress: number) => {
      barRefs.current.forEach((bar, index) => {
        if (!bar) return;
        const amplitude = computeBarAmplitude(index, scrollProgress);
        bar.setAttribute("y", String(CENTER_Y - amplitude));
        bar.setAttribute("height", String(amplitude * 2));
      });
    };

    if (prefersReducedMotion) {
      const restRatio =
        (REST_AMPLITUDE - MIN_AMPLITUDE) / (MAX_AMPLITUDE - MIN_AMPLITUDE);
      applyAmplitudes(restRatio);
      return;
    }

    const computeScrollProgress = (): number => {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const distanceFromBottom = viewportHeight - rect.top;
      const travel = viewportHeight + rect.height;
      const raw = distanceFromBottom / travel;
      return Math.min(1, Math.max(0, raw));
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        applyAmplitudes(computeScrollProgress());
      });
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`flex w-full justify-center ${className ?? ""}`}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="h-10 w-full max-w-md text-blue-bright/40"
        preserveAspectRatio="none"
        role="presentation"
      >
        {Array.from({ length: BAR_COUNT }).map((_, index) => (
          <rect
            key={index}
            ref={(node) => {
              barRefs.current[index] = node;
            }}
            x={index * (BAR_WIDTH_PX + BAR_GAP_PX)}
            y={CENTER_Y - MIN_AMPLITUDE}
            width={BAR_WIDTH_PX}
            height={MIN_AMPLITUDE * 2}
            rx={BAR_WIDTH_PX / 2}
            fill="currentColor"
          />
        ))}
      </svg>
    </div>
  );
}
