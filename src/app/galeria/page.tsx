import type { Metadata } from "next";
import Link from "next/link";
import { SHARED_AUTHOR } from "@/lib/variants-content";

/*
  Galería de exploración de las tres landings experimentales del Diplomado en Public
  Speaking UTMACH. Página índice (no indexable) para comparar las direcciones creativas
  lado a lado durante la auditoría visual y la decisión de dirección. Cada tarjeta enlaza
  a su ruta /v/<slug>. No interfiere con el landing v1 de producción en "/".
*/

export const metadata: Metadata = {
  title: "Galería · Direcciones de landing | Diplomado Public Speaking UTMACH",
  description:
    "Tres direcciones creativas interactivas para el landing del Diplomado en Public Speaking de la Universidad Técnica de Machala.",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    slug: "sintesis",
    index: "04",
    name: "La Síntesis",
    mechanic: "Combinación curada de las tres",
    description:
      "El Orador Integral: hero cinético bajo el haz de luz, onda de voz como hilo conductor y módulos iluminados por el reflector. Cada mecánica en su mejor momento.",
    accent: "var(--color-gold)",
  },
  {
    slug: "voz",
    index: "01",
    name: "La Voz",
    mechanic: "Scrollytelling de onda de voz",
    description:
      "Una forma de onda recorre la página: arranca temblorosa y se estabiliza al hacer scroll. El avance es el viaje de ganar dominio de la palabra.",
    accent: "var(--color-gold)",
  },
  {
    slug: "escenario",
    index: "02",
    name: "El Escenario",
    mechanic: "Cursor reflector / spotlight",
    description:
      "La página está a oscuras como un teatro; el cursor es un reflector que ilumina el contenido. Pasar al frente, que la luz caiga sobre ti.",
    accent: "var(--color-blue-bright)",
  },
  {
    slug: "palabra",
    index: "03",
    name: "La Palabra",
    mechanic: "Tipografía cinética",
    description:
      "El texto es el protagonista. Las frases se ensamblan letra a letra y las palabras toman autoridad. Registro brutalista-editorial.",
    accent: "var(--color-gold-soft)",
  },
] as const;

export default function GaleriaPage() {
  return (
    <main className="grain relative min-h-[100dvh] overflow-hidden bg-[color:var(--color-abyss)] px-6 py-20 md:px-12 md:py-28">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-16 max-w-3xl">
          <p className="tech-label mb-5">Diplomado Public Speaking · UTMACH</p>
          <h1 className="font-serif text-[length:var(--text-section)] font-semibold leading-[1.05] text-[color:var(--color-paper)]">
            Tres direcciones,{" "}
            <span className="serif-accent serif-accent--italic text-[color:var(--color-gold)]">
              una sola palabra
            </span>{" "}
            que importa.
          </h1>
          <p className="mt-6 max-w-2xl text-[color:var(--color-mist)] leading-relaxed">
            Cada landing encarna el mensaje del diplomado con una mecánica interactiva
            distinta. Explóralas y elige la dirección.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {VARIANTS.map((variant) => (
            <li key={variant.slug}>
              <Link
                href={`/v/${variant.slug}`}
                className="card-tech focus-ring group flex h-full flex-col justify-between p-7 no-underline"
                style={{ borderRadius: 2 }}
              >
                <div>
                  <span
                    className="mono-num text-sm font-medium"
                    style={{ color: variant.accent }}
                  >
                    {variant.index}
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-[color:var(--color-paper)]">
                    {variant.name}
                  </h2>
                  <p className="tech-label mt-2 !text-[0.62rem] !tracking-[0.2em] text-[color:var(--color-mist-dim)]">
                    {variant.mechanic}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-mist)]">
                    {variant.description}
                  </p>
                </div>
                <span
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: variant.accent }}
                >
                  Ver landing
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mt-20 flex items-center justify-between border-t border-[color:var(--color-line)] pt-6">
          <Link
            href="/"
            className="focus-ring text-sm text-[color:var(--color-mist-dim)] no-underline hover:text-[color:var(--color-paper)]"
          >
            ← Landing v1 (producción)
          </Link>
          <span className="mono-num text-xs text-[color:var(--color-gold-deep)]">
            {SHARED_AUTHOR.studio} · {SHARED_AUTHOR.year}
          </span>
        </footer>
      </div>
    </main>
  );
}
