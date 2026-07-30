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
import { PodioEscena } from "@/components/premium/podio/PodioEscena";
import { FaqPodio } from "@/components/premium/podio/FaqPodio";
import { Reveal } from "@/components/premium/camara/Reveal";
import { RevealText } from "@/components/premium/camara/RevealText";
import { StatCounter } from "@/components/premium/camara/StatCounter";
import { ModuleSlide } from "@/components/premium/fusion/ModuleSlide";
import { CLASES_TIPOGRAFIA_DIPTICO } from "@/lib/fonts-diptico";
import {
  SHARED_AUDIENCE,
  SHARED_CLOSE,
  SHARED_CONTACT,
  SHARED_CTA,
  SHARED_FACTS,
  SHARED_FAQ,
  SHARED_METHOD,
  SHARED_MODULES,
  SHARED_PROMISE,
  SHARED_STATS,
  SHARED_TRANSFORMATION,
  SHARED_URGENCY,
} from "@/lib/variants-content";

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

function numeroOrdinal(indice: number): string {
  return String(indice + 1).padStart(2, "0");
}

export function LandingPodio() {
  return (
    <SmoothScroll>
      <div className={`pod-root ${CLASES_TIPOGRAFIA_DIPTICO}`}>
        <main>
          <PodioEscena />

          <section className="pod-seccion pod-seccion--cifras" aria-label="Datos del diplomado">
            <dl className="pod-cifras">
              {SHARED_STATS.map((cifra) => (
                <div key={cifra.label} className="pod-cifra">
                  <dd className="pod-cifra__valor mono-num">
                    <StatCounter value={cifra.value} suffix={cifra.suffix} />
                  </dd>
                  <dt className="pod-cifra__etiqueta tech-label">{cifra.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-promesa">
            <Reveal>
              <p className="pod-seccion__eyebrow tech-label">{SHARED_PROMISE.eyebrow}</p>
            </Reveal>
            <RevealText
              as="h2"
              id="pod-promesa"
              text={SHARED_PROMISE.headline}
              className="pod-seccion__titulo font-serif"
            />
            <Reveal delay={0.05}>
              <p className="pod-seccion__cuerpo">{SHARED_PROMISE.body}</p>
            </Reveal>
          </section>

          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-modulos">
            <Reveal>
              <p className="pod-seccion__eyebrow tech-label">Seis disciplinas · seis especialistas</p>
            </Reveal>
            <RevealText
              as="h2"
              id="pod-modulos"
              text="Seis módulos. Cada uno con su especialista."
              className="pod-seccion__titulo font-serif"
            />

            <div className="pod-rejilla-modulos">
              {SHARED_MODULES.map((modulo, indice) => (
                <ModuleSlide key={modulo.key} index={indice}>
                  <article className="pod-modulo">
                    <div className="pod-modulo__portada">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${RUTA_PORTADAS_MODULOS}/${indice + 1}.webp`}
                        alt={`Portada del módulo ${modulo.n} · ${modulo.title}`}
                        className="pod-modulo__imagen"
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={675}
                      />
                    </div>
                    <div className="pod-modulo__cuerpo">
                      <p className="pod-modulo__numero mono-num">{modulo.n}</p>
                      <h3 className="pod-modulo__titulo">{modulo.title}</h3>
                      <p className="pod-modulo__linea">{modulo.line}</p>
                    </div>
                  </article>
                </ModuleSlide>
              ))}
            </div>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-especialistas">
            <Reveal>
              <p className="pod-seccion__eyebrow tech-label">Quién te forma</p>
            </Reveal>
            <RevealText
              as="h2"
              id="pod-especialistas"
              text="Seis especialistas, una sola formación."
              className="pod-seccion__titulo font-serif"
            />
            <Reveal delay={0.05}>
              <p className="pod-seccion__cuerpo">
                Cada disciplina la imparte quien la ejerce. No es teoría genérica: el
                especialista que te enseña vive de lo que enseña.
              </p>
            </Reveal>

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
            <div className="pod-columnas">
              <div>
                <Reveal>
                  <p className="pod-seccion__eyebrow tech-label">{SHARED_AUDIENCE.eyebrow}</p>
                </Reveal>
                <RevealText
                  as="h2"
                  id="pod-publico"
                  text={SHARED_AUDIENCE.headline}
                  className="pod-seccion__titulo font-serif"
                />
              </div>
              <Reveal className="pod-perfiles">
                {SHARED_AUDIENCE.profiles.map((perfil, indice) => (
                  <div key={perfil} className="pod-perfil">
                    <span className="pod-perfil__numero mono-num">{numeroOrdinal(indice)}</span>
                    <span className="pod-perfil__nombre font-serif">{perfil}</span>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-transformacion">
            <Reveal>
              <p className="pod-seccion__eyebrow tech-label">{SHARED_TRANSFORMATION.eyebrow}</p>
            </Reveal>
            <RevealText
              as="h2"
              id="pod-transformacion"
              text={SHARED_TRANSFORMATION.headline}
              className="pod-seccion__titulo font-serif"
            />

            <div className="pod-contraste">
              <Reveal>
                <div className="pod-contraste__panel">
                  <p className="pod-contraste__rotulo tech-label">Hoy</p>
                  <ul className="pod-logros">
                    {SHARED_TRANSFORMATION.before.map((punto) => (
                      <li key={punto}>{punto}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="pod-contraste__panel pod-contraste__panel--despues">
                  <p className="pod-contraste__rotulo tech-label">Al terminar</p>
                  <ul className="pod-logros pod-logros--destacados">
                    {SHARED_TRANSFORMATION.after.map((punto) => (
                      <li key={punto}>{punto}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.05}>
              <figure className="pod-cita">
                <blockquote className="pod-cita__texto font-serif">
                  «{SHARED_TRANSFORMATION.quote}»
                </blockquote>
              </figure>
            </Reveal>
          </section>

          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-metodo">
            <Reveal>
              <p className="pod-seccion__eyebrow tech-label">{SHARED_METHOD.eyebrow}</p>
            </Reveal>
            <RevealText
              as="h2"
              id="pod-metodo"
              text={SHARED_METHOD.headline}
              className="pod-seccion__titulo font-serif"
            />

            <div className="pod-rejilla-pilares">
              {SHARED_METHOD.pillars.map((pilar, indice) => (
                <Reveal key={pilar.t} delay={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{pilar.t}</h3>
                    <p className="pod-pilar__linea">{pilar.d}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-datos">
            <div className="pod-columnas">
              <div>
                <Reveal>
                  <p className="pod-seccion__eyebrow tech-label">La ficha</p>
                </Reveal>
                <RevealText
                  as="h2"
                  id="pod-datos"
                  text="Lo que necesitas saber antes de inscribirte."
                  className="pod-seccion__titulo font-serif"
                />
              </div>
              <Reveal>
                <dl className="pod-datos">
                  {SHARED_FACTS.map((dato) => (
                    <div key={dato.label} className="pod-dato">
                      <dt className="pod-dato__etiqueta tech-label">{dato.label}</dt>
                      <dd className="pod-dato__valor mono-num">{dato.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </section>

          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-urgencia">
            <Reveal>
              <p className="pod-seccion__eyebrow tech-label">{SHARED_URGENCY.eyebrow}</p>
            </Reveal>
            <RevealText
              as="h2"
              id="pod-urgencia"
              text={SHARED_URGENCY.headline}
              className="pod-seccion__titulo font-serif"
            />

            <div className="pod-rejilla-pilares">
              {SHARED_URGENCY.reasons.map((razon, indice) => (
                <Reveal key={razon.t} delay={indice * 0.05}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{razon.t}</h3>
                    <p className="pod-pilar__linea">{razon.d}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="pod-seccion" aria-labelledby="pod-faq">
            <div className="pod-columnas">
              <div>
                <Reveal>
                  <p className="pod-seccion__eyebrow tech-label">Preguntas frecuentes</p>
                </Reveal>
                <RevealText
                  as="h2"
                  id="pod-faq"
                  text="Antes de que preguntes."
                  className="pod-seccion__titulo font-serif"
                />
              </div>
              <Reveal>
                <FaqPodio items={SHARED_FAQ} />
              </Reveal>
            </div>
          </section>

          <section
            className="pod-seccion pod-cierre"
            id="inscripcion"
            aria-labelledby="pod-cierre-titulo"
          >
            <RevealText
              as="h2"
              id="pod-cierre-titulo"
              text={SHARED_CLOSE.headline}
              className="pod-seccion__titulo font-serif"
            />
            <Reveal delay={0.05}>
              <p className="pod-microcopy tech-label">{SHARED_CLOSE.microcopy}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="pod-inscripcion">
                <p className="pod-inscripcion__rotulo tech-label">Inscripción abierta</p>

                <div className="pod-acciones">
                  <a
                    className="pod-boton"
                    href={SHARED_CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {SHARED_CTA.whatsapp}
                  </a>
                  <a className="pod-boton pod-boton--secundario" href={`mailto:${SHARED_CONTACT.email}`}>
                    Escribir por correo
                  </a>
                </div>

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
                    <dd>{SHARED_CONTACT.institution}</dd>
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
