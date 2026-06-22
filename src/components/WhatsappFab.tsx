import { LineIcon } from "@/components/LineIcon";
import { CONTACT } from "@/lib/content";

/*
  Botón flotante de contacto por WhatsApp, anclado abajo a la derecha. Conserva el verde
  oficial de WhatsApp para reconocimiento inmediato, pero lo armoniza con el sistema "Aula
  Futura" mediante un anillo navy y un panel navy-raised en reposo que invierte al verde de
  marca al hover. Server Component: enlace directo a wa.me sin estado. Etiqueta accesible
  explícita porque el ícono es decorativo.
*/

const WHATSAPP_BRAND_GREEN = "#25d366";

export function WhatsappFab() {
  return (
    <a
      href={CONTACT.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp al Centro de Educación Continua"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-navy-raised shadow-[0_18px_44px_-16px_rgba(3,8,22,0.95)] ring-2 ring-navy transition-all duration-300 hover:scale-110 hover:border-transparent active:scale-95"
      style={{ color: WHATSAPP_BRAND_GREEN }}
    >
      <LineIcon name="whatsapp" className="h-6 w-6" strokeWidth={1.6} />
    </a>
  );
}
