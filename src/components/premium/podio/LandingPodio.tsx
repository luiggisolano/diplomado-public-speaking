/*
  Composición de la landing definitiva del Diplomado en Public Speaking y Comunicación
  Persuasiva del Centro de Educación Continua UTMACH.

  Vive en un componente y no directamente en un page.tsx porque la sirven dos rutas: «/»,
  que es la canónica e indexable desde que esta versión sustituyó a la v1 Aula Futura, y
  «/g/podio», que quedó como ruta heredada con noindex y canonical hacia la raíz.

  El contenido y el repertorio de movimiento vienen de /g/fusion, que los había reunido
  durante la exploración: las doce secciones de copy y las cuatro piezas de motion. Lo que
  NO se trae es su capa de presentación. Fusion se monta sobre camara.css con clases cam-*
  y fus-*, mientras esta ruta es autónoma sobre podio.css con tokens propios, de modo que el
  markup está rehecho en clases pod-* y conserva el velo calibrado, los halos de texto sobre
  imagen y la tipografía del díptico que se ajustaron aquí. Tampoco se trae el fondo de nube
  WebGL de fusion: la identidad de esta landing es la secuencia de frames, y superponer las
  dos capas competiría por la misma atención.

  Las cuatro piezas de motion sí se importan en lugar de duplicarse, porque son movimiento
  puro sin presentación propia: solo dependen de las clases de estado inicial .cam-reveal,
  .cam-line y .cam-word, declaradas en podio.css junto a las demás. El acordeón de preguntas
  es la excepción y se rehizo en FaqPodio, porque su markup sí traía clases de Cámara.

  Server Component: el canvas, la precarga de frames, el pinning y el motion viven en los
  componentes cliente. Copy íntegro desde lib/variants-content (fuente única) y tipografía
  desde lib/fonts-diptico, montada sobre .pod-root para no alcanzar el layout raíz.
*/

import "./podio.css";

import { SmoothScroll } from "@/components/premium/_shared/SmoothScroll";
import { BarraPodio } from "@/components/premium/podio/BarraPodio";
import { PodioEscena } from "@/components/premium/podio/PodioEscena";
import { FaqPodio } from "@/components/premium/podio/FaqPodio";
import { EncabezadoPodio } from "@/components/premium/podio/EncabezadoPodio";
import { Reveal } from "@/components/premium/camara/Reveal";
import { StatCounter } from "@/components/premium/camara/StatCounter";
import { ModuleSlide } from "@/components/premium/fusion/ModuleSlide";
import { CLASES_TIPOGRAFIA_DIPTICO } from "@/lib/fonts-diptico";
import { SHARED_CONTACT } from "@/lib/variants-content";
import {
  PODIO_AGITACION,
  PODIO_AVAL,
  PODIO_CIERRE,
  PODIO_CIFRAS,
  PODIO_FICHA,
  PODIO_MAPA,
  PODIO_METODO,
  PODIO_MODULOS,
  PODIO_PREGUNTAS,
  PODIO_PUBLICO,
  PODIO_SOLUCION,
  PODIO_TRANSFORMACION,
  PODIO_URGENCIA,
} from "@/lib/podio-content";

/*
  Las portadas son los seis iconos neón del material oficial, ya optimizados a webp para
  /g/fusion. Se consumen desde su ruta original en lugar de duplicar los archivos.
*/
const RUTA_PORTADAS_MODULOS = "/fusion/modulos";

/*
  Placeholders temáticos hasta que el cliente entregue los seis nombres, credenciales y
  fotografías. Se rotulan «Nombre por confirmar» de forma explícita: no se inventan personas
  reales, y la disciplina de cada tarjeta sí corresponde al módulo que la imparte.
*/
const ESPECIALISTAS = [
  { modulo: "01", disciplina: "Psicología del orador", credencial: "Especialista en psicología de la comunicación" },
  { modulo: "02", disciplina: "Retórica y persuasión", credencial: "Especialista en retórica y argumentación" },
  { modulo: "03", disciplina: "Técnica vocal", credencial: "Especialista en técnica y salud vocal" },
  { modulo: "04", disciplina: "Performance y escena", credencial: "Especialista en expresión escénica" },
  { modulo: "05", disciplina: "Imagen y semiótica", credencial: "Especialista en imagen y comunicación no verbal" },
  { modulo: "06", disciplina: "Oratoria de liderazgo", credencial: "Especialista en liderazgo y oratoria ejecutiva" },
] as const;

