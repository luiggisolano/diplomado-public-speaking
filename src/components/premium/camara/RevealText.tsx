"use client";

/*
  Revelado tipográfico palabra a palabra. Envuelve un titular de texto plano y, al
  entrar al viewport, hace subir cada palabra desde una máscara de línea con un stagger
  breve, sincronizado con la respiración del campo de partículas. Usa SplitText y
  ScrollTrigger de la infraestructura GSAP compartida. Con reduced-motion no divide ni
  anima: el titular queda visible y accesible tal cual, y el texto original permanece
  intacto para lectores de pantalla.
*/

import { createElement, useEffect, useRef } from "react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type HeadingTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type RevealTextProps = {
  text: string;
  as?: HeadingTag;
  className?: string;
  delay?: number;
  id?: string;
};

const REVEAL_DURATION = 0.9;
const REVEAL_STAGGER = 0.045;

export function RevealText({
  text,
  as = "h2",
  className,
  delay = 0,
  id,
}: RevealTextProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    registerGsapPlugins();
    element.style.opacity = "1";

    if (prefersReducedMotionNow()) {
      return;
    }

    const split = new SplitText(element, {
      type: "lines,words",
      linesClass: "cam-line",
      wordsClass: "cam-word",
    });

    gsap.set(split.words, { yPercent: 115, opacity: 0 });

    const tween = gsap.to(split.words, {
      yPercent: 0,
      opacity: 1,
      duration: REVEAL_DURATION,
      ease: "power4.out",
      stagger: REVEAL_STAGGER,
      delay,
      scrollTrigger: {
        trigger: element,
        start: "top 82%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [delay, text]);

  return createElement(
    as,
    { ref: elementRef, id, className: `cam-reveal ${className ?? ""}`.trim() },
    text,
  );
}
