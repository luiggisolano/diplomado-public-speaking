"use client";

import { useEffect, useRef } from "react";

/*
  HeroBeam — haz de luz dorado que cae desde el techo al montar la página.
  Animación de entrada: el beam crece hacia abajo con una transición CSS.
  Respeta prefers-reduced-motion mostrando el haz estático desde el inicio.
*/

export function HeroBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const coneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const beam = beamRef.current;
    const cone = coneRef.current;

    if (!beam || !cone) return;

    if (reduceMotion) {
      beam.classList.add("esc-ceiling-beam--expanded");
      cone.classList.add("esc-beam-cone--visible");
      return;
    }

    const timeout = setTimeout(() => {
      beam.classList.add("esc-ceiling-beam--expanded");
      cone.classList.add("esc-beam-cone--visible");
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div ref={beamRef} className="esc-ceiling-beam" aria-hidden="true" />
      <div ref={coneRef} className="esc-beam-cone" aria-hidden="true" />
    </>
  );
}
