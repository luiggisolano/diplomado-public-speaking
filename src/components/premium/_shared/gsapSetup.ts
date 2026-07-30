"use client";

/*
  Registro centralizado de los plugins de GSAP para las landings de gama alta.
  ScrollTrigger (scroll-driven scrubbing y pinning) y SplitText (revelado tipográfico
  palabra a palabra) se registran una sola vez. Desde GSAP 3.13 ambos plugins son
  gratuitos y viven en el paquete principal, sin necesidad del bonus de Club GSAP.

  Llamar a registerGsapPlugins() dentro de un efecto de cliente antes de crear
  cualquier timeline. Es idempotente: registrar dos veces no tiene efecto secundario.
*/

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let pluginsRegistered = false;

export function registerGsapPlugins(): void {
  if (pluginsRegistered || typeof window === "undefined") {
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  pluginsRegistered = true;
}

export { gsap, ScrollTrigger, SplitText };
