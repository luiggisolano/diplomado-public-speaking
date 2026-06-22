import { SpokenHeadline } from "@/components/motion/SpokenHeadline";

/*
  Encabezado de sección. Combina el eyebrow (etiqueta técnica en mono azul con filete) y el
  titular animado palabra por palabra (motion-firma). Acepta una palabra-acento opcional que
  se renderiza en serif cursivo ámbar, el recurso de énfasis del sistema Aula Futura. La
  escala usa el token fluido --text-section para dar jerarquía dramática. Centraliza tipografía
  y ritmo para que todos los bloques compartan el sistema.
*/

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
};

const ALIGN_CLASSNAMES = {
  left: "items-start text-left",
  center: "items-center text-center",
} as const;

const EYEBROW_ALIGN_CLASSNAMES = {
  left: "justify-start",
  center: "justify-center",
} as const;

export function SectionHeading({
  eyebrow,
  title,
  accent,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col ${ALIGN_CLASSNAMES[align]}`}>
      <p
        className={`tech-label mb-5 flex items-center gap-3 ${EYEBROW_ALIGN_CLASSNAMES[align]}`}
      >
        <span className="inline-block h-px w-7 bg-blue-bright/50" aria-hidden />
        {eyebrow}
      </p>
      <SpokenHeadline
        text={title}
        accent={accent}
        as="h2"
        className="max-w-3xl font-serif text-[length:var(--text-section)] font-semibold leading-[1.08] tracking-[-0.02em] text-paper"
        accentClassName="serif-accent serif-accent--italic font-normal text-gold"
      />
    </div>
  );
}
