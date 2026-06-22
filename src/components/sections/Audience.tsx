"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { useReveal } from "@/components/motion/useReveal";
import { AUDIENCE } from "@/lib/content";

/*
  Bloque 5 — Para quién es, en el sistema "Aula Futura". Encabezado centrado y una rejilla de
  paneles de perfil card-tech que se reacomoda sola. Cada panel abre con un índice mono azul
  como guía de catálogo académico. Revelado on-scroll escalonado.
*/

export default function Audience() {
  const headerRef = useReveal<HTMLDivElement>();
  const cardsRef = useReveal<HTMLDivElement>({ staggerMs: 90 });

  return (
    <section className="stage-a relative py-[var(--space-section)]">
      <div ref={headerRef} className="mx-auto max-w-3xl px-6 text-center">
        <SectionHeading
          eyebrow={AUDIENCE.eyebrow}
          title={AUDIENCE.title}
          align="center"
        />
      </div>

      <div
        ref={cardsRef}
        className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {AUDIENCE.profiles.map((profile, index) => (
          <article
            key={profile.name}
            data-reveal="rise"
            className="card-tech reveal-init flex flex-col gap-3 rounded-xl p-7 sm:p-8"
          >
            <span
              className="mono-num text-sm font-semibold text-blue-bright/60"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-lg font-semibold leading-snug text-paper">
              {profile.name}
            </h3>
            <p className="text-sm leading-relaxed text-mist">
              {profile.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
