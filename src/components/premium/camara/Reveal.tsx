"use client";

/*
  Revelado de bloque. Entrada discreta (fundido más translación vertical corta) para
  párrafos, tarjetas y filas cuando entran al viewport. El estado inicial oculto lo
  aporta la clase cam-reveal en CSS para evitar el flash antes de que GSAP tome el
  control; con reduced-motion el contenido se muestra de inmediato sin desplazamiento.
*/

import { useEffect, useRef, type ReactNode } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  offsetY?: number;
  delay?: number;
};

const REVEAL_DURATION = 0.9;
const DEFAULT_OFFSET_Y = 26;

export function Reveal({
  children,
  className,
  offsetY = DEFAULT_OFFSET_Y,
  delay = 0,
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(element, { opacity: 0, y: offsetY });

    const tween = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: REVEAL_DURATION,
      ease: "power3.out",
      delay,
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [offsetY, delay]);

  return (
    <div ref={elementRef} className={`cam-reveal ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
