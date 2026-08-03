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
  anchorOffset?: number;
};

const DEFAULT_LERP = 0.1;

export function SmoothScroll({ children, lerp = DEFAULT_LERP, anchorOffset }: SmoothScrollProps) {
  useEffect(() => {
    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      return;
    }

    /*
      Con «anchors» es Lenis quien atiende los clics en enlaces de fragmento, en lugar del
      salto nativo del navegador. Sin esto la página se teletransportaría al destino y Lenis
      tendría que recuperar después su posición interna, que es donde aparece el tirón. El
      desplazamiento va en negativo porque se mide como aire por encima del destino.

      Queda desactivado mientras no se pida un desplazamiento, y no es una comodidad de la
      API: Lenis atiende el clic con preventDefault, así que mueve la vista pero no el foco.
      Un enlace de salto al contenido principal, que es el uso que las demás rutas hacen de
      los fragmentos, dejaría de servir para quien navega con teclado. Solo lo activa la
      página que de verdad navega por anclas.
    */
    const lenis = new Lenis({
      lerp,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      anchors: anchorOffset === undefined ? false : { offset: -anchorOffset },
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
  }, [lerp, anchorOffset]);

  return <>{children}</>;
}
