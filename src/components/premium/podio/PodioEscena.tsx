"use client";

/*
  Escena de apertura de /g/podio: la sección pinneada donde la secuencia de frames avanza
  con el scroll y los capítulos de texto se relevan encima.

  El material es un dolly-in continuo sobre un podio de auditorio: empieza en plano general
  con la sala llena y termina en primer plano del micrófono. Los cuatro capítulos están
  atados a ese recorrido, no repartidos de forma arbitraria: el texto habla de la sala
  mientras se ve la sala, y del micrófono cuando el micrófono ocupa el encuadre. El scroll
  es literalmente el avance del profesional hacia el escenario.

  El progreso lo emite SecuenciaScroll desde el onUpdate de su ScrollTrigger, así hay una
  sola fuente de verdad para "en qué punto del recorrido estamos" y los capítulos no
  necesitan su propio disparador.
*/

import { useCallback, useRef, useState } from "react";
import { SecuenciaScroll } from "./SecuenciaScroll";

/*
  Cada capítulo ocupa un tercio del recorrido y no muestra más que su frase: sin numeración
  ni rótulo, el texto entra y sale sobre el metraje como un intertítulo. El titular se declara
  como lista de líneas en vez de como cadena única por si alguna frase pide un corte de verso
  que el reajuste automático haría por donde cupiera y no por donde respira.

  Los tres se componen en los mismos dos registros, uno espaciado y otro de display, pero el
  reparto lo decide dónde cae el golpe de cada frase: la primera lo tiene al principio («el
  mejor») y la segunda al final («nadie lo notará»), así que van en espejo. «destacado»
  reserva el peso fuerte para el capítulo que revela el nombre del programa, que es el único
  que anuncia el producto en toda la secuencia.
*/
type Capitulo = {
  clave: string;
  inicio: number;
  fin: number;
  antetitulo?: string;
  lineas: readonly string[];
  subtitulo?: string;
  bajada?: string;
  destacado?: boolean;
};

const CAPITULOS: readonly Capitulo[] = [
  {
    clave: "sala",
    inicio: 0,
    fin: 0.34,
    lineas: ["Puedes ser el mejor"],
    subtitulo: "En lo que haces",
  },
  {
    clave: "avance",
    inicio: 0.34,
    fin: 0.67,
    antetitulo: "Si no sabes comunicarlo",
    lineas: ["Nadie lo notará"],
  },
  {
    clave: "escenario",
    inicio: 0.67,
    fin: 1.01,
    antetitulo: "Diplomado en",
    lineas: ["Public Speaking"],
    subtitulo: "Comunicación Persuasiva de Alto Impacto",
    bajada:
      "Una formación universitaria diseñada para profesionales que entendieron que su voz pública es parte de su trabajo",
    destacado: true,
  },
];

const PROGRESO_INICIAL = 0;

/*
  Umbral a partir del cual se considera que el visitante ya empezó a recorrer la secuencia.
  Por encima de él la portada de apertura se retira: ha cumplido su función de invitar.
*/
const PROGRESO_QUE_RETIRA_LA_PORTADA = 0.01;

/*
  Punto en que el recorrido se da por terminado y la sección lo publica en el DOM para quien
  quiera reaccionar; hoy, la barra de navegación, que no existe hasta que la secuencia acaba.
  No es 1 exacto porque el scrub llega al final con un resto de suavizado y el último tramo
  ya no cambia de encuadre: esperar al valor exacto retrasaría la barra sin motivo visible.
*/
const PROGRESO_QUE_DA_EL_RECORRIDO_POR_TERMINADO = 0.985;

function localizarCapituloActivo(progreso: number): number {
  const encontrado = CAPITULOS.findIndex(
    (capitulo) => progreso >= capitulo.inicio && progreso < capitulo.fin,
  );
  return encontrado === -1 ? CAPITULOS.length - 1 : encontrado;
}

