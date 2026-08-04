"use client";

/*
  Cartel fotográfico de escena (nivel T1e del contrato visual). Cinco de los once carteles
  entran en cinco de los catorce bloques del cuerpo, y ninguno sangra: la resolución nativa
  no da para ello, así que todos van en la columna derecha de una escena a dos partes. La
  única excepción es el fondo del cierre, documentada en podio.css.

  El presupuesto técnico de cada cartel vive aquí y no en el markup que lo invoca: medida
  intrínseca, medida servida al navegador y encuadre son propiedades del archivo, no de la
  sección que lo usa, y repartirlas por la página garantizaba que alguna se desincronizara.

  Los descriptores de srcset declaran el ancho REAL de cada archivo, no el que sugiere su
  nombre: tres de los cinco que se usan se exportaron a 1122 px de origen aunque el archivo
  se llame «-1200». Mentirle al navegador sobre la densidad disponible es la vía directa a
  servir un archivo que no puede sostener la caja en la que se pinta.

  Etiqueta img nativa con srcset y no next/image, que es el patrón que ya usa la portada de
  los módulos: introducir un segundo mecanismo de imagen en la misma página duplica la
  superficie de fallo sin ganar nada, porque estas cinco son estáticas y diferidas. Van
  diferidas y con prioridad baja para que su descarga no compita con la precarga de los 96
  frames del recorrido de apertura, que es lo que el visitante está mirando mientras tanto.

  El gesto es un fundido con una escala corta de 1,04 a 1, aplicada al <img> y no a la caja,
  dentro del recorte del contenedor. Revierte entero al subir, opacidad y escala a la vez,
  de modo que la fotografía se compone igual entrando por abajo que volviendo por arriba.
  Antes la escala corría una sola vez y al subir solo se apagaba la opacidad: el gesto era
  asimétrico y en la relectura la imagen aparecía ya montada.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

const RUTA_DE_LOS_CARTELES = "/podio/carteles";

/*
  La columna de media se topa en 500 px a 1440 por construcción de la retícula, así que por
  encima de 78rem se declara ese ancho fijo en lugar de un porcentaje que seguiría creciendo
  y pediría un archivo que no existe.
*/
const MEDIDA_DE_COLUMNA =
  "(min-width: 78rem) 500px, (min-width: 62rem) 40vw, (min-width: 48rem) 60vw, calc(100vw - 3rem)";
const MEDIDA_A_SANGRE = "100vw";

/*
  La banda ocupa el ancho de lectura entero, que se topa en los 72rem del contenido. A 1.440
  eso son 1.152 px CSS contra los 1.122 del archivo mayor de umbral-ascensor: 0,97 px por
  píxel, prácticamente uno a uno, que es el límite en el que un cartel de este set puede
  cruzar la página sin verse blando. Ningún otro debería usar esta variante sin rehacer esa
  cuenta con su propia resolución.
*/
const MEDIDA_DE_BANDA = "(min-width: 78rem) 1152px, calc(100vw - 3rem)";

