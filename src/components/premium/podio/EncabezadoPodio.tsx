"use client";

/*
  Encabezado de sección: rótulo, titular y entradilla revelados como una sola pieza.

  Es el gesto tipográfico que Fusion usa en su hero y que aquí faltaba. Podio ya tenía las
  piezas —Reveal para los bloques y RevealText para los titulares—, pero cada una montaba su
  propio ScrollTrigger y disparaba por su cuenta: tres entradas simultáneas que compiten en
  vez de una frase de movimiento. Aquí las tres comparten un timeline y entran encadenadas
  con solapes negativos, de modo que el rótulo abre, el titular lo alcanza antes de que
  termine y la entradilla cierra sobre el final del titular.

  El titular se revela palabra a palabra desde una máscara de línea: SplitText corta en
  líneas y palabras, .cam-line recorta y cada palabra sube desde debajo de su propio renglón.
  Sin la máscara las palabras entrarían pisando la línea de arriba.

  Con movimiento reducido no se divide el texto ni se anima nada: el encabezado queda visible
  tal cual y el titular conserva su nodo de texto intacto para los lectores de pantalla.
*/

import { useEffect, useRef, type ReactNode } from "react";
import {
  gsap,
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

const DESPLAZAMIENTO_DE_ENTRADA_EN_PIXELES = 16;
const ALTURA_DE_PARTIDA_DE_LA_PALABRA_EN_PORCENTAJE = 115;
const DURACION_DEL_ROTULO = 0.7;
const DURACION_DEL_TITULAR = 0.95;
const DURACION_DE_LA_ENTRADILLA = 0.8;
const RETARDO_ENTRE_PALABRAS = 0.05;
const SOLAPE_DEL_TITULAR = "-=0.45";
const SOLAPE_DE_LA_ENTRADILLA = "-=0.6";
const CURVA_DE_SALIDA = "power4.out";
const PUNTO_DE_DISPARO = "top 82%";

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

    const partes: HTMLElement[] = [rotulo, titular, entradillaRef.current].filter(
      (parte) => parte !== null,
    );

    if (prefersReducedMotionNow()) {
      gsap.set(partes, { opacity: 1, y: 0 });
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
    gsap.set([rotulo, entradillaRef.current].filter(Boolean), {
      opacity: 0,
      y: DESPLAZAMIENTO_DE_ENTRADA_EN_PIXELES,
    });

    const linea = gsap.timeline({
      defaults: { ease: CURVA_DE_SALIDA },
      scrollTrigger: { trigger: contenedor, start: PUNTO_DE_DISPARO, once: true },
    });

    linea
      .to(rotulo, { opacity: 1, y: 0, duration: DURACION_DEL_ROTULO })
      .to(
        corte.words,
        {
          yPercent: 0,
          opacity: 1,
          duration: DURACION_DEL_TITULAR,
          stagger: RETARDO_ENTRE_PALABRAS,
        },
        SOLAPE_DEL_TITULAR,
      );

    if (entradillaRef.current) {
      linea.to(
        entradillaRef.current,
        { opacity: 1, y: 0, duration: DURACION_DE_LA_ENTRADILLA },
        SOLAPE_DE_LA_ENTRADILLA,
      );
    }

    return () => {
      linea.scrollTrigger?.kill();
      linea.kill();
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
