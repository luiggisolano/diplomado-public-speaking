import { LineIcon } from "@/components/LineIcon";
import { CONTACT, FOOTER } from "@/lib/content";

/*
  Pie de página institucional del sistema "Aula Futura". Tres columnas (marca + descripción,
  recorrido rápido, contacto directo) sobre el abismo navy más profundo de la página. Los
  títulos de columna van en mono técnica azul (registro de catálogo académico) y la marca usa
  serif Spectral con la cola dorada. Server Component: enlaces estáticos. Precede a la firma de
  autor LS, que cierra la pieza como invariante de marca.
*/

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-abyss pt-[clamp(4rem,2.5rem+5vw,7rem)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <p className="flex items-baseline gap-1.5 font-serif text-lg font-semibold tracking-tight text-paper">
            {FOOTER.brandLead}
            <span className="serif-accent serif-accent--italic font-normal text-gold">
              {FOOTER.brandTail}
            </span>
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            {FOOTER.description}
          </p>
        </div>

        <nav className="flex flex-col gap-5" aria-label="Recorrido del landing">
          <h2 className="tech-label">{FOOTER.quickLinksTitle}</h2>
          <ul className="flex flex-col gap-3">
            {FOOTER.quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-mist transition-colors hover:text-blue-bright"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-5">
          <h2 className="tech-label">{FOOTER.contactTitle}</h2>
          <ul className="flex flex-col gap-4 text-sm text-mist">
            <li className="flex items-center gap-3">
              <LineIcon
                name="whatsapp"
                className="h-4 w-4 shrink-0 text-blue-bright"
              />
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-blue-bright"
              >
                {CONTACT.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <LineIcon
                name="mail"
                className="h-4 w-4 shrink-0 text-blue-bright"
              />
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all transition-colors hover:text-blue-bright"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <LineIcon
                name="pin"
                className="h-4 w-4 shrink-0 text-blue-bright"
              />
              <span>{FOOTER.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-7">
        <p className="mono-num mx-auto max-w-6xl px-6 text-center text-[0.66rem] uppercase tracking-[0.2em] text-mist-dim">
          © {new Date().getFullYear()} {FOOTER.rights}
        </p>
      </div>
    </footer>
  );
}
