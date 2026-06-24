"use client";

/*
  Hook de split-text + reveal con anime.js v4 para la variante "La Síntesis".
  Selecciona .syn-char o .syn-word, registra un IntersectionObserver y dispara
  la animación al entrar al viewport.

  Accesibilidad: el contenedor padre debe llevar aria-label con el texto completo.
  Los spans internos llevan aria-hidden="true". Si prefers-reduced-motion está
  activo, el hook no hace nada y los spans permanecen visibles.
*/

import { useEffect, useRef } from "react";

interface SynSplitRevealOptions {
  mode: "chars" | "words";
  staggerMs?: number;
  durationMs?: number;
  delayMs?: number;
  translateY?: number;
  threshold?: number;
}

export function useSynSplitReveal<T extends HTMLElement>(
  options: SynSplitRevealOptions,
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const {
      mode,
      staggerMs = 40,
      durationMs = 650,
      delayMs = 0,
      translateY = 28,
    } = options;

    const selector = mode === "chars" ? ".syn-char" : ".syn-word";
    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));

    if (targets.length === 0) return;

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${translateY}px)`;
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
      { threshold: options.threshold ?? 0.1 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return containerRef;
}
