"use client";

/*
  Componente de split de texto para tipografía cinética.
  Envuelve cada carácter o palabra en un span .pal-char / .pal-word
  con aria-hidden; el contenedor lleva aria-label con el texto completo
  para que los lectores de pantalla lean el texto original.

  El estado de reposo es completamente visible: la animación solo ocurre
  si el IntersectionObserver dispara y anime.js está disponible.
*/

import React from "react";

interface SplitTextProps {
  text: string;
  mode: "chars" | "words";
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  wordClassName?: string;
}

export function SplitText({
  text,
  mode,
  className,
  as: Tag = "span",
  wordClassName,
}: SplitTextProps) {
  if (mode === "chars") {
    return (
      <Tag className={className} aria-label={text}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="pal-char"
            aria-hidden="true"
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </Tag>
    );
  }

  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            className={`pal-word${wordClassName ? " " + wordClassName : ""}`}
            aria-hidden="true"
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span aria-hidden="true" style={{ display: "inline" }}>
              {" "}
            </span>
          )}
        </React.Fragment>
      ))}
    </Tag>
  );
}
