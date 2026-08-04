"use client";

/*
  Encabezado de sección: rótulo, titular y entradilla. Es el gesto que marca capítulo en el
  cuerpo de la página, y el contrato visual lo reparte en dos regímenes distintos.

  El rótulo y el titular son nivel T1: entran encadenados y vuelven a salir si el visitante
  sube. Una página de 19.000 px se relee, y que el titular se rearme al volver a él es lo
  que distingue un capítulo de un bloque que ya pasó. El titular se revela palabra a palabra
  desde una máscara de línea: SplitText corta en líneas y palabras, .cam-line recorta y cada
  palabra sube desde debajo de su propio renglón. Sin la máscara las palabras entrarían
  pisando la línea de arriba.

  La entradilla es nivel T2 y por eso no comparte el timeline: el cuerpo entra una sola vez
  y no revierte. Reproducir 57 bloques de cuerpo en cada dirección se lee como nerviosismo y
  estorba justamente la relectura que la reversión del titular busca facilitar. Se conserva
  el encadenado con un retardo, no con un solape de timeline.

  Con movimiento reducido no se divide el texto ni se anima nada: el encabezado queda visible
  tal cual y el titular conserva su nodo de texto intacto para los lectores de pantalla.
*/

import { useEffect, useRef, type ReactNode } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type EncabezadoPodioProps = {
  eyebrow: string;
  titulo: string;
  entrada?: ReactNode;
  id?: string;
  className?: string;
};

const DESPLAZAMIENTO_DEL_ROTULO_EN_PIXELES = 14;
const DESPLAZAMIENTO_DE_LA_ENTRADILLA_EN_PIXELES = 12;
const ALTURA_DE_PARTIDA_DE_LA_PALABRA_EN_PORCENTAJE = 108;
const DURACION_DEL_ROTULO = 0.6;
const DURACION_DEL_TITULAR = 0.8;
const DURACION_DE_LA_ENTRADILLA = 0.55;
const RETARDO_ENTRE_PALABRAS = 0.045;
const SOLAPE_DEL_TITULAR = "-=0.35";
const RETARDO_DE_LA_ENTRADILLA = 0.35;
const CURVA_DEL_TITULAR = "power4.out";
const CURVA_DE_LA_ENTRADILLA = "power2.out";
const PUNTO_DE_DISPARO_DEL_TITULAR = "top 80%";
const PUNTO_DE_DISPARO_DE_LA_ENTRADILLA = "top 88%";

/*
  Sin esto, la barra de direcciones que aparece y desaparece en los navegadores móviles
  cuenta como cambio de alto de ventana y obliga a ScrollTrigger a recalcular en mitad de
  una reversión, que es cuando un titular puede quedarse con palabras a medio camino.
*/
let laConfiguracionDeScrollTriggerEstaAplicada = false;

function configurarScrollTriggerUnaSolaVez(): void {
  if (laConfiguracionDeScrollTriggerEstaAplicada) {
    return;
  }
  ScrollTrigger.config({ ignoreMobileResize: true });
  laConfiguracionDeScrollTriggerEstaAplicada = true;
}

export function EncabezadoPodio({
  eyebrow,
  titulo,
  entrada,
  id,
  className,
}: EncabezadoPodioProps) {
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const rotuloRef = useRef<HTMLParagraphElement | null>(null);
  const titularRef = useRef<HTMLHeadingElement | null>(null);
  const entradillaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const contenedor = contenedorRef.current;
    const rotulo = rotuloRef.current;
    const titular = titularRef.current;

    if (!contenedor || !rotulo || !titular) {
      return;
    }

    registerGsapPlugins();
    configurarScrollTriggerUnaSolaVez();

    const entradilla = entradillaRef.current;

    if (prefersReducedMotionNow()) {
      gsap.set([rotulo, titular, entradilla].filter(Boolean), { opacity: 1, y: 0 });
      return;
    }

    const corte = new SplitText(titular, {
      type: "lines,words",
      linesClass: "cam-line",
      wordsClass: "cam-word",
    });

    gsap.set(titular, { opacity: 1 });
    gsap.set(corte.words, {
      yPercent: ALTURA_DE_PARTIDA_DE_LA_PALABRA_EN_PORCENTAJE,
      opacity: 0,
    });
    gsap.set(rotulo, { opacity: 0, y: DESPLAZAMIENTO_DEL_ROTULO_EN_PIXELES });

    const lineaDelTitular = gsap.timeline({
      defaults: { ease: CURVA_DEL_TITULAR },
      scrollTrigger: {
        trigger: contenedor,
        start: PUNTO_DE_DISPARO_DEL_TITULAR,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    lineaDelTitular
      .to(rotulo, { opacity: 1, y: 0, duration: DURACION_DEL_ROTULO })
      .to(
        corte.words,
        {
          yPercent: 0,
          opacity: 1,
          duration: DURACION_DEL_TITULAR,
          stagger: RETARDO_ENTRE_PALABRAS,
          overwrite: "auto",
        },
        SOLAPE_DEL_TITULAR,
      );

    let entradaDeLaEntradilla: gsap.core.Tween | null = null;

    if (entradilla) {
      gsap.set(entradilla, {
        opacity: 0,
        y: DESPLAZAMIENTO_DE_LA_ENTRADILLA_EN_PIXELES,
      });

      entradaDeLaEntradilla = gsap.to(entradilla, {
        opacity: 1,
        y: 0,
        duration: DURACION_DE_LA_ENTRADILLA,
        ease: CURVA_DE_LA_ENTRADILLA,
        delay: RETARDO_DE_LA_ENTRADILLA,
        scrollTrigger: {
          trigger: contenedor,
          start: PUNTO_DE_DISPARO_DE_LA_ENTRADILLA,
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }

    return () => {
      lineaDelTitular.scrollTrigger?.kill();
      lineaDelTitular.kill();
      entradaDeLaEntradilla?.scrollTrigger?.kill();
      entradaDeLaEntradilla?.kill();
      corte.revert();
    };
  }, [eyebrow, titulo]);

  return (
    <div
      ref={contenedorRef}
      className={`pod-encabezado ${className ?? ""}`.trim()}
    >
      <p ref={rotuloRef} className="pod-encabezado__rotulo tech-label">
        {eyebrow}
      </p>
      <h2 ref={titularRef} id={id} className="pod-encabezado__titulo font-serif">
        {titulo}
      </h2>
      {entrada ? (
        <div ref={entradillaRef} className="pod-encabezado__entrada">
          {entrada}
        </div>
      ) : null}
    </div>
  );
}
