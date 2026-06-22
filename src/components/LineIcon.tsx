/*
  Set de íconos lineales del landing. SVG limpios inline, trazo uniforme heredado de
  currentColor, sin dependencias ni Material Symbols por CDN. Color asignado por el contexto
  que los invoca (azul o dorado del sistema "Aula Futura"), por lo que aquí no se fija ninguno.
  Decorativos: el significado vive en el texto adyacente, por eso van aria-hidden.
*/

type LineIconName =
  | "spark"
  | "voice"
  | "eye-off"
  | "target"
  | "brain"
  | "stage"
  | "block"
  | "check"
  | "seal"
  | "alarm"
  | "whatsapp"
  | "mail"
  | "pin"
  | "arrow-right";

type LineIconProps = {
  name: LineIconName;
  className?: string;
  strokeWidth?: number;
};

const DEFAULT_STROKE_WIDTH = 1.5;

const ICON_PATHS: Record<LineIconName, React.ReactNode> = {
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1Z" />
    </>
  ),
  voice: (
    <>
      <path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.7 9.7 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-2.3 2.9" />
      <path d="M6.2 7.4A15.7 15.7 0 0 0 3 12s4 6 9 6a9.4 9.4 0 0 0 3.4-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20" />
    </>
  ),
  brain: (
    <>
      <path d="M12 3a6 6 0 0 0-6 6c0 2 .8 3.2 1.8 4.3.8.9 1.2 1.6 1.2 2.7v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1c0-1.1.4-1.8 1.2-2.7C17.2 12.2 18 11 18 9a6 6 0 0 0-6-6Z" />
      <path d="M9.5 21h5" />
    </>
  ),
  stage: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6" />
      <path d="M7 10h10" />
      <path d="M12 13l-3 8" />
      <path d="M12 13l3 8" />
    </>
  ),
  block: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M6.3 6.3l11.4 11.4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" />
    </>
  ),
  seal: (
    <>
      <path d="M12 2.6l2.3 1.7 2.8-.4 1 2.7 2.4 1.5-.8 2.8.8 2.8-2.4 1.5-1 2.7-2.8-.4L12 21.4l-2.3-1.7-2.8.4-1-2.7-2.4-1.5.8-2.8-.8-2.8 2.4-1.5 1-2.7 2.8.4Z" />
      <path d="M9 12l2 2 4-4.2" />
    </>
  ),
  alarm: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 10v3l2 1.6" />
      <path d="M5 3.5 2.5 6M19 3.5 21.5 6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 11.6A8 8 0 1 1 6.4 6a8 8 0 0 1 13.6 5.6Z" />
      <path d="M4.5 20l1.5-4.3" />
      <path d="M9 9.2c-.3 1.6 1.2 4 2.6 5 1.4 1 3.6 1.4 4.4.4.3-.4.2-.9-.2-1.2l-1.4-.9c-.3-.2-.7-.1-.9.2l-.3.4c-.9-.4-1.7-1.2-2.1-2.1l.4-.3c.3-.2.4-.6.2-.9l-.9-1.4c-.3-.4-.9-.5-1.3-.1-.4.4-.7.9-.7 1.6Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
};

export function LineIcon({
  name,
  className,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}: LineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