export function PodioEscena() {
  const seccionRef = useRef<HTMLElement | null>(null);
  const [progresoDelRecorrido, setProgresoDelRecorrido] = useState(PROGRESO_INICIAL);

  const registrarProgreso = useCallback((progreso: number) => {
    setProgresoDelRecorrido(progreso);
  }, []);

  const indiceActivo = localizarCapituloActivo(progresoDelRecorrido);
  const laPortadaSigueVisible = progresoDelRecorrido <= PROGRESO_QUE_RETIRA_LA_PORTADA;

  return (
    <section
      ref={seccionRef}
      className="pod-secuencia"
      data-iniciado={laPortadaSigueVisible ? undefined : "true"}
      data-recorrido-terminado={
        progresoDelRecorrido >= PROGRESO_QUE_DA_EL_RECORRIDO_POR_TERMINADO ? "true" : undefined
      }
      aria-labelledby="pod-secuencia-titulo"
    >
      <h2 id="pod-secuencia-titulo" className="sr-only">
        Del fondo de la sala al micrófono: el recorrido del Diplomado en Public Speaking
      </h2>

      <SecuenciaScroll seccionRef={seccionRef} onProgreso={registrarProgreso} />

      <div className="pod-secuencia__velo" aria-hidden="true" />

      {/*
        Portada de apertura. Mientras la secuencia precarga sus frames, el fondo se mantiene
        macizo y solo se ve el sello institucional; en cuanto SecuenciaScroll marca la sección
        como lista, ese fondo se retira y el auditorio aparece detrás del logo. La invitación a
        deslizar permanece hasta que el recorrido arranca de verdad.
      */}
      <div className="pod-portada" aria-hidden={laPortadaSigueVisible ? undefined : "true"}>
        <div className="pod-portada__fondo" />
        <div className="pod-portada__marca">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-utmach.png"
            alt="Universidad Técnica de Machala"
            className="pod-portada__logo"
            width={300}
            height={300}
            fetchPriority="high"
          />
          {/*
            Bloque de firma institucional bajo el escudo: el nombre se parte en dos registros,
            el genérico espaciado sobre la sede en serif, y el aval cierra bajo un filete. Es
            el mismo lockup con el que la universidad firma sus certificados.
          */}
          <p className="pod-portada__institucion tech-label">Universidad Técnica</p>
          <p className="pod-portada__sede font-serif">De Machala</p>
          <p className="pod-portada__aval tech-label">Certificación universitaria avalada</p>
        </div>

        <div className="pod-portada__invitacion">
          <svg
            className="pod-portada__flecha"
            width="26"
            height="42"
            viewBox="0 0 26 42"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13 2v34M4 27l9 9 9-9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="pod-portada__indicacion tech-label">Desliza hacia abajo</p>
        </div>
      </div>

      <div className="pod-secuencia__contenido">
        <div className="pod-secuencia__capitulos">
          {CAPITULOS.map((capitulo, indice) => (
            <article
              key={capitulo.clave}
              className="pod-capitulo"
              data-activo={indice === indiceActivo ? "true" : undefined}
              data-destacado={capitulo.destacado ? "true" : undefined}
              aria-hidden={indice === indiceActivo ? undefined : "true"}
            >
              {capitulo.antetitulo ? (
                <p className="pod-capitulo__antetitulo tech-label">{capitulo.antetitulo}</p>
              ) : null}
              <p className="pod-capitulo__titulo font-serif">
                {capitulo.lineas.map((linea) => (
                  <span key={linea} className="pod-capitulo__linea">
                    {linea}
                  </span>
                ))}
              </p>
              {capitulo.subtitulo ? (
                <p className="pod-capitulo__subtitulo tech-label">{capitulo.subtitulo}</p>
              ) : null}
              {capitulo.bajada ? (
                <p className="pod-capitulo__bajada">{capitulo.bajada}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {/*
        El pie conserva solo la barra de progreso. La invitación a desplazarse vive ahora en la
        portada, centrada y con flecha, y repetirla aquí abajo sería decir dos veces lo mismo en
        la misma pantalla.
      */}
      <div className="pod-secuencia__pie">
        <div className="pod-progreso" role="presentation">
          <div
            className="pod-progreso__barra"
            style={{ transform: `scaleX(${progresoDelRecorrido})` }}
          />
        </div>
      </div>
    </section>
  );
}
