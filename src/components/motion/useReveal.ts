"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/*
  Primitiva de revelado on-scroll basada en anime.js v4.
  Observa el contenedor; cuando entra al viewport, anima los hijos marcados con
  [data-reveal] desde su estado CSS inicial (.reveal-init) hasta su posición natural.
  Honra prefers-reduced-motion saltando la animación y mostrando el contenido.
*/

const REVEAL_SELECTOR = "[data-reveal]";
const VIEWPORT_TRIGGER_RATIO = 0.2;
const BASE_DURATION_MS = 900;
const STAGGER_STEP_MS = 90;

type RevealOptions = {
  staggerMs?: number;
  durationMs?: number;
  once?: boolean;
};

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );

    if (prefersReducedMotion) {
      targets.forEach((node) => node.classList.remove("reveal-init"));
      return;
    }

    const {
      staggerMs = STAGGER_STEP_MS,
      durationMs = BASE_DURATION_MS,
      once = true,
    } = options;

    const runReveal = () => {
      targets.forEach((node) => node.classList.remove("reveal-init"));
      animate(targets, {
        opacity: [0, 1],
        translateY: [
          (el: HTMLElement) =>
            el.getAttribute("data-reveal") === "rise" ? 48 : 28,
          0,
        ],
        duration: durationMs,
        delay: stagger(staggerMs),
        ease: "out(4)",
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runReveal();
            if (once) observer.disconnect();
          }
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [options]);

  return containerRef;
}
