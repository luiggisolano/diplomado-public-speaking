"use client";

/*
  Fondo WebGL de la dirección "Sónica". Monta un fragment shader a pantalla completa
  (mountFullscreenShader del andamiaje compartido) que reacciona a la VELOCIDAD del
  scroll y al puntero. Se importa siempre con next/dynamic { ssr:false } desde el
  stage, y además se autoprotege: si no hay soporte WebGL o el usuario pide reducir
  movimiento, no monta nada y deja ver el degradado estático de respaldo del CSS.

  Publica la velocidad suavizada en la variable CSS global --son-vel (0..1) para que
  el wordmark del hero module su aberración cromática CSS con la misma señal.
*/

import { useEffect, useRef } from "react";
import { Vec2 } from "ogl";
import {
  isWebglAvailable,
  mountFullscreenShader,
} from "@/components/premium/_shared/oglScene";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import { SONICA_BACKDROP_FRAGMENT } from "./shaders";

const SCROLL_VELOCITY_DIVISOR = 46;
const VELOCITY_SMOOTHING = 0.12;
const POINTER_SMOOTHING = 0.06;
const REVEAL_SMOOTHING = 0.03;
const VELOCITY_CSS_VARIABLE = "--son-vel";

export function SonicaBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (!isWebglAvailable() || prefersReducedMotionNow()) {
      return;
    }

    const pointerTarget = new Vec2(0, 0);
    const pointerCurrent = new Vec2(0, 0);
    let lastScrollY = window.scrollY;
    let smoothedVelocity = 0;
    let reveal = 0;

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handle = mountFullscreenShader({
      canvas,
      fragment: SONICA_BACKDROP_FRAGMENT,
      dprCap: 1.75,
      uniforms: {
        uScrollVelocity: { value: 0 },
        uPointer: { value: new Vec2(0, 0) },
        uReveal: { value: 0 },
      },
      onFrame: (_timeSeconds, uniforms) => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        const instantVelocity = Math.min(scrollDelta / SCROLL_VELOCITY_DIVISOR, 1);
        smoothedVelocity += (instantVelocity - smoothedVelocity) * VELOCITY_SMOOTHING;
        (uniforms.uScrollVelocity as { value: number }).value = smoothedVelocity;

        pointerCurrent.lerp(pointerTarget, POINTER_SMOOTHING);
        (uniforms.uPointer.value as Vec2).copy(pointerCurrent);

        reveal += (1 - reveal) * REVEAL_SMOOTHING;
        (uniforms.uReveal as { value: number }).value = reveal;

        document.documentElement.style.setProperty(
          VELOCITY_CSS_VARIABLE,
          smoothedVelocity.toFixed(3),
        );
      },
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      handle.destroy();
      document.documentElement.style.removeProperty(VELOCITY_CSS_VARIABLE);
    };
  }, []);

  return <canvas ref={canvasRef} className="son-backdrop__canvas" aria-hidden="true" />;
}
