"use client";

/*
  Línea de display que se arma pieza a pieza al entrar y se desarma al salir (niveles T1b y
  T1c del contrato visual). Es la animación de letras que la landing pedía: hasta ahora los
  titulares de sección ya se partían con SplitText en EncabezadoPodio, pero la entradilla,
  el giro, la sentencia, los tres remates y las dos líneas del cierre solo hacían fundido de
  bloque, es decir aparecían enteras de golpe.

  No es un mecanismo nuevo: es el patrón de EncabezadoPodio extendido a las demás líneas de
  display. Escribir un segundo sistema de SplitText habría dejado dos motores animando los
  mismos nodos.

  Dos granularidades, y la elección no es de gusto:

    · PALABRAS para la entradilla, el giro, la sentencia y los remates. Son frases de seis a
      catorce palabras a 44 px en caja baja: el escalonado por palabra las lee como frase,
      que es lo que son. Cortarlas por letras daría dos docenas de nodos por línea y se
      leería como truco de plantilla.
    · LETRAS solo en las dos líneas del cierre. Es el único sitio donde se justifica: suman
      83 caracteres y a 0,018 s de escalonado dan una cascada de 1,5 s, que es exactamente
      el peso que pide el último gesto de la página.

  Revierten las dos al subir, a diferencia del cuerpo. Una página de 19.000 px se relee, y
  que la frase se rearme al volver a ella es lo que distingue un capítulo de un bloque que
  ya pasó.

  El envoltorio emite .cam-reveal porque esa clase sostiene el ritmo entre las dos frases
  del cierre (`.pod-cierre__frase > .cam-reveal + .cam-reveal`) además del estado oculto de
  partida. Como aquí quien se anima son las piezas y no el bloque, el envoltorio se sube a
  opacidad 1 en cuanto el corte está hecho.

  Con movimiento reducido no se ejecuta SplitText: el párrafo conserva su nodo de texto
  intacto, que es lo que importa para los lectores de pantalla y para poder seleccionarlo.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type LineaPodioProps = {
  texto: string;
  className: string;
  corte?: "palabras" | "letras";
  peso?: "fuerte";
};

const DESPLAZAMIENTO_DE_LA_PALABRA_EN_PIXELES = 22;
const DURACION_POR_PALABRAS = 0.7;
const RETARDO_ENTRE_PALABRAS = 0.04;
const CURVA_POR_PALABRAS = "power3.out";
const DISPARO_POR_PALABRAS = "top 84%";

const ALTURA_DE_PARTIDA_DE_LA_LETRA_EN_PORCENTAJE = 60;
const DURACION_POR_LETRAS = 0.55;
const RETARDO_ENTRE_LETRAS = 0.018;
const CURVA_POR_LETRAS = "power2.out";
const DISPARO_POR_LETRAS = "top 78%";

/*
  Las piezas del corte reutilizan .cam-word, que ya declara el inline-block y el will-change
  que necesitan para poder desplazarse. Vale igual para palabras y para letras, y evita
  introducir una clase de presentación más en una hoja que ya tiene 1.900 líneas.
*/
const CLASE_DE_LA_PIEZA = "cam-word";

export function LineaPodio({ texto, className, corte = "palabras", peso }: LineaPodioProps) {
  const envoltorioRef = useRef<HTMLDivElement | null>(null);
  const lineaRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const envoltorio = envoltorioRef.current;
    const linea = lineaRef.current;

    if (!envoltorio || !linea) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set([envoltorio, linea], { opacity: 1, y: 0 });
      return;
    }

    const porLetras = corte === "letras";

    const division = new SplitText(linea, {
      type: porLetras ? "chars" : "words",
      charsClass: CLASE_DE_LA_PIEZA,
      wordsClass: CLASE_DE_LA_PIEZA,
    });

    const piezas = porLetras ? division.chars : division.words;

    gsap.set(envoltorio, { opacity: 1 });
    gsap.set(
      piezas,
      porLetras
        ? { opacity: 0, yPercent: ALTURA_DE_PARTIDA_DE_LA_LETRA_EN_PORCENTAJE }
        : { opacity: 0, y: DESPLAZAMIENTO_DE_LA_PALABRA_EN_PIXELES },
    );

    const entrada = gsap.to(piezas, {
      opacity: 1,
      ...(porLetras ? { yPercent: 0 } : { y: 0 }),
      duration: porLetras ? DURACION_POR_LETRAS : DURACION_POR_PALABRAS,
      ease: porLetras ? CURVA_POR_LETRAS : CURVA_POR_PALABRAS,
      stagger: porLetras ? RETARDO_ENTRE_LETRAS : RETARDO_ENTRE_PALABRAS,
      overwrite: "auto",
      scrollTrigger: {
        trigger: envoltorio,
        start: porLetras ? DISPARO_POR_LETRAS : DISPARO_POR_PALABRAS,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    return () => {
      entrada.scrollTrigger?.kill();
      entrada.kill();
      division.revert();
    };
  }, [texto, corte]);

  return (
    <div ref={envoltorioRef} className="cam-reveal">
      <p ref={lineaRef} className={className} data-peso={peso}>
        {texto}
      </p>
    </div>
  );
}
