/*
  Composición de la landing definitiva del Diplomado en Public Speaking y Comunicación
  Persuasiva del Centro de Educación Continua UTMACH.

  Vive en un componente y no directamente en un page.tsx porque la sirven dos rutas: «/»,
  que es la canónica e indexable desde que esta versión sustituyó a la v1 Aula Futura, y
  «/g/podio», que quedó como ruta heredada con noindex y canonical hacia la raíz.

  El contenido viene de /g/fusion, que lo había reunido durante la exploración. Lo que NO se
  trae es su capa de presentación. Fusion se monta sobre camara.css con clases cam-* y fus-*,
  mientras esta ruta es autónoma sobre podio.css con tokens propios, de modo que el markup
  está rehecho en clases pod-* y conserva el velo calibrado, los halos de texto sobre imagen
  y la tipografía del díptico que se ajustaron aquí. Tampoco se trae el fondo de nube WebGL
  de fusion: la identidad de esta landing es la secuencia de frames, y superponer las dos
  capas competiría por la misma atención.

  El movimiento del cuerpo tampoco se importa ya. Las piezas de premium/camara y
  premium/fusion las consumen /g/camara y /g/fusion, así que recalibrar su gesto para esta
  página habría cambiado dos rutas ajenas: en su lugar viven aquí RevelaPodio, LineaPodio,
  CifraPodio, FileteCargado, EjeDelPrograma y MediaEscena. Todos emiten la clase .cam-reveal
  exacta cuando envuelven contenido, que no es cosmética: sostiene varias reglas de podio.css
  y la mayoría falla en silencio.

  El régimen es de dos niveles. Titulares y líneas de display entran y vuelven a salir al
  subir, porque marcan capítulo y una página de 19.000 px se relee; el cuerpo entra una sola
  vez, porque reproducir 57 bloques en las dos direcciones se lee como nerviosismo.

  Cuatro carteles fotográficos entran en cuatro de los doce bloques, sin que ninguno se
  repita: mesa-directorio y equipo-nocturno en la columna derecha de una escena a dos partes,
  umbral-ascensor como banda a lo ancho del cuerpo y auditorio-orador de fondo en el cierre.
  Los de columna no sangran porque su resolución nativa no da; el del cierre sí, porque tiene
  un archivo propio de 1.856 px reexportado para eso, y la excepción está documentada con su
  aritmética en podio.css.

  Las escenas «La formación» y «Seis enfoques» se retiraron el 2026-08-03 por decisión del
  cliente; su copy sigue en lib/podio-content por si vuelve. El 2026-08-04 se retiraron por la
  misma vía las dos imágenes que acompañaban al método y a la ficha: el micrófono que llegaba
  al atril, con su fotografía de sala y sus fotogramas, y el muro de certificados. Ambas
  secciones son ahora de texto solo.

  Server Component: el canvas, la precarga de frames, el pinning y el motion viven en los
  componentes cliente. Copy íntegro desde lib/podio-content (fuente única) y tipografía desde
  lib/fonts-diptico, montada sobre .pod-root para no alcanzar el layout raíz.
*/

import "./podio.css";

