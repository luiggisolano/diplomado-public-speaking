"use client";

/*
  Celda de la banda de cifras: el número contado y su unidad, en una sola pieza (nivel T1b
  del contrato visual). Sustituye a StatCounter de premium/camara sin tocarlo, porque aquel
  lo comparten cuatro rutas más.

  El contrato reparte el comportamiento en dos: la celda entra y vuelve a salir si el
  visitante sube —es información de cabecera y se relee—, pero el conteo se ejecuta una
  sola vez. Un contador que descuenta al subir marea y convierte un dato en un juguete, así
  que el tween del número lleva su propio disparador con once y nunca revierte.

  Los cuatro datos escalonan su entrada por índice: el orden de lectura es 160 h, 10
  créditos, 6 módulos, 100 % en línea, y el escalonado lo subraya sin llegar a demorarlo.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type CifraPodioProps = {
  valor: number;
  sufijo?: string;
  etiqueta: string;
  indice: number;
};

const DURACION_DE_LA_ENTRADA = 0.7;
const DESPLAZAMIENTO_VERTICAL = 18;
const RETARDO_ENTRE_CELDAS = 0.06;
const CURVA_DE_LA_ENTRADA = "power3.out";
const PUNTO_DE_DISPARO_DE_LA_CELDA = "top 85%";

const DURACION_DEL_CONTEO = 1.7;
const CURVA_DEL_CONTEO = "power2.out";
const PUNTO_DE_DISPARO_DEL_CONTEO = "top 90%";

export function CifraPodio({ valor, sufijo = "", etiqueta, indice }: CifraPodioProps) {
  const celdaRef = useRef<HTMLDivElement | null>(null);
  const numeroRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const celda = celdaRef.current;
    const numero = numeroRef.current;
    if (!celda || !numero) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(celda, { opacity: 1, y: 0 });
      numero.textContent = String(valor);
      return;
    }

    gsap.set(celda, { opacity: 0, y: DESPLAZAMIENTO_VERTICAL });

    const entradaDeLaCelda = gsap.to(celda, {
      opacity: 1,
      y: 0,
      duration: DURACION_DE_LA_ENTRADA,
      ease: CURVA_DE_LA_ENTRADA,
      delay: indice * RETARDO_ENTRE_CELDAS,
      scrollTrigger: {
        trigger: celda,
        start: PUNTO_DE_DISPARO_DE_LA_CELDA,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    const cuenta = { actual: 0 };
    numero.textContent = "0";

    const conteo = gsap.to(cuenta, {
      actual: valor,
      duration: DURACION_DEL_CONTEO,
      ease: CURVA_DEL_CONTEO,
      onUpdate: () => {
        numero.textContent = String(Math.round(cuenta.actual));
      },
      scrollTrigger: {
        trigger: celda,
        start: PUNTO_DE_DISPARO_DEL_CONTEO,
        once: true,
      },
    });

    return () => {
      entradaDeLaCelda.scrollTrigger?.kill();
      entradaDeLaCelda.kill();
      conteo.scrollTrigger?.kill();
      conteo.kill();
    };
  }, [valor, indice]);

  return (
    <div ref={celdaRef} className="pod-cifra cam-reveal">
      <dd className="pod-cifra__valor mono-num">
        <span ref={numeroRef}>0</span>
        {sufijo}
      </dd>
      <dt className="pod-cifra__etiqueta tech-label">{etiqueta}</dt>
    </div>
  );
}