const NOMBRE_ESPECIALISTA_PENDIENTE = "Nombre por confirmar";
const RETARDO_ENTRE_TARJETAS = 0.04;

/*
  Aire que Lenis deja sobre el destino al saltar a un ancla, para que la barra no tape el
  título al aterrizar. Es la altura de la barra en escritorio más un margen; en móvil, donde
  la barra es más baja, ese margen se lee simplemente como más respiro.
*/
const DESPLAZAMIENTO_BAJO_LA_BARRA = 24;

function numeroOrdinal(indice: number): string {
  return String(indice + 1).padStart(2, "0");
}

export function LandingPodio() {
  return (
    <SmoothScroll anchorOffset={DESPLAZAMIENTO_BAJO_LA_BARRA}>
      <div className={`pod-root ${CLASES_TIPOGRAFIA_DIPTICO}`}>
        <BarraPodio />
        <main id="inicio">
          <PodioEscena />

          <section className="pod-seccion pod-seccion--cifras" aria-label="Datos del diplomado">
            <dl className="pod-cifras">
              {PODIO_CIFRAS.map((cifra) => (
                <div key={cifra.etiqueta} className="pod-cifra">
                  <dd className="pod-cifra__valor mono-num">
                    <StatCounter value={cifra.valor} suffix={cifra.sufijo} />
                  </dd>
                  <dt className="pod-cifra__etiqueta tech-label">{cifra.etiqueta}</dt>
                </div>
              ))}
            </dl>

            <Reveal delay={0.1}>
              <p className="pod-aval tech-label">
                <span className="pod-aval__rotulo">{PODIO_AVAL.rotulo}</span>
                {PODIO_AVAL.sellos.map((sello) => (
                  <span key={sello} className="pod-aval__sello">
                    {sello}
                  </span>
                ))}
              </p>
            </Reveal>
          </section>

          <section
            className="pod-seccion"
            aria-labelledby="pod-agitacion"
          >
            <EncabezadoPodio
              id="pod-agitacion"
              eyebrow={PODIO_AGITACION.eyebrow}
              titulo={PODIO_AGITACION.titulo}
              entrada={
                <>
                  <p className="pod-seccion__entrada">{PODIO_AGITACION.entrada}</p>
                  <p className="pod-seccion__cuerpo">{PODIO_AGITACION.cuerpo}</p>
                </>
              }
            />

            <Reveal delay={0.05}>
              <p className="pod-seccion__giro font-serif">{PODIO_AGITACION.giro}</p>
              <p className="pod-seccion__sentencia font-serif">{PODIO_AGITACION.sentencia}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="pod-rotulo-lista tech-label">{PODIO_AGITACION.rotuloSintomas}</p>
            </Reveal>

            <ul className="pod-sintomas">
              {PODIO_AGITACION.sintomas.map((sintoma, indice) => (
                <Reveal key={sintoma} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <li className="pod-sintoma">{sintoma}</li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.05}>
              <p className="pod-remate font-serif">{PODIO_AGITACION.remate}</p>
            </Reveal>
          </section>

          <section
            className="pod-seccion pod-seccion--alterna"
            aria-labelledby="pod-solucion"
          >
            <EncabezadoPodio
              id="pod-solucion"
              eyebrow={PODIO_SOLUCION.eyebrow}
              titulo={PODIO_SOLUCION.titulo}
              entrada={PODIO_SOLUCION.cuerpo.map((parrafo) => (
                <p key={parrafo} className="pod-seccion__cuerpo">
                  {parrafo}
                </p>
              ))}
            />

            <Reveal delay={0.05}>
              <p className="pod-rotulo-lista tech-label">{PODIO_SOLUCION.rotuloDiferencia}</p>
            </Reveal>

            <div className="pod-rejilla-pilares">
              {PODIO_SOLUCION.diferenciales.map((diferencial, indice) => (
                <Reveal key={diferencial.titulo} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{diferencial.titulo}</h3>
                    <p className="pod-pilar__linea">{diferencial.linea}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-mapa">
            <EncabezadoPodio
              id="pod-mapa"
              eyebrow={PODIO_MAPA.eyebrow}
              titulo={PODIO_MAPA.titulo}
              entrada={<p className="pod-seccion__cuerpo">{PODIO_MAPA.entrada}</p>}
            />

            <Reveal delay={0.05}>
              <p className="pod-rotulo-lista tech-label">{PODIO_MAPA.rotulo}</p>
            </Reveal>

            <div className="pod-rejilla-dimensiones">
              {PODIO_MAPA.dimensiones.map((dimension, indice) => (
                <Reveal key={dimension.titulo} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-dimension">
                    <p className="pod-dimension__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-dimension__titulo font-serif">{dimension.titulo}</h3>
                    <p className="pod-dimension__linea">{dimension.linea}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.05}>
              <p className="pod-remate font-serif">{PODIO_MAPA.remate}</p>
            </Reveal>
          </section>

          <section
            className="pod-seccion pod-seccion--alterna pod-seccion--destino"
            id="programa"
            aria-labelledby="pod-modulos"
          >
            <EncabezadoPodio
              id="pod-modulos"
              eyebrow={PODIO_MODULOS.eyebrow}
              titulo={PODIO_MODULOS.titulo}
            />

            <div className="pod-rejilla-modulos">
              {PODIO_MODULOS.modulos.map((modulo, indice) => (
                <ModuleSlide key={modulo.n} index={indice}>
                  <article className="pod-modulo">
                    <div className="pod-modulo__portada">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${RUTA_PORTADAS_MODULOS}/${indice + 1}.webp`}
                        alt={`Portada del módulo ${modulo.n} · ${modulo.titulo}`}
                        className="pod-modulo__imagen"
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={675}
                      />
                    </div>
                    <div className="pod-modulo__cuerpo">
                      <p className="pod-modulo__numero mono-num">{modulo.n}</p>
                      <h3 className="pod-modulo__titulo">{modulo.titulo}</h3>
                      <p className="pod-modulo__promesa font-serif">{modulo.promesa}</p>
                      <p className="pod-modulo__linea">{modulo.cuerpo}</p>
                      <p className="pod-modulo__resultado">
                        <span className="pod-modulo__resultado-rotulo tech-label">Resultado</span>
                        {modulo.resultado}
                      </p>
                    </div>
                  </article>
                </ModuleSlide>
              ))}
            </div>
          </section>

          <section
            className="pod-seccion pod-seccion--destino"
            id="docentes"
            aria-labelledby="pod-especialistas"
          >
            <EncabezadoPodio
              id="pod-especialistas"
              eyebrow="Quién te forma"
              titulo="Seis especialistas, una sola formación."
              entrada={
                <p className="pod-seccion__cuerpo">
                  Cada disciplina la imparte quien la ejerce. No es teoría genérica: el
                  especialista que te enseña vive de lo que enseña.
                </p>
              }
            />

            <div className="pod-rejilla-especialistas">
              {ESPECIALISTAS.map((especialista, indice) => (
                <Reveal key={especialista.modulo} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-especialista">
                    <div className="pod-especialista__retrato" aria-hidden="true">
                      <span className="pod-especialista__numero mono-num">{especialista.modulo}</span>
                    </div>
                    <div className="pod-especialista__cuerpo">
                      <p className="pod-especialista__modulo tech-label">
                        Módulo {especialista.modulo}
                      </p>
                      <h3 className="pod-especialista__nombre font-serif">
                        {NOMBRE_ESPECIALISTA_PENDIENTE}
                      </h3>
                      <p className="pod-especialista__disciplina tech-label">
                        {especialista.disciplina}
                      </p>
                      <p className="pod-especialista__credencial">{especialista.credencial}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-publico">
            <EncabezadoPodio
              id="pod-publico"
              eyebrow={PODIO_PUBLICO.eyebrow}
              titulo={PODIO_PUBLICO.titulo}
            />

            <div className="pod-rejilla-perfiles">
              {PODIO_PUBLICO.perfiles.map((perfil, indice) => (
                <Reveal key={perfil.titulo} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-perfil">
                    <h3 className="pod-perfil__titulo font-serif">{perfil.titulo}</h3>
                    <p className="pod-perfil__linea">{perfil.linea}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-transformacion">
            <EncabezadoPodio
              id="pod-transformacion"
              eyebrow={PODIO_TRANSFORMACION.eyebrow}
              titulo={PODIO_TRANSFORMACION.titulo}
            />

            <div className="pod-balanza">
              {[PODIO_TRANSFORMACION.antes, PODIO_TRANSFORMACION.despues].map((lado, indice) => (
                <Reveal key={lado.rotulo} delay={indice * 0.08}>
                  <div
                    className="pod-balanza__lado"
                    data-tono={indice === 0 ? "antes" : "despues"}
                  >
                    <p className="pod-balanza__rotulo tech-label">{lado.rotulo}</p>
                    <ul className="pod-balanza__lista">
                      {lado.puntos.map((punto) => (
                        <li key={punto} className="pod-balanza__punto">
                          {punto}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.05}>
              <p className="pod-remate font-serif">{PODIO_TRANSFORMACION.remate}</p>
            </Reveal>
          </section>

          <section
            className="pod-seccion pod-seccion--alterna pod-seccion--destino"
            id="metodo"
            aria-labelledby="pod-metodo"
          >
            <EncabezadoPodio
              id="pod-metodo"
              eyebrow={PODIO_METODO.eyebrow}
              titulo={PODIO_METODO.titulo}
              entrada={<p className="pod-seccion__cuerpo">{PODIO_METODO.entrada}</p>}
            />

            <div className="pod-rejilla-pilares">
              {PODIO_METODO.pilares.map((pilar, indice) => (
                <Reveal key={pilar.titulo} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{pilar.titulo}</h3>
                    <p className="pod-pilar__linea">{pilar.linea}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section
            className="pod-seccion pod-seccion--destino"
            id="inversion"
            aria-labelledby="pod-datos"
          >
            <div className="pod-columnas">
              <EncabezadoPodio
                id="pod-datos"
                eyebrow={PODIO_FICHA.eyebrow}
                titulo={PODIO_FICHA.titulo}
              />
              <Reveal>
                <dl className="pod-datos">
                  {PODIO_FICHA.datos.map((dato) => (
                    <div key={dato.etiqueta} className="pod-dato">
                      <dt className="pod-dato__etiqueta tech-label">{dato.etiqueta}</dt>
                      <dd className="pod-dato__valor mono-num">{dato.valor}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </section>

          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-urgencia">
            <EncabezadoPodio
              id="pod-urgencia"
              eyebrow={PODIO_URGENCIA.eyebrow}
              titulo={PODIO_URGENCIA.titulo}
            />

            <div className="pod-rejilla-pilares">
              {PODIO_URGENCIA.razones.map((razon, indice) => (
                <Reveal key={razon.titulo} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{razon.titulo}</h3>
                    <p className="pod-pilar__linea">{razon.linea}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.05}>
              <p className="pod-remate font-serif">{PODIO_URGENCIA.remate}</p>
              <p className="pod-microcopy tech-label">{PODIO_URGENCIA.microcopy}</p>
            </Reveal>
          </section>

          <section
            className="pod-seccion pod-seccion--destino"
            id="preguntas"
            aria-labelledby="pod-faq"
          >
            <div className="pod-columnas">
              <EncabezadoPodio
                id="pod-faq"
                eyebrow={PODIO_PREGUNTAS.eyebrow}
                titulo={PODIO_PREGUNTAS.titulo}
              />
              <Reveal>
                <FaqPodio
                  items={PODIO_PREGUNTAS.preguntas.map((pregunta) => ({
                    q: pregunta.q,
                    a: pregunta.a,
                  }))}
                />
              </Reveal>
            </div>
          </section>

          <section
            className="pod-seccion pod-cierre"
            id="inscripcion"
            aria-labelledby="pod-cierre-titulo"
          >
            <h2 id="pod-cierre-titulo" className="sr-only">
              Inscripción al Diplomado en Public Speaking
            </h2>

            <div className="pod-cierre__frase">
              {PODIO_CIERRE.lineas.map((linea, indice) => (
                <Reveal key={linea} delay={indice * 0.08}>
                  <p className="pod-cierre__linea font-serif" data-peso={indice === 0 ? "fuerte" : undefined}>
                    {linea}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="pod-inscripcion">
                <div className="pod-acciones">
                  <a
                    className="pod-boton"
                    href={SHARED_CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {PODIO_CIERRE.cta}
                  </a>
                  <a className="pod-boton pod-boton--secundario" href={`mailto:${SHARED_CONTACT.email}`}>
                    Escribir por correo
                  </a>
                </div>

                <p className="pod-microcopy tech-label">{PODIO_CIERRE.microcopy}</p>

                <dl className="pod-contacto">
                  <div className="pod-contacto__fila">
                    <dt className="tech-label">WhatsApp</dt>
                    <dd>{SHARED_CONTACT.whatsapp}</dd>
                  </div>
                  <div className="pod-contacto__fila">
                    <dt className="tech-label">Correo</dt>
                    <dd>{SHARED_CONTACT.email}</dd>
                  </div>
                  <div className="pod-contacto__fila">
                    <dt className="tech-label">Avala</dt>
                    <dd>{PODIO_CIERRE.firma}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </section>
        </main>
      </div>
    </SmoothScroll>
  );
}
