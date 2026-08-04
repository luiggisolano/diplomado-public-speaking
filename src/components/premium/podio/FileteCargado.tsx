"use client";

/*
  Filete que se carga de oro con el avance del scroll. Es un doble filete: uno de tinta al
  14 % que está siempre y sostiene la retícula, y encima uno de oro que crece de cero a uno.

  El gesto va atado al recorrido con scrub y no disparado con duración propia, que es la
  diferencia entre una carga y una animación: al subir se descarga sola, sin necesidad de
  toggleActions, y la escena se rearma para quien la relee. Es también el único gesto de la
  página que no tiene curva: con ease distinto de none el oro adelantaría o retrasaría al
  dedo, y lo que se busca es justamente que lo siga.

  El escalado se aplica a un hijo y no al propio filete porque un borde no se puede escalar
  sin escalar la caja que lo dibuja, y porque transformar el contenedor arrastraría con él
  la línea de tinta que debe quedarse quieta.

  Decorativo por completo: la información de que hay seis síntomas la da la lista ordenada
  que lo aloja, así que va fuera del árbol de accesibilidad.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

/*
  La carga empieza cuando el filete entra por el 90 % de la ventana y termina cuando llega
  al 42 %, es decir justo cuando la frase que abre queda a la altura de lectura. El retardo
  del scrub es el que separa un seguimiento mecánico de uno con peso.
*/
const INICIO_DE_LA_CARGA = "top 90%";
const FINAL_DE_LA_CARGA = "top 42%";
const RETARDO_DEL_SEGUIMIENTO = 0.4;

export function FileteCargado() {
  const fileteRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const filete = fileteRef.current;
    const carga = filete?.firstElementChild;
    if (!filete || !carga) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(carga, { scaleX: 1 });
      return;
    }

    gsap.set(carga, { scaleX: 0 });

    const avance = gsap.to(carga, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: filete,
        start: INICIO_DE_LA_CARGA,
        end: FINAL_DE_LA_CARGA,
        scrub: RETARDO_DEL_SEGUIMIENTO,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      avance.scrollTrigger?.kill();
      avance.kill();
    };
  }, []);

  return (
    <span ref={fileteRef} className="pod-filete" aria-hidden="true">
      <span className="pod-filete__carga" />
    </span>
  );
}
