"use client";

/*
  Lectura numérica animada. Cuenta desde cero hasta el valor final cuando la banda de
  stats entra al viewport, con numeración tabular mono para que el ancho no salte. Con
  reduced-motion muestra el valor final directamente. El valor vive en un span aparte
  del sufijo para mantener la alineación del panel de instrumentos.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type StatCounterProps = {
  value: number;
  suffix?: string;
};

const COUNT_DURATION = 1.7;

export function StatCounter({ value, suffix = "" }: StatCounterProps) {
  const valueRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = valueRef.current;
    if (!element) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      element.textContent = String(value);
      return;
    }

    const counter = { current: 0 };
    element.textContent = "0";

    const tween = gsap.to(counter, {
      current: value,
      duration: COUNT_DURATION,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = String(Math.round(counter.current));
      },
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  return (
    <span className="mono-num">
      <span ref={valueRef}>0</span>
      {suffix}
    </span>
  );
}
