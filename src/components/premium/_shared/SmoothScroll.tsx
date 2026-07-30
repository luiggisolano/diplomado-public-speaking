"use client";

/*
  Proveedor de scroll suave compartido por las tres landings de gama alta.
  Integra Lenis (inercia de scroll de la escena Awwwards) con el ticker de GSAP y
  con ScrollTrigger, siguiendo el patrón recomendado por GSAP: Lenis manda el rAF,
  ScrollTrigger.update se dispara en cada evento de scroll de Lenis y se desactiva
  el lagSmoothing para que el scrubbing sea 1:1.

  Respeta prefers-reduced-motion: si el usuario pide menos movimiento, NO se instancia
  Lenis y la página cae al scroll nativo del navegador, evitando el desfase de inercia.
  Envolver el contenido de cada page.tsx de /g/<slug> con este componente.
*/

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsapPlugins } from "./gsapSetup";
import { prefersReducedMotionNow } from "./useReducedMotion";

type SmoothScrollProps = {
  children: React.ReactNode;
  lerp?: number;
};

const DEFAULT_LERP = 0.1;

export function SmoothScroll({ children, lerp = DEFAULT_LERP }: SmoothScrollProps) {
  useEffect(() => {
    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      return;
    }

    const lenis = new Lenis({
      lerp,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const syncScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", syncScrollTrigger);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", syncScrollTrigger);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [lerp]);

  return <>{children}</>;
}
