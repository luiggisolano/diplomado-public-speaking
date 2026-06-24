"use client";

/*
  Hook de reveal por IntersectionObserver para elementos individuales.
  Anima con fade+translateY al entrar al viewport. Respetar prefers-reduced-motion.
*/

import { useEffect, useRef } from "react";

interface RevealOptions {
  translateY?: number;
  durationMs?: number;
  delayMs?: number;
  threshold?: number;
}

export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const { translateY = 28, durationMs = 700, delayMs = 0, threshold = 0.1 } = options;

    el.style.opacity = "0";
    el.style.transform = `translateY(${translateY}px)`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          import("animejs").then(({ animate }) => {
            animate(el, {
              opacity: [0, 1],
              translateY: [translateY, 0],
              duration: durationMs,
              delay: delayMs,
              ease: "outQuart",
            });
          });
        });
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
}
