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

const CAPITULOS = [
  {
    clave: "sala",
    indice: "01",
    etiqueta: "La sala",
    inicio: 0,
    fin: 0.27,
    titulo: "Eres el mejor en lo que haces.",
    acento: "Si no sabes comunicarlo, nadie lo nota.",
  },
  {
    clave: "avance",
    indice: "02",
    etiqueta: "El avance",
    inicio: 0.27,
    fin: 0.54,
    titulo: "Que tu palabra pese",
    acento: "tanto como lo que sabes.",
  },
  {
    clave: "escenario",
    indice: "03",
    etiqueta: "El escenario",
    inicio: 0.54,
    fin: 0.8,
    titulo: "Seis disciplinas, seis especialistas,",
    acento: "una sola formación.",
  },
  {
    clave: "micro",
    indice: "04",
    etiqueta: "El micrófono",
    inicio: 0.8,
    fin: 1.01,
    titulo: "El micrófono está encendido.",
    acento: "Te toca hablar.",
  },
] as const;

const PROGRESO_INICIAL = 0;

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

  return (
    <section ref={seccionRef} className="pod-secuencia" aria-labelledby="pod-secuencia-titulo">
      <h2 id="pod-secuencia-titulo" className="sr-only">
        Del fondo de la sala al micrófono: el recorrido del Diplomado en Public Speaking
      </h2>

      <SecuenciaScroll seccionRef={seccionRef} onProgreso={registrarProgreso} />

      <div className="pod-secuencia__velo" aria-hidden="true" />

      <div className="pod-secuencia__contenido">
        <p className="pod-secuencia__kicker tech-label">
          Diplomado Universitario · 160 h · 100 % en línea
        </p>

        <div className="pod-secuencia__capitulos">
          {CAPITULOS.map((capitulo, indice) => (
            <article
              key={capitulo.clave}
              className="pod-capitulo"
              data-activo={indice === indiceActivo ? "true" : undefined}
              aria-hidden={indice === indiceActivo ? undefined : "true"}
            >
              <p className="pod-capitulo__indice mono-num">
                {capitulo.indice} <span className="pod-capitulo__etiqueta">{capitulo.etiqueta}</span>
              </p>
              <p className="pod-capitulo__titulo font-serif">
                {capitulo.titulo}{" "}
                <span className="pod-capitulo__acento">{capitulo.acento}</span>
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="pod-secuencia__pie">
        <div className="pod-progreso" role="presentation">
          <div
            className="pod-progreso__barra"
            style={{ transform: `scaleX(${progresoDelRecorrido})` }}
          />
        </div>
        <p className="pod-secuencia__indicacion tech-label" data-oculto={progresoDelRecorrido > 0.04 ? "true" : undefined}>
          Desplaza para avanzar
        </p>
      </div>
    </section>
  );
}
