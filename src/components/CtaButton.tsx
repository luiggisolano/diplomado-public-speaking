import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/lib/content";

/*
  CTA principal reutilizable. Mismo destino en sus tres apariciones (hero, post-stack
  de valor, cierre final). Acepta microcopy de urgencia que se renderiza bajo el botón.
  Server Component: sin estado ni animación propia. Variante de tamaño para el cierre.
*/

type CtaButtonProps = {
  microcopy?: string;
  size?: "default" | "large";
  className?: string;
};

const SIZE_CLASSNAMES = {
  default: "px-9 py-4 text-sm",
  large: "px-11 py-5 text-base",
} as const;

export function CtaButton({
  microcopy,
  size = "default",
  className,
}: CtaButtonProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className ?? ""}`}>
      <a
        href={PRIMARY_CTA_HREF}
        className={`group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-blue-bright to-blue font-semibold tracking-wide text-paper transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(77,147,245,0.6)] ${SIZE_CLASSNAMES[size]}`}
      >
        {PRIMARY_CTA_LABEL}
        <span
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        >
          →
        </span>
      </a>
      {microcopy ? (
        <p className="max-w-md text-center text-xs leading-relaxed text-mist-dim">
          {microcopy}
        </p>
      ) : null}
    </div>
  );
}
