/*
  Variante "Sónica" — la palabra como materia que vibra. Dirección de arte brutalista
  premium: tipografía masiva sobre un fondo WebGL (OGL) de campo sonoro con aberración
  cromática ligada a la velocidad del scroll, galería horizontal pinned de los seis
  módulos (GSAP ScrollTrigger) y scroll suave (Lenis). Todo el motion honra
  prefers-reduced-motion cayendo a un layout estático legible.

  Server Component: importa el CSS local scoped y ensambla los componentes. El único
  fragmento no indexable del andamiaje; robots index:false hasta que se elija la gama.
  Ningún import toca globals.css ni las variantes de los otros agentes.
*/

import "./sonica.css";
import type { Metadata } from "next";
import { SmoothScroll } from "@/components/premium/_shared/SmoothScroll";
import { SonicaStage } from "@/components/premium/sonica/SonicaStage";
import { SonicaHero } from "@/components/premium/sonica/SonicaHero";
import { SonicaStats } from "@/components/premium/sonica/SonicaStats";
import { SonicaPromise } from "@/components/premium/sonica/SonicaPromise";
import { SonicaModules } from "@/components/premium/sonica/SonicaModules";
import { SonicaAudience } from "@/components/premium/sonica/SonicaAudience";
import { SonicaTransformation } from "@/components/premium/sonica/SonicaTransformation";
import { SonicaMethod } from "@/components/premium/sonica/SonicaMethod";
import { SonicaFacts } from "@/components/premium/sonica/SonicaFacts";
import { SonicaUrgency } from "@/components/premium/sonica/SonicaUrgency";
import { SonicaFAQ } from "@/components/premium/sonica/SonicaFAQ";
import { SonicaClose } from "@/components/premium/sonica/SonicaClose";
import { SonicaSignature } from "@/components/premium/sonica/SonicaSignature";

export const metadata: Metadata = {
  title: "Sónica · Diplomado en Public Speaking | UTMACH",
  description:
    "Formación universitaria de oratoria y comunicación persuasiva. 160 h · 6 módulos · 100% en línea. Centro de Educación Continua UTMACH.",
  robots: { index: false, follow: false },
};

export default function SonicaPage() {
  return (
    <main className="sonica">
      <a href="#son-main" className="son-skip">
        Saltar al contenido principal
      </a>

      <SmoothScroll>
        <SonicaStage>
          <div id="son-main">
            <SonicaHero />
            <SonicaStats />
            <SonicaPromise />
            <SonicaModules />
            <SonicaAudience />
            <SonicaTransformation />
            <SonicaMethod />
            <SonicaFacts />
            <SonicaUrgency />
            <SonicaFAQ />
            <SonicaClose />
            <SonicaSignature />
          </div>
        </SonicaStage>
      </SmoothScroll>
    </main>
  );
}
