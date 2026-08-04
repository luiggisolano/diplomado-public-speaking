"use client";

/*
  Un renglón de la transformación: el antes a la izquierda, su después exacto a la derecha y
  entre los dos un eje que se pinta de oro con el avance del scroll mientras el después se
  enciende de gris a hueso.

  Los diez puntos del copy no son dos listas sino CINCO PARES —«tu voz pide permiso» tiene su
  respuesta en «tu voz transmite autoridad»—, y presentarlos enfrentados es lo que hace
  visible ese paralelismo, que en dos columnas sueltas se pierde.

  El gesto va atado al recorrido con scrub, como el resto de la página: al subir se deshace y
  el después vuelve a apagarse, de modo que la sección se rearma para quien la relee. Sin
  curva, porque una carga que adelanta o retrasa al dedo delata el truco.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

const INICIO_DEL_PASO = "top 85%";
const FINAL_DEL_PASO = "top 55%";
const RETARDO_DEL_SEGUIMIENTO = 0.4;

/*
  El después arranca al 35 % y no a cero: es texto, no un adorno, y quien llega con la
  sección ya en pantalla debe poder leerlo aunque el gesto no haya corrido.
*/
const OPACIDAD_DE_PARTIDA_DEL_DESPUES = 0.35;

type PasoDeTransformacionProps = {
  antes: string;
  despues: string;
};

export function PasoDeTransformacion({ antes, despues }: PasoDeTransformacionProps) {
  const filaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fila = filaRef.current;
    const carga = fila?.querySelector(".pod-paso__carga");
    const textoDelDespues = fila?.querySelector(".pod-paso__despues");
    if (!fila || !carga || !textoDelDespues) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(carga, { scaleX: 1 });
      gsap.set(textoDelDespues, { opacity: 1 });
      return;
    }

    gsap.set(carga, { scaleX: 0 });
    gsap.set(textoDelDespues, { opacity: OPACIDAD_DE_PARTIDA_DEL_DESPUES });

    const paso = gsap
      .timeline({
        scrollTrigger: {
          trigger: fila,
          start: INICIO_DEL_PASO,
          end: FINAL_DEL_PASO,
          scrub: RETARDO_DEL_SEGUIMIENTO,
          invalidateOnRefresh: true,
        },
      })
      .to(carga, { scaleX: 1, ease: "none" }, 0)
      .to(textoDelDespues, { opacity: 1, ease: "none" }, 0);

    return () => {
      paso.scrollTrigger?.kill();
      paso.kill();
    };
  }, []);

  return (
    <div ref={filaRef} className="pod-paso">
      <p className="pod-paso__antes">{antes}</p>
      <span className="pod-paso__eje" aria-hidden="true">
        <span className="pod-paso__carga" />
      </span>
      <p className="pod-paso__despues">{despues}</p>
    </div>
  );
}
