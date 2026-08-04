"use client";

/*
  Revelado de bloque de cuerpo (nivel T2 del contrato visual). Sustituye a Reveal de
  premium/camara sin tocarlo: aquel lo consumen /g/camara, /g/fusion, /g/reflector y
  /g/sonica, y recalibrar su gesto cambiaría cuatro rutas más.

  Frente al original el desplazamiento baja de 26 a 12 px y la duración de 0,9 a 0,55 s.
  El cuerpo de la página son 57 bloques sobre 19.000 px de recorrido: a esa escala un
  gesto largo se lee como lentitud, no como elegancia. La entrada ocurre una sola vez y
  no revierte al subir, porque la reversibilidad está reservada a los titulares, que son
  los que marcan capítulo.

  El estado oculto de partida lo pone la clase .cam-reveal en CSS, para que no haya destello
  antes de que GSAP tome el control. Se emite esa clase EXACTA y no una propia: sostiene
  cuatro contratos vivos de podio.css a la vez (el estado oculto, la red de movimiento
  reducido, el estirado de las cinco retículas y el ritmo entre las dos frases del cierre),
  y el peor de los cuatro falla en silencio. Si un envoltorio necesitara distinguirse, lo
  haría con un data-*, nunca sustituyendo la clase.

  La comprobación de movimiento reducido se hace en tiempo de ejecución y no solo por media
  query: si el bloque se quedara sin animar, sin esta comprobación se quedaría además
  invisible.
*/

import { useEffect, useRef, type ReactNode } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type RevelaPodioProps = {
  children: ReactNode;
  className?: string;
  desplazamiento?: number;
  retardo?: number;
};

const DURACION_DE_LA_ENTRADA = 0.55;
const DESPLAZAMIENTO_VERTICAL_POR_DEFECTO = 12;
const CURVA_DE_SALIDA = "power2.out";
const PUNTO_DE_DISPARO = "top 88%";

export function RevelaPodio({
  children,
  className,
  desplazamiento = DESPLAZAMIENTO_VERTICAL_POR_DEFECTO,
  retardo = 0,
}: RevelaPodioProps) {
  const elementoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elemento = elementoRef.current;
    if (!elemento) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(elemento, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(elemento, { opacity: 0, y: desplazamiento });

    const entrada = gsap.to(elemento, {
      opacity: 1,
      y: 0,
      duration: DURACION_DE_LA_ENTRADA,
      ease: CURVA_DE_SALIDA,
      delay: retardo,
      scrollTrigger: {
        trigger: elemento,
        start: PUNTO_DE_DISPARO,
        once: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      entrada.scrollTrigger?.kill();
      entrada.kill();
    };
  }, [desplazamiento, retardo]);

  return (
    <div ref={elementoRef} className={`cam-reveal ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
