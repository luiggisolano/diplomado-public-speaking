"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

/*
  Contador animado — dato académico que se incrementa de cero al valor real al entrar al
  viewport. Refuerza el registro de panel de instrumentos (créditos, horas, módulos). El
  número se renderiza en mono tabular para que no salte el ancho durante la animación.

  Honra prefers-reduced-motion mostrando el valor final de inmediato.
*/

const COUNT_DURATION_MS = 1800;
const VIEWPORT_TRIGGER_RATIO = 0.6;

type CountUpProps = {
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export function CountUp({ to, suffix = "", prefix = "", className }: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const render = (value: number) => {
      node.textContent = `${prefix}${Math.round(value)}${suffix}`;
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      render(to);
      return;
    }

    render(0);
    const counter = { value: 0 };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(counter, {
              value: to,
              duration: COUNT_DURATION_MS,
              ease: "out(4)",
              onUpdate: () => render(counter.value),
            });
            observer.disconnect();
          }
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, suffix, prefix]);

  return <span ref={nodeRef} className={`mono-num ${className ?? ""}`} />;
}
