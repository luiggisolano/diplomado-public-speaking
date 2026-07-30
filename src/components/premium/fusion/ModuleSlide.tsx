"use client";

/*
  Entrada lateral de las tarjetas de módulo. Cada tarjeta parte desplazada hacia un lado
  —alternando izquierda/derecha por índice, en zig-zag— y se desliza hasta su posición
  original en el grid cuando asoma al hacer scroll, con un fundido y un escalonado por
  columna. El estado inicial oculto lo aporta la clase cam-reveal en CSS para evitar el
  flash antes de que GSAP tome el control; con reduced-motion la tarjeta aparece en su
  sitio, sin desplazamiento. El contenedor del grid recorta el eje X (overflow-x-clip)
  para que el desplazamiento no genere scroll horizontal.
*/

import { useEffect, useRef, type ReactNode } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

const SLIDE_DISTANCE = 140;
const SLIDE_DURATION = 1.05;
const COLUMN_STAGGER = 0.09;
const COLUMNS = 3;

type ModuleSlideProps = {
  index: number;
  children: ReactNode;
};

export function ModuleSlide({ index, children }: ModuleSlideProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(element, { opacity: 1, x: 0 });
      return;
    }

    const fromX = index % 2 === 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE;
    gsap.set(element, { opacity: 0, x: fromX });

    const tween = gsap.to(element, {
      opacity: 1,
      x: 0,
      duration: SLIDE_DURATION,
      ease: "power3.out",
      delay: (index % COLUMNS) * COLUMN_STAGGER,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [index]);

  return (
    <div ref={elementRef} className="cam-reveal h-full">
      {children}
    </div>
  );
}
