"use client";

/*
  Canvas de onda scroll-driven — hilo conductor de "La Síntesis".
  Adaptado de VozWaveCanvas: la onda arranca temblorosa al inicio de la página
  y se estabiliza conforme avanza el scroll. Se usa como separador entre secciones.
  El color interpola de azul-frío a dorado con el progreso.
  Respeta prefers-reduced-motion mostrando una onda estática y estable.
*/

const WAVE_COLOR_START = { r: 77, g: 147, b: 245 };
const WAVE_COLOR_END   = { r: 255, g: 169, b: 2 };
const WAVE_BAR_COUNT   = 80;
const CANVAS_HEIGHT    = 80;
const TREMOR_SEED      = 42;

import { useEffect, useRef, useCallback } from "react";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(
  start: { r: number; g: number; b: number },
  end: { r: number; g: number; b: number },
  t: number,
): string {
  const r = Math.round(lerp(start.r, end.r, t));
  const g = Math.round(lerp(start.g, end.g, t));
  const b = Math.round(lerp(start.b, end.b, t));
  return `rgb(${r},${g},${b})`;
}

function computeBarAmplitude(
  barIndex: number,
  totalBars: number,
  scrollProgress: number,
  timeMs: number,
): number {
  const normalizedPos = barIndex / (totalBars - 1);
  const envelope = Math.sin(normalizedPos * Math.PI);
  const frequency = lerp(3, 8, scrollProgress);
  const speed = lerp(0.5, 2, scrollProgress);
  const traveling = Math.sin(normalizedPos * Math.PI * frequency + timeMs * 0.001 * speed);
  const tremorFreq = 22;
  const tremorSeed = Math.sin(barIndex * TREMOR_SEED);
  const tremorStrength = Math.max(0, 1 - scrollProgress * 1.6);
  const tremor = tremorSeed * Math.sin(normalizedPos * Math.PI * tremorFreq) * tremorStrength;
  const minAmp = lerp(2, 5, scrollProgress);
  const maxAmp = lerp(7, 32, scrollProgress);
  const energy = ((traveling * 0.5 + 0.5) + tremor * 0.3) * envelope * scrollProgress;
  return minAmp + energy * (maxAmp - minAmp);
}

type SynWaveCanvasProps = {
  className?: string;
  reducedMotion?: boolean;
};

export function SynWaveCanvas({ className = "", reducedMotion = false }: SynWaveCanvasProps) {
  const canvasRef       = useRef<HTMLCanvasElement | null>(null);
  const progressRef     = useRef<number>(0);
  const frameRef        = useRef<number | null>(null);
  const scrollPendingRef = useRef<boolean>(false);

  const drawFrame = useCallback((timeMs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr    = window.devicePixelRatio || 1;
    const width  = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (
      canvas.width  !== Math.round(width  * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      canvas.width  = Math.round(width  * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, width, height);

    const progress = progressRef.current;
    const centerY  = height / 2;
    const barWidth = lerp(1.5, 3, progress);
    const gap      = (width - WAVE_BAR_COUNT * barWidth) / (WAVE_BAR_COUNT - 1);
    const alpha    = lerp(0.3, 0.65, progress);
    const color    = lerpColor(WAVE_COLOR_START, WAVE_COLOR_END, progress);

    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;

    for (let i = 0; i < WAVE_BAR_COUNT; i++) {
      const amplitude = computeBarAmplitude(i, WAVE_BAR_COUNT, progress, timeMs);
      const x = i * (barWidth + gap);
      const y = centerY - amplitude;
      const h = amplitude * 2;
      const radius = barWidth / 2;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, h, radius);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, []);

  const scheduleFrame = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame((timeMs) => {
      frameRef.current = null;
      drawFrame(timeMs);
      scrollPendingRef.current = false;
    });
  }, [drawFrame]);

  const drawStaticWave = useCallback(() => {
    progressRef.current = 0.8;
    drawFrame(0);
  }, [drawFrame]);

  useEffect(() => {
    if (reducedMotion) {
      drawStaticWave();
      return;
    }

    const handleScroll = () => {
      if (scrollPendingRef.current) return;
      scrollPendingRef.current = true;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      scheduleFrame();
    };

    progressRef.current = 0;
    scheduleFrame();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleFrame);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleFrame);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [reducedMotion, scheduleFrame, drawStaticWave]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block w-full ${className}`}
      style={{ height: `${CANVAS_HEIGHT}px` }}
    />
  );
}
