"use client";

/*
  Hook de accesibilidad compartido por las tres landings de gama alta (/g/*).
  Devuelve true cuando el sistema del usuario pide reducir el movimiento
  (prefers-reduced-motion: reduce). Las escenas WebGL, el scroll suave de Lenis y
  las animaciones de GSAP consultan este valor para degradar a un estado estático
  legible. Reacciona en vivo a los cambios del media query.
*/

import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
    setPrefersReducedMotion(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/*
  Versión imperativa para código fuera de React (setup de OGL/GSAP). Lee el estado
  actual del media query sin suscribirse. Devuelve false en entorno servidor.
*/
export function prefersReducedMotionNow(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
