"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

interface RevealOptions {
  translateY?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
  stagger?: number;
  selector?: string;
}

export function useRevealAnime<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    translateY = 32,
    delay = 0,
    duration = 800,
    threshold = 0.15,
    stagger,
    selector,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targets = selector ? element.querySelectorAll(selector) : element;

    anime.set(targets, { opacity: 0, translateY });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(element);
        anime({
          targets,
          opacity: [0, 1],
          translateY: [translateY, 0],
          duration,
          delay: stagger
            ? anime.stagger(stagger, { start: delay })
            : delay,
          easing: "cubicBezier(.58,.3,.005,1)",
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [translateY, delay, duration, threshold, stagger, selector]);

  return ref;
}
