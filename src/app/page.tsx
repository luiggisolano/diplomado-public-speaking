/*
  Raíz del sitio: la landing definitiva del Diplomado en Public Speaking y Comunicación
  Persuasiva del Centro de Educación Continua UTMACH.

  Desde el 29 de julio de 2026 esta ruta sirve la versión Podio —secuencia de imágenes
  guiada por el scroll y tipografía tomada del díptico promocional oficial— en lugar de la
  v1 «Aula Futura», que se conserva íntegra y sin indexar en /aula-futura.

  La composición vive en components/premium/podio/LandingPodio porque la comparte con
  /g/podio, que quedó como ruta heredada de la fase de exploración. Esta es la canónica:
  es la única de las dos que se indexa.
*/

import type { Metadata } from "next";
import { LandingPodio } from "@/components/premium/podio/LandingPodio";
import { SITE_META } from "@/lib/content";

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return <LandingPodio />;
}
