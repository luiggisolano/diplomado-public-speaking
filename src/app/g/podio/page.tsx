/*
  Ruta heredada de la fase de exploración de las variantes de gama alta. Desde que Podio
  pasó a ser la landing definitiva en «/», esta URL sigue viva únicamente para no romper
  los enlaces que se repartieron mientras se comparaban las cinco direcciones.

  Renderiza exactamente la misma composición que la raíz, y por eso declara canonical
  hacia «/» y se mantiene fuera del índice: dos URLs con el mismo contenido compitiendo
  entre sí es peor que una sola.
*/

import type { Metadata } from "next";
import { LandingPodio } from "@/components/premium/podio/LandingPodio";
import { SITE_META } from "@/lib/content";

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function PaginaPodio() {
  return <LandingPodio />;
}
