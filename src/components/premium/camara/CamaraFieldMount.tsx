"use client";

/*
  Montador del campo de presión sonora. Decide en cliente si procede la escena WebGL
  o el fallback estático. La escena OGL se carga con next/dynamic { ssr: false } para
  no ejecutar nada de WebGL en servidor y para no inflar el bundle inicial de la ruta.
  La guarda combina soporte de WebGL y preferencia de movimiento: si el usuario pide
  menos movimiento o el dispositivo no tiene WebGL, se muestra la retícula estática y
  legible en lugar de la nube animada.
*/

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isWebglAvailable } from "@/components/premium/_shared/oglScene";
import { useReducedMotion } from "@/components/premium/_shared/useReducedMotion";

const AnechoicField = dynamic(
  () => import("./AnechoicField").then((module) => module.AnechoicField),
  { ssr: false },
);

export function CamaraFieldMount() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setWebglSupported(isWebglAvailable());
  }, []);

  const shouldRenderField =
    isMounted && webglSupported && !prefersReducedMotion;

  return (
    <div className="cam-field" aria-hidden="true">
      {shouldRenderField ? (
        <AnechoicField />
      ) : (
        <div className="cam-field-fallback" />
      )}
    </div>
  );
}
