"use client";

/*
  SkipLink — enlace de salto accesible para teclado.
  Componente cliente porque necesita onFocus/onBlur para hacerse visible.
  Se renderiza fuera del flujo visual; aparece solo al recibir foco.
*/

export function SkipLink() {
  return (
    <a
      href="#contenido-principal"
      className="esc-cta"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "1rem",
        zIndex: 9999,
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.left = "1rem";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.left = "-9999px";
      }}
    >
      Saltar al contenido
    </a>
  );
}
