"use client";

import { useEffect, useRef } from "react";
import { SHARED_STATS } from "@/lib/variants-content";

/*
  StatsCounter — contadores animados con anime.js para la barra de estadísticas.
  Usa IntersectionObserver para disparar la animación cuando entra al viewport.
  prefers-reduced-motion: muestra el valor final sin animación.
*/

export function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const spans = Array.from(
      container.querySelectorAll<HTMLElement>("[data-count-target]")
    );

    if (reduceMotion) {
      spans.forEach((span) => {
        const target = Number(span.dataset.countTarget ?? 0);
        span.textContent = String(target);
      });
      return;
    }

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          observer.disconnect();

          try {
            const { animate } = await import("animejs");

            spans.forEach((span) => {
              const target = Number(span.dataset.countTarget ?? 0);
              const suffix = span.dataset.countSuffix ?? "";
              const obj = { val: 0 };

              animate(obj, {
                val: target,
                duration: 1800,
                easing: "easeOutExpo",
                onUpdate: () => {
                  span.textContent = String(Math.round(obj.val)) + suffix;
                },
              });
            });
          } catch {
            spans.forEach((span) => {
              const target = Number(span.dataset.countTarget ?? 0);
              const suffix = span.dataset.countSuffix ?? "";
              span.textContent = String(target) + suffix;
            });
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="esc-stats" aria-label="Datos del diplomado">
      {SHARED_STATS.map((stat) => (
        <div key={stat.label} className="esc-stat-item">
          <span
            className="esc-stat-value mono-num"
            data-count-target={stat.value}
            data-count-suffix={stat.suffix}
          >
            {stat.value}{stat.suffix}
          </span>
          <span className="esc-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
