"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/*
  Contenedor de revelado on-scroll para las secciones de "La Voz".
  Los hijos marcados con [data-voz-reveal] aparecen en cascada cuando el
  contenedor entra al viewport. Honra prefers-reduced-motion mostrando el
  contenido de inmediato. Variante de useReveal.ts específica para esta página.
*/

const VIEWPORT_TRIGGER_RATIO = 0.18;
const BASE_DURATION_MS       = 860;
const STAGGER_STEP_MS        = 100;
const REDUCED_MOTION_QUERY   = "(prefers-reduced-motion: reduce)";

type VozRevealSectionProps = {
  children:   React.ReactNode;
  className?: string;
  as?:        React.ElementType;
  id?:        string;
};

export function VozRevealSection({
  children,
  className = "",
  as: Tag   = "section",
  id,
}: VozRevealSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-voz-reveal]"),
    );

    if (prefersReducedMotion) {
      targets.forEach((node) => {
        node.style.opacity   = "1";
        node.style.transform = "none";
      });
      return;
    }

    targets.forEach((node) => {
      node.style.opacity   = "0";
      node.style.transform = "translateY(32px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animate(targets, {
            opacity:    [0, 1],
            translateY: [32, 0],
            duration:   BASE_DURATION_MS,
            delay:      stagger(STAGGER_STEP_MS),
            ease:       "out(4)",
          });
          observer.disconnect();
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLElement>}
      className={className}
      id={id}
    >
      {children}
    </Tag>
  );
}
