import Hero from "@/components/Hero";

/*
  Composición del landing. Fase 1 entrega únicamente el Hero (Bloque 1).
  Las fases siguientes agregan los bloques 2..11 como secciones independientes,
  cada una con su propio componente, sin alterar este ensamblado.
*/

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