import { SmoothScroll } from "@/components/premium/_shared/SmoothScroll";
import { BarraPodio } from "@/components/premium/podio/BarraPodio";
import { PodioEscena } from "@/components/premium/podio/PodioEscena";
import { FaqPodio } from "@/components/premium/podio/FaqPodio";
import { EncabezadoPodio } from "@/components/premium/podio/EncabezadoPodio";
import { RevelaPodio } from "@/components/premium/podio/RevelaPodio";
import { LineaPodio } from "@/components/premium/podio/LineaPodio";
import { CifraPodio } from "@/components/premium/podio/CifraPodio";
import { EjeDelPrograma } from "@/components/premium/podio/EjeDelPrograma";
import { FileteCargado } from "@/components/premium/podio/FileteCargado";
import { MediaEscena } from "@/components/premium/podio/MediaEscena";
import { PasoDeTransformacion } from "@/components/premium/podio/PasoDeTransformacion";
import { CLASES_TIPOGRAFIA_DIPTICO } from "@/lib/fonts-diptico";
import { SHARED_CONTACT } from "@/lib/variants-content";
import {
  PODIO_AGITACION,
  PODIO_AVAL,
  PODIO_CIERRE,
  PODIO_CIFRAS,
  PODIO_FICHA,
  PODIO_METODO,
  PODIO_MODULOS,
  PODIO_PREGUNTAS,
  PODIO_PUBLICO,
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
  El rótulo de los síntomas hace de título accesible de su propia escena. Se apunta a él con
  aria-labelledby en lugar de repetir el texto en un aria-label: la frase ya está escrita en
  pantalla y duplicarla obliga a un lector de pantalla a oírla dos veces.
*/
const ID_DEL_ROTULO_DE_SINTOMAS = "pod-sintomas-rotulo";

/*
  Aire que Lenis deja sobre el destino al saltar a un ancla, para que la barra no tape el
  título al aterrizar. Es la altura de la barra en escritorio más un margen; en móvil, donde
  la barra es más baja, ese margen se lee simplemente como más respiro.
*/
const DESPLAZAMIENTO_BAJO_LA_BARRA = 24;

/*
  Pie de imprenta. El año va escrito y no calculado con Date: el componente se renderiza en
  el servidor y en el navegador, y una fecha viva puede dar dos textos distintos en la misma
  carga, que es un fallo de hidratación garantizado la noche del 31 de diciembre.
*/
const PIE_DE_PAGINA = [
  "Universidad Técnica de Machala",
  "Machala, El Oro, Ecuador",
] as const;
const ANIO_DEL_PIE = "2026";

/*
  La firma manuscrita del autor. Se sirve en dos anchos para que una pantalla de densidad
  doble reciba el trazo a resolución nativa: una curva escalada desde un archivo justo se
  delata en los remates finos mucho antes que una fotografía.
*/
const RUTA_DE_LA_FIRMA = "/podio/firma-luiggi";
const ANCHO_SERVIDO_DE_LA_FIRMA = 190;

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
              {PODIO_CIFRAS.map((cifra, indice) => (
                <CifraPodio
                  key={cifra.etiqueta}
                  valor={cifra.valor}
                  sufijo={cifra.sufijo}
                  etiqueta={cifra.etiqueta}
                  indice={indice}
                />
              ))}
            </dl>

            <RevelaPodio retardo={0.1} className="pod-aval-marco">
              <p className="pod-aval">
                <span className="pod-aval__rotulo">{PODIO_AVAL.rotulo}</span>
                {PODIO_AVAL.sellos.map((sello) => (
                  <span key={sello} className="pod-aval__sello">
                    {sello}
                  </span>
                ))}
              </p>
            </RevelaPodio>
          </section>

          {/*
            Escena A. Una sola afirmación: existe un punto de inflexión en la carrera de toda
            persona profesional. Antes esta sección encadenaba entradilla, cuerpo, giro,
            sentencia, rótulo, seis síntomas y remate, cuatro afirmaciones apiladas en un
            solo bloque.

            El encabezado va fuera de la escena y ocupa el ancho de lectura entero; dentro de
            la retícula quedan solo el texto y la fotografía. Metido en la columna izquierda,
            el titular disponía de la mitad del ancho y caía en cinco renglones que hacían de
            él una masa vertical: es la afirmación que abre el capítulo y necesita leerse de
            una vez, no un párrafo en caja alta.
          */}
          <section className="pod-seccion" aria-labelledby="pod-agitacion">
            <EncabezadoPodio
              id="pod-agitacion"
              className="pod-encabezado--rotulo-mayor"
              eyebrow={PODIO_AGITACION.eyebrow}
              titulo={PODIO_AGITACION.titulo}
            />

            <div className="pod-escena">
              <div className="pod-escena__texto">
                <LineaPodio
                  texto={PODIO_AGITACION.entrada}
                  className="pod-seccion__entrada font-serif"
                />
                <p className="pod-seccion__cuerpo">{PODIO_AGITACION.cuerpo}</p>
                <LineaPodio
                  texto={PODIO_AGITACION.giro}
                  acento={PODIO_AGITACION.giroAcento}
                  className="pod-seccion__giro font-serif"
                />
                <LineaPodio
                  texto={PODIO_AGITACION.sentencia}
                  className="pod-seccion__sentencia font-serif"
                />
              </div>

              <MediaEscena cartel="equipo-nocturno" variante="columna" />
            </div>
          </section>

          {/*
            Escena B. Otra sola afirmación: así se ve cuando esa habilidad no está entrenada.
            Comparte fondo con la escena A a propósito; lo que marca el corte es el filete
            superior, no un cambio de color, así que la alternancia de la página sigue igual
            a partir de aquí.
          */}
          <section className="pod-seccion" aria-labelledby={ID_DEL_ROTULO_DE_SINTOMAS}>
            <RevelaPodio retardo={0.05}>
              <p id={ID_DEL_ROTULO_DE_SINTOMAS} className="pod-rotulo-lista tech-label">
                {PODIO_AGITACION.rotuloSintomas}
              </p>
            </RevelaPodio>

            {/*
              Lista ordenada y no viñetas sueltas: los folios 01-06 son el recuento, y en
              una enumeración que existe para que el visitante se reconozca en varias, saber
              cuántas van y cuántas quedan es información. El número dibujado va fuera del
              árbol de accesibilidad porque la lista ordenada ya lo anuncia, y oírlo dos
              veces es peor que no verlo.

              El revelado envuelve al contenido de cada punto y no al punto entero: un div
              suelto entre los hijos de una lista no es marcado válido, que es lo que había.
            */}
            <ol className="pod-sintomas">
              {PODIO_AGITACION.sintomas.map((sintoma, indice) => (
                <li key={sintoma} className="pod-sintoma">
                  <FileteCargado />
                  <RevelaPodio retardo={indice * RETARDO_ENTRE_TARJETAS}>
                    <div className="pod-sintoma__fila">
                      <span className="pod-sintoma__folio mono-num" aria-hidden="true">
                        {numeroOrdinal(indice)}
                      </span>
                      <p className="pod-sintoma__texto">{sintoma}</p>
                    </div>
                  </RevelaPodio>
                </li>
              ))}
            </ol>

            <FileteCargado />

            <LineaPodio
              texto={PODIO_AGITACION.remate}
              className="pod-remate pod-remate--una-linea font-serif"
            />
          </section>

          {/*
            Los módulos ya traen sus seis portadas oficiales: añadir aquí un séptimo cartel
            es exactamente saturar la escena, así que esta es una de las que no lleva imagen.
          */}
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

            {/*
              Los seis módulos cuelgan de un eje que se carga de oro con el scroll, uno a
              cada lado, y cada punto se enciende cuando la carga llega a su altura. Es el
              mismo gesto que la lista de síntomas, un escalón más arriba: el programa se
              lee como un recorrido con principio y final, no como seis fichas sueltas.

              La alternancia de lado la decide el CSS por posición y no un data-* en el
              marcado, porque es una propiedad de la retícula y no del módulo: reordenar el
              programa no debería obligar a reescribir de qué lado cae cada uno.
            */}
            <EjeDelPrograma>
              {PODIO_MODULOS.modulos.map((modulo, indice) => (
                <RevelaPodio key={modulo.n} className="pod-hito">
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
                </RevelaPodio>
              ))}
            </EjeDelPrograma>
          </section>

          {/*
            Seis retratos con numeral dorado ya son el peso visual de la escena. Una foto de
            escenario sobre seis fichas que dicen «Nombre por confirmar» prometería personas
            que todavía no existen.
          */}
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
                <RevelaPodio key={especialista.modulo} retardo={indice * RETARDO_ENTRE_TARJETAS}>
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
                </RevelaPodio>
              ))}
            </div>
          </section>

          {/*
            El cartel acompaña al titular y no a la rejilla, que es la regla de las cuatro
            secciones con media: la imagen cuelga de la fila del encabezado y la rejilla de
            la escena va debajo a todo el ancho. Con las cinco tarjetas dentro de la columna
            de texto, esta se estiraba al doble de la altura de la imagen y dejaba mil
            píxeles de columna derecha vacía, que es justo el defecto que se corrige.
          */}
          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-publico">
            <EncabezadoPodio
              id="pod-publico"
              eyebrow={PODIO_PUBLICO.eyebrow}
              titulo={PODIO_PUBLICO.titulo}
              className="pod-encabezado--centrado"
            />

            {/*
              La sala de directorio se ancla en el centro y los cinco perfiles pasan por sus
              costados, dos por la izquierda y tres por la derecha. La fotografía tiene gente
              sentada a ambos lados de una mesa y una cabecera iluminada al fondo: puesta en
              medio, la maqueta repite su composición en lugar de contradecirla.

              El reparto es dos y tres porque los perfiles son cinco y no hay simetría
              posible; la columna derecha arranca más abajo para que el desnivel se lea como
              un desfase buscado y no como una fila mal cerrada.
            */}
            <div className="pod-rodea">
              <div className="pod-rodea__columna">
                {PODIO_PUBLICO.perfiles.slice(0, 2).map((perfil, indice) => (
                  <RevelaPodio key={perfil.titulo} retardo={indice * RETARDO_ENTRE_TARJETAS}>
                    <article className="pod-perfil">
                      <h3 className="pod-perfil__titulo font-serif">{perfil.titulo}</h3>
                      <p className="pod-perfil__linea">{perfil.linea}</p>
                    </article>
                  </RevelaPodio>
                ))}
              </div>

              <div className="pod-rodea__media">
                <MediaEscena cartel="mesa-directorio" variante="columna" />
              </div>

              <div className="pod-rodea__columna pod-rodea__columna--derecha">
                {PODIO_PUBLICO.perfiles.slice(2).map((perfil, indice) => (
                  <RevelaPodio key={perfil.titulo} retardo={indice * RETARDO_ENTRE_TARJETAS}>
                    <article className="pod-perfil">
                      <h3 className="pod-perfil__titulo font-serif">{perfil.titulo}</h3>
                      <p className="pod-perfil__linea">{perfil.linea}</p>
                    </article>
                  </RevelaPodio>
                ))}
              </div>
            </div>
          </section>

          {/*
            Cruzar el umbral hacia la luz es literalmente el «después» que argumenta la
            balanza, así que el cartel va en la fila del encabezado y las diez filas del
            antes y el después ocupan el ancho completo debajo. Cae seguida de la escena de
            público, que es la única adyacencia de imagen de la página, y funciona porque las
            dos están en fondos distintos con diez filas de texto entre medias.
          */}
          <section className="pod-seccion" aria-labelledby="pod-transformacion">
            <EncabezadoPodio
              id="pod-transformacion"
              eyebrow={PODIO_TRANSFORMACION.eyebrow}
              titulo={PODIO_TRANSFORMACION.titulo}
            />

            {/*
              El cartel pasa a banda de ancho completo bajo el encabezado. «Esto cambia en
              ti» son tres palabras, el titular más corto de la página: en la mitad de una
              escena a dos partes dejaba la otra mitad en negro.
            */}
            <MediaEscena cartel="umbral-ascensor" variante="banda" />

            {/*
              Los diez puntos del copy son en realidad CINCO PARES: cada antes tiene escrito
              su después exacto. Enfrentados renglón a renglón, ese paralelismo se ve; en dos
              columnas independientes, que es como estaban, se pierde y el bloque se lee como
              dos listas que casualmente miden lo mismo.
            */}
            <div className="pod-marbetes">
              <p className="pod-marbete tech-label" data-tono="antes">
                {PODIO_TRANSFORMACION.antes.rotulo}
              </p>
              <span />
              <p className="pod-marbete tech-label" data-tono="despues">
                {PODIO_TRANSFORMACION.despues.rotulo}
              </p>
            </div>

            <div className="pod-pasos">
              {PODIO_TRANSFORMACION.antes.puntos.map((punto, indice) => (
                <PasoDeTransformacion
                  key={punto}
                  antes={punto}
                  despues={PODIO_TRANSFORMACION.despues.puntos[indice]}
                />
              ))}
            </div>

            <LineaPodio
              texto={PODIO_TRANSFORMACION.remate}
              className="pod-remate pod-remate--centrado font-serif"
            />
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
                <RevelaPodio key={pilar.titulo} retardo={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{pilar.titulo}</h3>
                    <p className="pod-pilar__linea">{pilar.linea}</p>
                  </article>
                </RevelaPodio>
              ))}
            </div>
          </section>

          {/*
            Sin fotografía por decisión del cliente el 2026-08-04. La ficha dejó de ser una
            escena a dos partes y el texto pasó a mandar solo, así que aquí no hay retícula de
            columnas: la lista se limita por su propia medida en podio.css, porque una fila de
            etiqueta contra valor separada por el ancho entero de lectura deja de leerse como
            un par.
          */}
          <section
            className="pod-seccion pod-seccion--destino"
            id="inversion"
            aria-labelledby="pod-datos"
          >
            <EncabezadoPodio
              id="pod-datos"
              eyebrow={PODIO_FICHA.eyebrow}
              titulo={PODIO_FICHA.titulo}
            />

            <RevelaPodio>
              <dl className="pod-datos">
                {PODIO_FICHA.datos.map((dato) => (
                  <div key={dato.etiqueta} className="pod-dato">
                    <dt className="pod-dato__etiqueta tech-label">{dato.etiqueta}</dt>
                    <dd className="pod-dato__valor mono-num">{dato.valor}</dd>
                  </div>
                ))}
              </dl>
            </RevelaPodio>
          </section>

          {/*
            Escena corta y a propósito seca: es el momento de decisión, no de contemplación.
          */}
          <section className="pod-seccion pod-seccion--alterna" aria-labelledby="pod-urgencia">
            <EncabezadoPodio
              id="pod-urgencia"
              eyebrow={PODIO_URGENCIA.eyebrow}
              titulo={PODIO_URGENCIA.titulo}
            />

            <div className="pod-rejilla-pilares">
              {PODIO_URGENCIA.razones.map((razon, indice) => (
                <RevelaPodio key={razon.titulo} retardo={indice * RETARDO_ENTRE_TARJETAS}>
                  <article className="pod-pilar">
                    <p className="pod-pilar__numero mono-num">{numeroOrdinal(indice)}</p>
                    <h3 className="pod-pilar__titulo">{razon.titulo}</h3>
                    <p className="pod-pilar__linea">{razon.linea}</p>
                  </article>
                </RevelaPodio>
              ))}
            </div>

            {/*
              El remate cierra la escena solo y centrado. La letra pequeña con la fecha de
              corte que iba debajo se retiró por pedido del cliente, y con ella el bloque
              revelado que la envolvía: un RevelaPodio sin contenido es un nodo que sigue
              animando la nada. El modificador centrado es el mismo que usa el remate de la
              transformación, así que la página no gana una regla por esto.
            */}
            <LineaPodio
              texto={PODIO_URGENCIA.remate}
              className="pod-remate pod-remate--centrado font-serif"
            />
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
              <RevelaPodio>
                <FaqPodio
                  items={PODIO_PREGUNTAS.preguntas.map((pregunta) => ({
                    q: pregunta.q,
                    a: pregunta.a,
                  }))}
                />
              </RevelaPodio>
            </div>
          </section>

          {/*
            Fondo de sección a sangre: la única excepción a la regla de que ningún cartel
            sangra, con su aritmética documentada en podio.css. El microcopy y los datos de
            contacto viven dentro de .pod-inscripcion, que tiene fondo macizo; sobre la
            fotografía solo va la frase de cierre, que es display y se verifica midiendo los
            píxeles reales del fondo, no el token.

            Las dos líneas se parten por LETRAS y no por palabras. Es el único sitio de la
            página donde se justifica: suman 83 caracteres, y a 0,018 s de escalonado dan una
            cascada de 1,5 s que es exactamente el peso que pide el último gesto.
          */}
          <section
            className="pod-seccion pod-cierre"
            id="inscripcion"
            aria-labelledby="pod-cierre-titulo"
          >
            <MediaEscena
              cartel="auditorio-orador"
              variante="fondo"
              claseDeLaImagen="pod-cierre__fondo"
            />
            <span className="pod-cierre__velo" aria-hidden="true" />

            <h2 id="pod-cierre-titulo" className="sr-only">
              Inscripción al Diplomado en Public Speaking
            </h2>

            <RevelaPodio retardo={0.1}>
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
            </RevelaPodio>
          </section>
        </main>

        {/*
          Pie de imprenta. Va fuera del main porque no es contenido de la página sino su
          firma: quién publica, desde dónde y de qué año es lo que se está leyendo.
        */}
        <footer className="pod-pie">
          <p className="pod-pie__linea">
            <span className="pod-pie__anio">© {ANIO_DEL_PIE}</span>
            <span className="pod-pie__marca">Diplomado Public Speaking</span>
            {PIE_DE_PAGINA.map((dato) => (
              <span key={dato} className="pod-pie__dato">
                {dato}
              </span>
            ))}
          </p>

          {/*
            La firma del autor, al final de todo y en su propio trazo, como quien firma un
            cuadro en la esquina. El archivo ya viene en el hueso de la página en lugar de
            invertirse por CSS: un filtro sobre la imagen entera obliga al navegador a
            componer una capa aparte, y aquí no hace falta pagar eso por un color que no
            cambia nunca.
          */}
          <div className="pod-firma">
            <p className="pod-firma__rotulo tech-label">Diseño y desarrollo</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${RUTA_DE_LA_FIRMA}-640.webp`}
              srcSet={`${RUTA_DE_LA_FIRMA}-320.webp 320w, ${RUTA_DE_LA_FIRMA}-640.webp 640w`}
              sizes={`${ANCHO_SERVIDO_DE_LA_FIRMA}px`}
              alt="Luiggi"
              width={640}
              height={265}
              loading="lazy"
              decoding="async"
              className="pod-firma__trazo"
            />
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
