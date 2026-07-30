/*
  Tipografía del díptico promocional oficial del diplomado, extraída de las fuentes
  embebidas en «Díptico promo diplomado.pdf» (Canva, 11 de julio de 2026): Playfair
  Display como display y Glacial Indifference como sans geométrica.

  Las tres familias se declaran aquí pero se aplican SOLO en el subárbol de /g/podio,
  que las monta como variables CSS locales. Las rutas que comparten globals.css (/,
  /telon, /galeria, /v/*) conservan su gama Spectral + Inter + IBM Plex Mono intacta:
  ninguna variable de este módulo llega al layout raíz.

  Glacial Indifference no existe en Google Fonts, así que va autoalojada en woff2 bajo
  SIL Open Font License 1.1 (ver fonts/diptico/LICENCIA.md). Le faltan tres glifos que
  el español necesita —interpunto, interrogación y exclamación de apertura—, y ese hueco
  es justo el motivo por el que el díptico original arrastraba Noto Sans como recurso de
  emergencia. Aquí lo cubre DipticoSignos, un subconjunto de 752 bytes de Jost, la otra
  geométrica de linaje Futura, con esos tres caracteres y nada más.

  El ajuste métrico automático de next/font queda desactivado en las dos familias
  autoalojadas: si estuviera activo, su familia de respaldo interceptaría el interpunto
  antes de que la cascada llegara a DipticoSignos y el separador se dibujaría con la
  métrica del sistema en vez de con el trazo geométrico que le corresponde.
*/

import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

/*
  Solo los dos pesos que el díptico usa de verdad: Regular para el titular y Bold para el
  remate dorado. Cada peso o estilo declarado aquí de más es un woff2 que la página
  precarga y nunca dibuja.
*/
export const displayDiptico = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-diptico-display",
});

/*
  Las rutas van como literales porque next/font analiza estas llamadas en tiempo de
  compilación: una plantilla o una constante interpolada llegan vacías al cargador.
*/
export const sansDiptico = localFont({
  src: [
    {
      path: "./fonts/diptico/GlacialIndifference-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/diptico/GlacialIndifference-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-diptico-sans",
  adjustFontFallback: false,
});

export const signosDiptico = localFont({
  src: "./fonts/diptico/DipticoSignos.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-diptico-signos",
  adjustFontFallback: false,
});

export const CLASES_TIPOGRAFIA_DIPTICO = [
  displayDiptico.variable,
  sansDiptico.variable,
  signosDiptico.variable,
].join(" ");
