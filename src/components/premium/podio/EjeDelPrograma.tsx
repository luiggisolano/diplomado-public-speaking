"use client";

/*
  Eje del programa: la línea de la que cuelgan los seis módulos, que se carga de oro con el
  avance del scroll y va encendiendo el punto de cada uno al alcanzarlo.

  Es el mismo gesto que FileteCargado, un escalón más arriba: allí cada filete carga su
  propio tramo, aquí una sola carga recorre la sección entera y convierte el programa en un
  camino con principio y final. Va atado al recorrido con scrub, así que al subir se
  descarga sola y el orden de encendido se deshace en sentido inverso.

  El encendido se calcula contra la escala real del oro y no contra el progreso del
  disparador. Con scrub la carga lleva inercia y va por detrás del scroll: leyendo el
  progreso del disparador, los puntos se encenderían antes de que el oro los hubiera
  alcanzado, que es justo lo que delataría el truco.

  El eje es decorativo y no anuncia nada: el orden del programa lo da la lista de módulos
  que envuelve, no esta línea.
*/

import { useEffect, useRef, type ReactNode } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

const INICIO_DE_LA_CARGA = "top 78%";
const FINAL_DE_LA_CARGA = "bottom 60%";
const RETARDO_DEL_SEGUIMIENTO = 0.45;

type EjeDelProgramaProps = {
  children: ReactNode;
};

export function EjeDelPrograma({ children }: EjeDelProgramaProps) {
  const envolturaRef = useRef<HTMLDivElement | null>(null);
  const cargaRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const envoltura = envolturaRef.current;
    const carga = cargaRef.current;
    if (!envoltura || !carga) {
      return;
    }

    registerGsapPlugins();

    const hitos = [...envoltura.querySelectorAll<HTMLElement>(".pod-hito")];

    if (prefersReducedMotionNow()) {
      gsap.set(carga, { scaleY: 1 });
      for (const hito of hitos) {
        hito.dataset.alcanzado = "si";
      }
      return;
    }

    gsap.set(carga, { scaleY: 0 });

    const encenderLosAlcanzados = () => {
      const escala = Number(gsap.getProperty(carga, "scaleY"));
      const caja = envoltura.getBoundingClientRect();
      const cabezaDeLaCarga = caja.top + caja.height * escala;
      for (const hito of hitos) {
        const alto = hito.getBoundingClientRect().top;
        hito.dataset.alcanzado = alto <= cabezaDeLaCarga ? "si" : "no";
      }
    };

    const avance = gsap.to(carga, {
      scaleY: 1,
      ease: "none",
      onUpdate: encenderLosAlcanzados,
      scrollTrigger: {
        trigger: envoltura,
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
    <div ref={envolturaRef} className="pod-programa">
      <span className="pod-programa__eje" aria-hidden="true">
        <span ref={cargaRef} className="pod-programa__carga" />
      </span>
      <div className="pod-hitos">{children}</div>
    </div>
  );
}
