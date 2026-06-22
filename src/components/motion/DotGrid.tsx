"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/*
  Campo de partículas — firma de movimiento inspirada en animejs.com. Una retícula de
  puntos que entra con un stagger por grilla desde el centro (escala + opacidad) y luego
  mantiene un titileo continuo de baja amplitud, como un panel de instrumentos respirando.
  Es la textura futurista de fondo del hero y de los divisores de sección.

  Decorativo: aria-hidden y pointer-events-none. Honra prefers-reduced-motion mostrando
  los puntos en un estado tenue y estático, sin animación en bucle.
*/

const DOT_SELECTOR = "[data-dot]";
const ENTER_DURATION_MS = 1400;
const ENTER_STAGGER_MS = 32;
const SHIMMER_DURATION_MS = 2600;

type DotGridProps = {
  columns?: number;
  rows?: number;
  className?: string;
};

export function DotGrid({ columns = 18, rows = 10, className }: DotGridProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const dots = Array.from(root.querySelectorAll<HTMLElement>(DOT_SELECTOR));
    if (dots.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      dots.forEach((dot) => {
        dot.style.opacity = "0.16";
        dot.style.transform = "scale(1)";
      });
      return;
    }

    const entrance = animate(dots, {
      opacity: [0, 0.42],
      scale: [0, 1],
      duration: ENTER_DURATION_MS,
      delay: stagger(ENTER_STAGGER_MS, {
        grid: [columns, rows],
        from: "center",
      }),
      ease: "out(3)",
    });

    const shimmer = animate(dots, {
      opacity: [0.42, 0.12],
      duration: SHIMMER_DURATION_MS,
      delay: stagger(120, { grid: [columns, rows], from: "center" }),
      loop: true,
      alternate: true,
      ease: "inOut(2)",
    });

    return () => {
      entrance.pause();
      shimmer.pause();
    };
  }, [columns, rows]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none grid ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: columns * rows }).map((_, index) => (
        <span
          key={index}
          className="flex items-center justify-center"
        >
          <span
            data-dot
            className="block h-[3px] w-[3px] rounded-full bg-blue-bright opacity-0"
          />
        </span>
      ))}
    </div>
  );
}
