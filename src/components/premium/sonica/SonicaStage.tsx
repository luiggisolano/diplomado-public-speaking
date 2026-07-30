"use client";

/*
  Escenario de la dirección "Sónica". Es el cerebro de movimiento a nivel de página:
  1) Monta el fondo WebGL (import dinámico ssr:false, obligatorio para OGL).
  2) Coordina el revelado por scroll de los bloques marcados con [data-son-reveal]
     usando ScrollTrigger.batch, para que las secciones puramente presentacionales
     (Server Components) reciban entrada escalonada sin lógica propia.

  Respeta prefers-reduced-motion: no monta backdrop (cae al degradado CSS) y deja
  todo el contenido visible sin animación de entrada. La clase .son-anim solo se
  añade cuando el movimiento está permitido, de modo que sin JS o con reduced-motion
  los bloques nunca quedan ocultos.
*/

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  gsap,
  ScrollTrigger,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

const SonicaBackdrop = dynamic(
  () => import("./SonicaBackdrop").then((module) => module.SonicaBackdrop),
  { ssr: false },
);

const REVEAL_SELECTOR = "[data-son-reveal]";

type SonicaStageProps = {
  children: React.ReactNode;
};

export function SonicaStage({ children }: SonicaStageProps) {
  const flowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerGsapPlugins();

    const flow = flowRef.current;
    if (!flow || prefersReducedMotionNow()) {
      return;
    }

    flow.classList.add("son-anim");
    const targets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR, flow);
    if (targets.length === 0) {
      return;
    }

    gsap.set(targets, { opacity: 0, y: 28 });
    const triggers = ScrollTrigger.batch(targets, {
      start: "top 86%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          overwrite: true,
        }),
    });
    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      gsap.set(targets, { clearProps: "opacity,transform" });
      flow.classList.remove("son-anim");
    };
  }, []);

  return (
    <>
      <div className="son-backdrop" aria-hidden="true">
        <SonicaBackdrop />
      </div>
      <div ref={flowRef} className="son-flow">
        {children}
      </div>
    </>
  );
}
