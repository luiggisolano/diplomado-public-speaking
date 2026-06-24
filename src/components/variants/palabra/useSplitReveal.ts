"use client";

/*
  Hook de utilidad para split de texto + reveal con anime.js v4.
  Genera spans por carácter o por palabra, registra un IntersectionObserver
  y dispara la animación al entrar al viewport.

  Accesibilidad: el contenedor padre debe tener aria-label con el texto completo.
  Los spans internos llevan aria-hidden="true" para que el lector de pantalla
  lea el aria-label en lugar de los caracteres individuales.
*/

import { useEffect, useRef } from "react";

interface SplitRevealOptions {
  mode: "chars" | "words";
  staggerMs?: number;
  durationMs?: number;
  delayMs?: number;
  translateY?: number;
  threshold?: number;
}

export function useSplitReveal<T extends HTMLElement>(
  options: SplitRevealOptions
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const {
      mode,
      staggerMs = 30,
      durationMs = 600,
      delayMs = 0,
      translateY = 32,
    } = options;

    let targets: Element[] = [];

    if (mode === "chars") {
      targets = Array.from(container.querySelectorAll(".pal-char"));
    } else {
      targets = Array.from(container.querySelectorAll(".pal-word"));
    }

    if (targets.length === 0) return;

    targets.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = `translateY(${translateY}px)`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          import("animejs").then(({ animate, stagger }) => {
            animate(targets, {
              opacity: [0, 1],
              translateY: [translateY, 0],
              delay: stagger(staggerMs, { start: delayMs }),
              duration: durationMs,
              ease: "outQuart",
            });
          });
        });
      },
      { threshold: options.threshold ?? 0.15 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return containerRef;
}
