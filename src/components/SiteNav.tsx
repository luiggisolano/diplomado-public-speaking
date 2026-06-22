"use client";

import { useEffect, useState } from "react";
import { NAV, PRIMARY_CTA_HREF } from "@/lib/content";

/*
  Navegación fija del sistema "Aula Futura". Marca a la izquierda (palabra-acento en serif
  Spectral dorado), anclas de sección en mono técnica al centro y CTA azul institucional a la
  derecha. Permanece transparente sobre el hero y, al desplazarse, adopta un fondo navy con
  backdrop-blur y un filete azul-hairline para sostener el registro de panel de instrumentos
  sin competir con la grilla de partículas del hero. Las anclas usan el scroll suave global.
*/

const SCROLL_ACTIVATION_THRESHOLD_PX = 40;

export function SiteNav() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const evaluateScroll = () => {
      setHasScrolled(window.scrollY > SCROLL_ACTIVATION_THRESHOLD_PX);
    };

    evaluateScroll();
    window.addEventListener("scroll", evaluateScroll, { passive: true });
    return () => window.removeEventListener("scroll", evaluateScroll);
  }, []);

  const surfaceClassName = hasScrolled
    ? "border-line-strong bg-navy-deep/85 backdrop-blur-md"
    : "border-transparent bg-transparent";

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-500 ${surfaceClassName}`}
      aria-label="Navegación principal"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="group flex items-baseline gap-1.5 font-serif text-lg font-semibold tracking-tight text-paper"
        >
          {NAV.brandLead}
          <span className="serif-accent serif-accent--italic font-normal text-gold">
            {NAV.brandTail}
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {NAV.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-mist transition-colors hover:text-blue-bright"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={PRIMARY_CTA_HREF}
          className="rounded-full bg-gradient-to-b from-blue-bright to-blue px-5 py-2 text-xs font-semibold tracking-wide text-paper transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(77,147,245,0.7)]"
        >
          {NAV.cta}
        </a>
      </div>
    </nav>
  );
}
