import type { Metadata } from "next";
import { SITE_META } from "@/lib/content";
import { UrgencyBar } from "@/components/UrgencyBar";
import { SiteNav } from "@/components/SiteNav";
import Hero from "@/components/Hero";
import ProblemAgitation from "@/components/sections/ProblemAgitation";
import Solution from "@/components/sections/Solution";
import Modules from "@/components/sections/Modules";
import Audience from "@/components/sections/Audience";
import Transformation from "@/components/sections/Transformation";
import Methodology from "@/components/sections/Methodology";
import AcademicInfo from "@/components/sections/AcademicInfo";
import Urgency from "@/components/sections/Urgency";
import Faq from "@/components/sections/Faq";
import FinalClose from "@/components/sections/FinalClose";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsappFab } from "@/components/WhatsappFab";
import { AuthorSignature } from "@/components/AuthorSignature";

/*
  Composición del landing del Diplomado en Public Speaking UTMACH. Rediseño de nivel
  editorial: barra de urgencia y navegación fija encabezan la página; los once bloques de
  copy desarrollan hero cinematográfico, agitación a dos columnas, enfoque, los seis módulos,
  público, transformación antes/después, metodología, ficha académica, urgencia/cierre,
  preguntas frecuentes y coda final. El pie institucional del cliente y el botón flotante de
  WhatsApp cierran la utilidad; la firma de autor LS cierra la pieza como invariante de marca.

  Esta es la v1 «Aula Futura», la versión que ocupó «/» hasta el 29 de julio de 2026, cuando
  la landing Podio la sustituyó como definitiva. Se conserva completa y funcionando, fuera
  del índice, como referencia de la gama navy + azul institucional + ámbar.
*/

export const metadata: Metadata = {
  title: `Aula Futura · v1 | ${SITE_META.title}`,
  description: SITE_META.description,
  robots: { index: false, follow: false },
};

export default function AulaFuturaV1() {
  return (
    <>
      <UrgencyBar />
      <SiteNav />
      <main>
        <Hero />
        <ProblemAgitation />
        <Solution />
        <Modules />
        <Audience />
        <Transformation />
        <Methodology />
        <AcademicInfo />
        <Urgency />
        <Faq />
        <FinalClose />
      </main>
      <SiteFooter />
      <AuthorSignature />
      <WhatsappFab />
    </>
  );
}
