"use client";

import { createElement, useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { animate, stagger } from "animejs";

/*
  Motion-firma "palabra hablada". El titular se descompone en palabras que entran
  una a una con un stagger que imita el ritmo del habla, no un fade uniforme. Es el
  "tell" reconocible del sello de autor. Dispara con IntersectionObserver al entrar
  al viewport y honra prefers-reduced-motion mostrando el texto completo sin animar.

  Accesibilidad: el contenedor expone el titular completo vía aria-label y las palabras
  fragmentadas quedan ocultas a tecnologías de asistencia para evitar lecturas
  entrecortadas palabra por palabra.
*/

const WORD_ENTER_DURATION_MS = 760;
const WORD_STAGGER_MS = 78;
const WORD_TRANSLATE_Y_PX = 26;
const VIEWPORT_TRIGGER_RATIO = 0.35;
const WORD_BLUR_PX = 6;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const WORD_SELECTOR = "[data-spoken-word]";
const WORD_SEPARATOR = " ";

type SpokenHeadlineProps = {
  text: string;
  as?: ElementType;
  className?: string;
  accent?: string;
  accentClassName?: string;
  trailing?: ReactNode;
};

function splitIntoWords(value: string): string[] {
  return value.split(WORD_SEPARATOR).filter((word) => word.length > 0);
}

export function SpokenHeadline({
  text,
  as = "h2",
  className,
  accent,
  accentClassName,
  trailing,
}: SpokenHeadlineProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const words = Array.from(
      container.querySelectorAll<HTMLElement>(WORD_SELECTOR),
    );

    if (prefersReducedMotion) {
      words.forEach((word) => {
        word.style.opacity = "1";
        word.style.transform = "none";
        word.style.filter = "none";
      });
      return;
    }

    const runReveal = () => {
      animate(words, {
        opacity: [0, 1],
        translateY: [WORD_TRANSLATE_Y_PX, 0],
        filter: [`blur(${WORD_BLUR_PX}px)`, "blur(0px)"],
        duration: WORD_ENTER_DURATION_MS,
        delay: stagger(WORD_STAGGER_MS),
        ease: "out(3)",
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runReveal();
            observer.disconnect();
          }
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const baseWords = splitIntoWords(text);
  const accentWords = accent ? splitIntoWords(accent) : [];
  const accessibleLabel = accent ? `${text} ${accent}` : text;

  const visualWords = (
    <span aria-hidden key="visual-words">
      {baseWords.map((word, index) => (
        <span
          key={`base-${index}-${word}`}
          data-spoken-word
          className="inline-block whitespace-pre opacity-0 will-change-transform"
        >
          {`${word}${WORD_SEPARATOR}`}
        </span>
      ))}
      {accentWords.map((word, index) => (
        <span
          key={`accent-${index}-${word}`}
          data-spoken-word
          className={`inline-block whitespace-pre opacity-0 will-change-transform ${accentClassName ?? ""}`}
        >
          {index < accentWords.length - 1 ? `${word}${WORD_SEPARATOR}` : word}
        </span>
      ))}
    </span>
  );

  return createElement(
    as,
    { ref: containerRef, className, "aria-label": accessibleLabel },
    visualWords,
    trailing,
  );
}
