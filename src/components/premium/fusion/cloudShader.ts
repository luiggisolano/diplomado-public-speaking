/*
  Nube de la dirección "Fusión". Reutiliza el fragment shader de bandas con domain warping
  de Sónica, pero sube su intensidad para que el fondo animado se lea más bajo el contenido
  (ahora que el velo de las secciones es más abierto). Se deriva por transformación de la
  cadena GLSL —no se duplica el shader ni se toca la dirección Sónica—: se aclara el
  oscurecimiento de la viñeta y se sube la ganancia global de color.
*/

import { SONICA_BACKDROP_FRAGMENT } from "@/components/premium/sonica/shaders";

export const FUSION_CLOUD_FRAGMENT = SONICA_BACKDROP_FRAGMENT
  .replace("col *= mix(0.28, 1.0, vignette);", "col *= mix(0.55, 1.0, vignette);")
  .replace("col *= 0.62;", "col *= 1.0;");
