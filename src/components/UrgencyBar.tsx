import { LineIcon } from "@/components/LineIcon";
import { URGENCY_BAR } from "@/lib/content";

/*
  Barra superior de urgencia del sistema "Aula Futura". Franja con gradiente azul
  institucional sobre la nav que comunica el aviso de inscripciones. El texto va en mono
  técnica versalita (registro de marquesina de panel de instrumentos). Server Component:
  texto estático, sin estado ni animación. El contraste paper sobre el azul cumple AA.
*/

export function UrgencyBar() {
  return (
    <div className="relative z-[60] flex w-full items-center justify-center gap-2.5 bg-gradient-to-r from-blue to-blue-bright px-4 py-2 text-center text-paper">
      <LineIcon name="alarm" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:text-xs">
        {URGENCY_BAR.message}
        <span className="mx-2 hidden opacity-60 sm:inline" aria-hidden>
          ·
        </span>
        <span className="hidden font-medium sm:inline">
          {URGENCY_BAR.emphasis}
        </span>
      </p>
    </div>
  );
}
