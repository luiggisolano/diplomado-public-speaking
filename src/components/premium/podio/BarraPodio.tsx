"use client";

/*
  Barra de navegación de la landing. No existe mientras dura la secuencia de apertura: el
  recorrido pinneado es una pieza de cine de cuatro pantallas con sus intertítulos, y una
  barra fija encima le quitaría el encuadre. Entra cuando el recorrido termina y a partir de
  ahí acompaña todo el scroll.

  El disparo lee dos señales de la sección de apertura, y basta con que una diga que ya pasó:

    · data-recorrido-terminado, que PodioEscena publica al llegar el progreso al final. Es la
      señal precisa, la que hace que la barra entre en el instante en que acaba el recorrido.
    · Que la sección haya dejado el viewport. Llega una pantalla más tarde, porque con
      pinSpacing la sección sigue ocupando su hueco después de soltarse del pin, pero cubre
      el caso de movimiento reducido, donde no hay ScrollTrigger, el progreso nunca sube de
      cero y la primera señal no llega nunca.

  Se lee del DOM y no por props porque quien compone la página es un Server Component y no
  puede sostener el estado que haría de puente entre las dos piezas.

  La marca se reduce aquí a una línea. El lockup de tres registros es el remate del tercer
  capítulo, lo que el scroll tarda cuatro pantallas en revelar, y repetirlo entero arriba lo
  quemaría antes de que llegue.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { SHARED_CONTACT } from "@/lib/variants-content";

const SELECTOR_DE_LA_SECUENCIA_DE_APERTURA = ".pod-secuencia";
const ATRIBUTO_DE_RECORRIDO_TERMINADO = "data-recorrido-terminado";

/*
  Cinco destinos, no las once secciones de la página. El resto son de recorrido: se leen de
  paso, nadie las busca. Estas son a las que un interesado vuelve.
*/
const DESTINOS = [
  { ancla: "#programa", texto: "Programa" },
  { ancla: "#docentes", texto: "Docentes" },
  { ancla: "#metodo", texto: "Método" },
  { ancla: "#inversion", texto: "Inversión" },
  { ancla: "#preguntas", texto: "Preguntas" },
] as const;

const TECLA_QUE_CIERRA_EL_DESPLIEGUE = "Escape";

export function BarraPodio() {
  const [laBarraEstaVisible, setLaBarraEstaVisible] = useState(false);
  const [elMenuEstaDesplegado, setElMenuEstaDesplegado] = useState(false);
  const botonDelMenuRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const seccionDeApertura = document.querySelector(
      SELECTOR_DE_LA_SECUENCIA_DE_APERTURA,
    );

    if (!seccionDeApertura) {
      setLaBarraEstaVisible(true);
      return;
    }

    let elRecorridoTermino = seccionDeApertura.hasAttribute(
      ATRIBUTO_DE_RECORRIDO_TERMINADO,
    );
    let laAperturaDejoLaPantalla = false;

    const resolverVisibilidad = () =>
      setLaBarraEstaVisible(elRecorridoTermino || laAperturaDejoLaPantalla);

    const vigilanteDelProgreso = new MutationObserver(() => {
      elRecorridoTermino = seccionDeApertura.hasAttribute(
        ATRIBUTO_DE_RECORRIDO_TERMINADO,
      );
      resolverVisibilidad();
    });

    const vigilanteDeEncuadre = new IntersectionObserver(
      ([entrada]) => {
        laAperturaDejoLaPantalla = !entrada.isIntersecting;
        resolverVisibilidad();
      },
      { threshold: 0 },
    );

    vigilanteDelProgreso.observe(seccionDeApertura, {
      attributes: true,
      attributeFilter: [ATRIBUTO_DE_RECORRIDO_TERMINADO],
    });
    vigilanteDeEncuadre.observe(seccionDeApertura);
    resolverVisibilidad();

    return () => {
      vigilanteDelProgreso.disconnect();
      vigilanteDeEncuadre.disconnect();
    };
  }, []);

  /*
    Al replegarse la barra el menú desaparece con ella, así que su estado tiene que volver a
    cerrado: si no, al reaparecer lo haría con el panel abierto y sin que nadie lo pidiera.
  */
  useEffect(() => {
    if (!laBarraEstaVisible) {
      setElMenuEstaDesplegado(false);
    }
  }, [laBarraEstaVisible]);

  useEffect(() => {
    if (!elMenuEstaDesplegado) {
      return;
    }

    const atenderTecla = (evento: KeyboardEvent) => {
      if (evento.key === TECLA_QUE_CIERRA_EL_DESPLIEGUE) {
        setElMenuEstaDesplegado(false);
        botonDelMenuRef.current?.focus();
      }
    };

    window.addEventListener("keydown", atenderTecla);
    return () => window.removeEventListener("keydown", atenderTecla);
  }, [elMenuEstaDesplegado]);

  const cerrarElMenu = useCallback(() => setElMenuEstaDesplegado(false), []);

  return (
    <header
      className="pod-barra"
      data-visible={laBarraEstaVisible ? "true" : undefined}
      data-desplegado={elMenuEstaDesplegado ? "true" : undefined}
    >
      <a className="pod-barra__marca" href="#inicio" onClick={cerrarElMenu}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-utmach.png"
          alt=""
          className="pod-barra__isotipo"
          width={120}
          height={120}
          aria-hidden="true"
        />
        <span className="pod-barra__nombre font-serif">Public Speaking</span>
      </a>

      <nav className="pod-barra__navegacion" aria-label="Secciones del diplomado">
        <ul className="pod-barra__lista" id="pod-barra-destinos">
          {DESTINOS.map((destino) => (
            <li key={destino.ancla}>
              <a
                className="pod-barra__enlace tech-label"
                href={destino.ancla}
                onClick={cerrarElMenu}
              >
                {destino.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a
        className="pod-barra__cta tech-label"
        href={SHARED_CONTACT.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={cerrarElMenu}
      >
        Inscríbete
      </a>

      <button
        ref={botonDelMenuRef}
        type="button"
        className="pod-barra__conmutador"
        aria-expanded={elMenuEstaDesplegado}
        aria-controls="pod-barra-destinos"
        onClick={() => setElMenuEstaDesplegado((desplegado) => !desplegado)}
      >
        <span className="sr-only">
          {elMenuEstaDesplegado ? "Cerrar el menú de secciones" : "Abrir el menú de secciones"}
        </span>
        <span className="pod-barra__trazo pod-barra__trazo--alto" aria-hidden="true" />
        <span className="pod-barra__trazo pod-barra__trazo--bajo" aria-hidden="true" />
      </button>
    </header>
  );
}