/*
  anchoIntrinseco/altoIntrinseco son las medidas reales del archivo mayor de cada cartel, y
  «archivos» lista los anchos REALES de cada variante servida, con su sufijo. La caja que
  reserva el espacio la declara el CSS con aspect-ratio, así que estos atributos no mueven la
  maqueta: van por corrección del recurso y para que el navegador calcule bien la densidad.

  auditorio-orador es el único con tres variantes. Va de fondo a sangre en el cierre, donde
  la caja llega a 1.440 px CSS, y para eso se reexportó desde el original a 1.856 px. Los de
  1.200 y 800 siguen en el srcset para los anchos menores, que es donde tienen sentido.
*/
const CARTELES = {
  "mesa-directorio": {
    anchoIntrinseco: 1200,
    altoIntrinseco: 1501,
    archivos: [
      { sufijo: "800", ancho: 800 },
      { sufijo: "1200", ancho: 1200 },
    ],
    medida: MEDIDA_DE_COLUMNA,
    encuadre: "50% 45%",
  },
  "aula-mano-alzada": {
    anchoIntrinseco: 1122,
    altoIntrinseco: 1402,
    archivos: [
      { sufijo: "800", ancho: 800 },
      { sufijo: "1200", ancho: 1122 },
    ],
    medida: MEDIDA_DE_COLUMNA,
    /*
      La mano levantada y el haz de luz que la alcanza viven en el tercio superior; la mitad
      inferior son butacas a oscuras. Al recortar a cuadrado en móvil, este encuadre es el
      que conserva el gesto en lugar de las butacas.
    */
    encuadre: "50% 35%",
  },
  "equipo-nocturno": {
    anchoIntrinseco: 1122,
    altoIntrinseco: 1402,
    archivos: [
      { sufijo: "800", ancho: 800 },
      { sufijo: "1200", ancho: 1122 },
    ],
    medida: MEDIDA_DE_COLUMNA,
    encuadre: "52% 40%",
  },
  "umbral-ascensor": {
    anchoIntrinseco: 1122,
    altoIntrinseco: 1402,
    archivos: [
      { sufijo: "800", ancho: 800 },
      { sufijo: "1200", ancho: 1122 },
    ],
    medida: MEDIDA_DE_COLUMNA,
    encuadre: "50% 42%",
  },
  "muro-certificados": {
    anchoIntrinseco: 1122,
    altoIntrinseco: 1402,
    archivos: [
      { sufijo: "800", ancho: 800 },
      { sufijo: "1200", ancho: 1122 },
    ],
    medida: MEDIDA_DE_COLUMNA,
    encuadre: "50% 50%",
  },
  "auditorio-orador": {
    anchoIntrinseco: 1856,
    altoIntrinseco: 2304,
    archivos: [
      { sufijo: "800", ancho: 800 },
      { sufijo: "1200", ancho: 1200 },
      { sufijo: "1856", ancho: 1856 },
    ],
    medida: MEDIDA_A_SANGRE,
    encuadre: "50% 38%",
  },
} as const;

type CartelDisponible = keyof typeof CARTELES;

type MediaEscenaProps = {
  cartel: CartelDisponible;
  variante: "columna" | "fondo" | "banda";
  claseDeLaImagen?: string;
  tono?: "claro";
};

const ESCALA_DE_PARTIDA = 1.04;
const DURACION_DE_LA_ENTRADA = 1.1;
const CURVA_DE_SALIDA = "power2.out";
const PUNTO_DE_DISPARO = "top 82%";

export function MediaEscena({
  cartel,
  variante,
  claseDeLaImagen,
  tono,
}: MediaEscenaProps) {
  const imagenRef = useRef<HTMLImageElement | null>(null);
  const ficha = CARTELES[cartel];

  useEffect(() => {
    const imagen = imagenRef.current;
    if (!imagen) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      gsap.set(imagen, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(imagen, { opacity: 0, scale: ESCALA_DE_PARTIDA });

    const disparadorComun = {
      trigger: imagen,
      start: PUNTO_DE_DISPARO,
      invalidateOnRefresh: true,
    };

    const entrada = gsap.to(imagen, {
      opacity: 1,
      scale: 1,
      duration: DURACION_DE_LA_ENTRADA,
      ease: CURVA_DE_SALIDA,
      scrollTrigger: { ...disparadorComun, toggleActions: "play none none reverse" },
    });

    return () => {
      entrada.scrollTrigger?.kill();
      entrada.kill();
    };
  }, [cartel]);

  const rutaDe = (sufijo: string) => `${RUTA_DE_LOS_CARTELES}/${cartel}-${sufijo}.webp`;
  const archivoMayor = ficha.archivos[ficha.archivos.length - 1];
  const conjuntoDeFuentes = ficha.archivos
    .map((archivo) => `${rutaDe(archivo.sufijo)} ${archivo.ancho}w`)
    .join(", ");

  const imagen = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imagenRef}
      src={rutaDe(archivoMayor.sufijo)}
      srcSet={conjuntoDeFuentes}
      sizes={variante === "banda" ? MEDIDA_DE_BANDA : ficha.medida}
      alt=""
      width={ficha.anchoIntrinseco}
      height={ficha.altoIntrinseco}
      loading="lazy"
      fetchPriority="low"
      decoding="async"
      className={claseDeLaImagen ?? "pod-escena__imagen"}
      style={{ objectPosition: ficha.encuadre }}
      aria-hidden={variante === "columna" ? undefined : true}
    />
  );

  if (variante === "fondo") {
    return imagen;
  }

  if (variante === "banda") {
    return <div className="pod-banda">{imagen}</div>;
  }

  return (
    <div className="pod-escena__media" data-tono={tono}>
      {imagen}
    </div>
  );
}
