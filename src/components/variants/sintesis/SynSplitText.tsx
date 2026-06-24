"use client";

/*
  SplitText adaptado para la variante "La Síntesis".
  Genera spans .syn-char (modo chars) o .syn-word (modo words) con aria-hidden;
  el contenedor lleva aria-label con el texto original para lectores de pantalla.
  Estado de reposo: completamente visible — el JS de useSynSplitReveal configura
  el estado inicial (opacity 0 / translateY) al montar.
*/

import React from "react";

interface SynSplitTextProps {
  text: string;
  mode: "chars" | "words";
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  wordClassName?: string;
}

export function SynSplitText({
  text,
  mode,
  className,
  as: Tag = "span",
  wordClassName,
}: SynSplitTextProps) {
  if (mode === "chars") {
    return (
      <Tag className={className} aria-label={text}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="syn-char"
            aria-hidden="true"
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? " " : char}
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
            className={`syn-word${wordClassName ? " " + wordClassName : ""}`}
            aria-hidden="true"
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span aria-hidden="true" style={{ display: "inline" }}>
              {" "}
            </span>
          )}
        </React.Fragment>
      ))}
    </Tag>
  );
}
