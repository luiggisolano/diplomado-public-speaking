/*
  Ruta /g/reflector — dirección de arte CLARA del Diplomado en Public Speaking (UTMACH).
  Server Component: conserva la metadata (no indexable mientras la gama alta se evalúa) e
  importa la hoja de estilos scoped de la dirección. La composición e interacción viven en
  ReflectorLanding ("use client"), que a su vez monta el haz WebGL con ssr:false.
*/

import type { Metadata } from "next";
import { ReflectorLanding } from "@/components/premium/reflector/ReflectorLanding";
import "./reflector.css";

export const metadata: Metadata = {
  title: "Reflector · Diplomado Public Speaking UTMACH",
  robots: { index: false, follow: false },
};

export default function ReflectorPage() {
  return <ReflectorLanding />;
}
