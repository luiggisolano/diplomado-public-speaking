/*
  Variante "La Palabra" — tipografía cinética.
  RSC (Server Component): importa el CSS local y ensambla los componentes
  "use client" de la variante. Ningún import toca globals.css ni variantes
  de otros agentes (voz / escenario).
*/

import "./palabra.css";
import type { Metadata } from "next";
import { PalabraHero } from "@/components/variants/palabra/PalabraHero";
import { PalabraPromesa } from "@/components/variants/palabra/PalabraPromesa";
import { PalabraModulos } from "@/components/variants/palabra/PalabraModulos";
import { PalabraTransformacion } from "@/components/variants/palabra/PalabraTransformacion";
import { PalabraMetodo } from "@/components/variants/palabra/PalabraMetodo";
import { PalabraPublico } from "@/components/variants/palabra/PalabraPublico";
import { PalabraFicha } from "@/components/variants/palabra/PalabraFicha";
import { PalabraUrgencia } from "@/components/variants/palabra/PalabraUrgencia";
import { PalabraFAQ } from "@/components/variants/palabra/PalabraFAQ";
import { PalabraCierre } from "@/components/variants/palabra/PalabraCierre";

export const metadata: Metadata = {
  title: "Diplomado en Public Speaking — La Palabra | UTMACH",
  description:
    "Formación universitaria de oratoria y comunicación persuasiva. 160 h · 6 módulos · 100% en línea. Centro de Educación Continua UTMACH.",
};

export default function PalabraPage() {
  return (
    <main>
      <a
        href="#pal-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-gold)] focus:text-[var(--color-abyss)] focus:font-semibold focus:text-sm"
      >
        Saltar al contenido principal
      </a>

      <div id="pal-main-content">
        <PalabraHero />
        <PalabraPromesa />
        <PalabraModulos />
        <PalabraTransformacion />
        <PalabraMetodo />
        <PalabraPublico />
        <PalabraFicha />
        <PalabraUrgencia />
        <PalabraFAQ />
        <PalabraCierre />
      </div>
    </main>
  );
}
