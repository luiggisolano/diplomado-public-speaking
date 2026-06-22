/*
  Íconos lineales para las seis fichas de módulo del sistema "Aula Futura". SVG limpios, sin
  emojis, trazo uniforme heredado de currentColor (el color azul o dorado lo fija la ficha que
  los invoca). Cada clave mapea a una dimensión del comunicador integral. Decorativos: el
  significado vive en el título de la ficha.
*/

type ModuleIconKey =
  | "psicologia"
  | "retorica"
  | "voz"
  | "performance"
  | "imagen"
  | "liderazgo";

type ModuleIconProps = {
  name: ModuleIconKey;
  className?: string;
};

const STROKE_WIDTH = 1.5;

const ICON_PATHS: Record<ModuleIconKey, React.ReactNode> = {
  psicologia: (
    <>
      <path d="M12 3a6 6 0 0 0-6 6c0 2 .8 3.2 1.8 4.3.8.9 1.2 1.6 1.2 2.7v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1c0-1.1.4-1.8 1.2-2.7C17.2 12.2 18 11 18 9a6 6 0 0 0-6-6Z" />
      <path d="M9.5 21h5" />
    </>
  ),
  retorica: (
    <>
      <path d="M4 5h16v10H9l-4 4v-4H4Z" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
    </>
  ),
  voz: (
    <>
      <path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </>
  ),
  performance: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6" />
      <path d="M7 10h10" />
      <path d="M12 13l-3 8" />
      <path d="M12 13l3 8" />
    </>
  ),
  imagen: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
    </>
  ),
  liderazgo: (
    <>
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M12 4v-1" />
    </>
  ),
};

export function ModuleIcon({ name, className }: ModuleIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
