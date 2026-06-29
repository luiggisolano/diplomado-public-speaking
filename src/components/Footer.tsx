import Image from "next/image";
import GoldButton from "./GoldButton";
import { CTA_LINK, CONTACT, SEO } from "@/lib/constants";
import { WhatsappLogo, Envelope } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-ink border-t border-line/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <p className="font-display text-3xl sm:text-4xl font-semibold text-cream leading-[1.05] mb-2">
              Puedes ser el mejor en lo que haces.
            </p>
            <p className="font-display text-3xl sm:text-4xl font-semibold text-gold leading-[1.05] mb-8">
              Si no sabes comunicarlo, nadie lo notará.
            </p>
            <GoldButton href={CTA_LINK} size="lg">
              Asegurar mi cupo
            </GoldButton>
            <p className="mt-4 text-[12px] text-muted">
              Inscripciones abiertas · Cupos limitados · Inicio en julio
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/70 mb-4">
              Contacto directo
            </p>
            <a
              href={CTA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors">
                <WhatsappLogo size={18} weight="light" className="text-gold/60" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted mb-0.5">WhatsApp</p>
                <p className="text-cream text-[15px] font-medium group-hover:text-gold transition-colors">
                  {CONTACT.whatsapp}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors">
                <Envelope size={18} weight="light" className="text-gold/60" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted mb-0.5">Correo</p>
                <p className="text-cream text-[15px] font-medium group-hover:text-gold transition-colors">
                  {CONTACT.email}
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-line/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/logo-utmach.png"
              alt="Universidad Técnica de Machala"
              width={36}
              height={36}
              className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            <p className="text-muted/60 text-[12px]">{CONTACT.institution}</p>
          </a>
          <p className="text-muted/40 text-[11px]">
            {SEO.title}
          </p>
        </div>
      </div>
    </footer>
  );
}
