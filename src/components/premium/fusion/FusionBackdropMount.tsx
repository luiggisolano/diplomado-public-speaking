"use client";

/*
  Montador del fondo nube de la dirección "Fusión". Espeja la guarda de CamaraFieldMount
  (soporte WebGL + preferencia de movimiento) pero, en lugar del campo de partículas de
  Cámara, carga la nube sónica (FusionCloud) con next/dynamic { ssr: false } para no
  ejecutar WebGL en servidor ni inflar el bundle inicial. Sin WebGL o con reduced-motion
  no monta el lienzo y deja el degradado estático de respaldo definido en fusion.css.
*/

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isWebglAvailable } from "@/components/premium/_shared/oglScene";
import { useReducedMotion } from "@/components/premium/_shared/useReducedMotion";

const FusionCloud = dynamic(
  () => import("./FusionCloud").then((module) => module.FusionCloud),
  { ssr: false },
);

export function FusionBackdropMount() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setWebglSupported(isWebglAvailable());
  }, []);

  const shouldRenderCloud =
    isMounted && webglSupported && !prefersReducedMotion;

  return (
    <div className="fus-backdrop" aria-hidden="true">
      {shouldRenderCloud ? <FusionCloud /> : null}
    </div>
  );
}
