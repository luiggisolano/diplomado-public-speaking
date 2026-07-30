/*
  Cámara Anecoica — /g/camara. Dirección de arte de gama alta para la landing del
  Diplomado en Public Speaking UTMACH. El laboratorio silencioso de la voz: una sala
  anecoica reimaginada como instrumento de precisión. Un campo de partículas WebGL
  (presión sonora) respira detrás del contenido y coalesce del ruido disperso a una
  onda coherente conforme el usuario desciende, metáfora del dominio de la palabra.

  Esta página es un Server Component: exporta metadata (robots noindex, aún en
  exploración) y compone las secciones. Toda la interacción, WebGL y motion vive en
  componentes cliente bajo components/premium/camara. El copy proviene íntegro de
  lib/variants-content (fuente única). Scroll suave, revelado tipográfico y respeto a
  prefers-reduced-motion se apoyan en la infraestructura _shared compartida.
*/

import type { Metadata } from "next";
import "./camara.css";

import { SmoothScroll } from "@/components/premium/_shared/SmoothScroll";
import { CamaraFieldMount } from "@/components/premium/camara/CamaraFieldMount";
import { CoalesceHud } from "@/components/premium/camara/CoalesceHud";
import { Hero } from "@/components/premium/camara/Hero";
import { RevealText } from "@/components/premium/camara/RevealText";
import { Reveal } from "@/components/premium/camara/Reveal";
import { StatCounter } from "@/components/premium/camara/StatCounter";
import { MethodConsole } from "@/components/premium/camara/MethodConsole";
import { Faq } from "@/components/premium/camara/Faq";
import { CamaraSignature } from "@/components/premium/camara/CamaraSignature";
import {
  SHARED_AUDIENCE,
  SHARED_CLOSE,
  SHARED_CONTACT,
  SHARED_CTA,
  SHARED_FACTS,
  SHARED_MODULES,
  SHARED_PROMISE,
  SHARED_STATS,
  SHARED_TRANSFORMATION,
  SHARED_URGENCY,
  SHARED_FAQ,
} from "@/lib/variants-content";

export const metadata: Metadata = {
  title: "Cámara Anecoica · Diplomado Public Speaking UTMACH",
  robots: { index: false, follow: false },
};

const SECTION_HEADLINE_CLASS =
  "font-serif text-[var(--text-section)] font-medium leading-[1.06] tracking-[-0.02em] text-paper";

export default function CamaraPage() {
  return (
    <div className="cam-root">
      <CamaraFieldMount />
      <div className="cam-grain" aria-hidden="true" />
      <CoalesceHud />

      <SmoothScroll>
        <main>
          <Hero />

          <section
            aria-label="Datos del diplomado"
            className="relative z-[1] bg-navy-deep"
          >
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
              <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
                {SHARED_STATS.map((stat) => (
                  <div key={stat.label} className="bg-navy-deep p-6 md:p-8">
                    <p className="font-mono text-[clamp(2.5rem,1.8rem+2vw,3.5rem)] leading-none text-paper">
                      <StatCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="tech-label mt-4">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="promise-title"
            className="relative z-[1] bg-abyss"
          >
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
              <Reveal>
                <p className="tech-label">{SHARED_PROMISE.eyebrow}</p>
              </Reveal>
              <RevealText
                as="h2"
                id="promise-title"
                text={SHARED_PROMISE.headline}
                className={`mt-6 max-w-3xl ${SECTION_HEADLINE_CLASS}`}
              />
              <Reveal delay={0.05}>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
                  {SHARED_PROMISE.body}
                </p>
              </Reveal>
            </div>
          </section>

          <section
            aria-label="Módulos del diplomado"
            className="relative z-[1] bg-navy-deep"
          >
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
              <Reveal>
                <p className="tech-label">Seis disciplinas · seis especialistas</p>
              </Reveal>
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {SHARED_MODULES.map((module, index) => (
                  <Reveal key={module.key} delay={index * 0.04}>
                    <article className="card-tech flex h-full flex-col p-7">
                      <span className="font-mono text-sm text-blue-bright">
                        {module.n}
                      </span>
                      <h3 className="mt-5 font-serif text-2xl tracking-[-0.01em] text-paper">
                        {module.title}
                      </h3>
                      <p className="mt-3 text-[0.98rem] leading-relaxed text-mist">
                        {module.line}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="cam-band" aria-hidden="true">
            <div className="mx-auto max-w-6xl px-6">
              <div className="cam-band-line font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
                <span className="whitespace-nowrap text-blue-bright">
                  Señal · presión sonora
                </span>
                <div className="cam-band-ticks" />
                <span className="whitespace-nowrap">Campo en coalescencia</span>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="audience-title"
            className="relative z-[1] bg-abyss"
          >
            <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:py-36 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <Reveal>
                  <p className="tech-label">{SHARED_AUDIENCE.eyebrow}</p>
                </Reveal>
                <RevealText
                  as="h2"
                  id="audience-title"
                  text={SHARED_AUDIENCE.headline}
                  className={`mt-6 max-w-md ${SECTION_HEADLINE_CLASS}`}
                />
              </div>
              <Reveal className="border-t border-line">
                {SHARED_AUDIENCE.profiles.map((profile, index) => (
                  <div key={profile} className="cam-audience-row text-mist">
                    <span className="font-mono text-sm text-blue-bright">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-xl md:text-2xl">
                      {profile}
                    </span>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          <section
            aria-labelledby="transformation-title"
            className="relative z-[1] bg-navy-deep"
          >
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
              <Reveal>
                <p className="tech-label">{SHARED_TRANSFORMATION.eyebrow}</p>
              </Reveal>
              <RevealText
                as="h2"
                id="transformation-title"
                text={SHARED_TRANSFORMATION.headline}
                className={`mt-6 max-w-2xl ${SECTION_HEADLINE_CLASS}`}
              />

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <Reveal>
                  <div className="cam-diff h-full">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
                      Señal de entrada
                    </p>
                    <div className="mt-5">
                      {SHARED_TRANSFORMATION.before.map((item) => (
                        <div key={item} className="cam-diff-item">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full border border-mist-dim"
                            aria-hidden="true"
                          />
                          <p className="text-[0.98rem] leading-relaxed text-mist">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="cam-diff cam-diff--tuned h-full">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-blue-bright">
                      Señal calibrada
                    </p>
                    <div className="mt-5">
                      {SHARED_TRANSFORMATION.after.map((item) => (
                        <div key={item} className="cam-diff-item">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-bright"
                            aria-hidden="true"
                          />
                          <p className="text-[0.98rem] leading-relaxed text-paper">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.05}>
                <figure className="mx-auto mt-20 max-w-3xl text-center">
                  <blockquote className="font-serif text-[clamp(1.6rem,1.1rem+1.8vw,2.5rem)] italic leading-snug text-paper">
                    “{SHARED_TRANSFORMATION.quote}”
                  </blockquote>
                  <figcaption className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
                    Laboratorio de la voz
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </section>

          <MethodConsole />

          <section
            aria-label="Ficha técnica del diplomado"
            className="relative z-[1] bg-navy-deep"
          >
            <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:py-36 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Reveal>
                  <p className="tech-label">Ficha técnica</p>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-6 max-w-xs font-mono text-sm uppercase tracking-[0.16em] text-mist-dim">
                    Datos de la cohorte
                  </p>
                </Reveal>
              </div>
              <Reveal>
                <div className="cam-panel">
                  {SHARED_FACTS.map((fact) => (
                    <div key={fact.label} className="cam-spec-row">
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-mist-dim">
                        {fact.label}
                      </span>
                      <span className="font-mono text-base text-paper">
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          <section
            aria-labelledby="urgency-title"
            className="relative z-[1] bg-abyss"
          >
            <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
              <Reveal>
                <p className="tech-label">{SHARED_URGENCY.eyebrow}</p>
              </Reveal>
              <RevealText
                as="h2"
                id="urgency-title"
                text={SHARED_URGENCY.headline}
                className={`mt-6 max-w-3xl ${SECTION_HEADLINE_CLASS}`}
              />
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {SHARED_URGENCY.reasons.map((reason, index) => (
                  <Reveal key={reason.t} delay={index * 0.05}>
                    <article className="card-tech flex h-full flex-col p-7">
                      <span className="font-mono text-sm text-blue-bright">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-5 font-serif text-xl tracking-[-0.01em] text-paper">
                        {reason.t}
                      </h3>
                      <p className="mt-3 text-[0.98rem] leading-relaxed text-mist">
                        {reason.d}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="faq-title"
            className="relative z-[1] bg-navy-deep"
          >
            <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:py-36 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Reveal>
                  <p className="tech-label">Preguntas frecuentes</p>
                </Reveal>
                <RevealText
                  as="h2"
                  id="faq-title"
                  text="Lo que necesitas saber antes de inscribirte."
                  className={`mt-6 max-w-xs ${SECTION_HEADLINE_CLASS}`}
                />
              </div>
              <Reveal>
                <Faq items={SHARED_FAQ} />
              </Reveal>
            </div>
          </section>

          <section
            id="inscripcion"
            aria-labelledby="close-title"
            className="cam-band py-24 md:py-36"
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(80% 62% at 50% 42%, color-mix(in oklch, var(--color-abyss) 74%, transparent), transparent 72%)",
              }}
            />
            <div className="relative mx-auto max-w-4xl px-6 text-center">
              <RevealText
                as="h2"
                id="close-title"
                text={SHARED_CLOSE.headline}
                className={`mx-auto max-w-3xl ${SECTION_HEADLINE_CLASS}`}
              />
              <Reveal delay={0.05}>
                <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-mist-dim">
                  {SHARED_CLOSE.microcopy}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="relative mx-auto mt-14 max-w-xl border border-line-strong bg-[color-mix(in_oklch,var(--color-navy-deep)_88%,transparent)] p-8 text-left backdrop-blur-md">
                  <span
                    className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-blue-bright"
                    aria-hidden="true"
                  />
                  <p className="tech-label">Inscripción abierta</p>

                  <div className="mt-7 flex flex-col gap-3">
                    <a
                      href={SHARED_CONTACT.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cam-btn-primary justify-center focus-ring"
                    >
                      {SHARED_CTA.whatsapp}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 13.5l1-2.6A5 5 0 1113 8a5 5 0 01-7.4 4.4l-3.1 1.1z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                    <a
                      href={`mailto:${SHARED_CONTACT.email}`}
                      className="cam-btn-ghost justify-center focus-ring"
                    >
                      Escribir por correo
                    </a>
                  </div>

                  <dl className="mt-8 space-y-3 border-t border-line pt-6 font-mono text-xs text-mist-dim">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="uppercase tracking-[0.18em]">WhatsApp</dt>
                      <dd className="text-mist">{SHARED_CONTACT.whatsapp}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="uppercase tracking-[0.18em]">Correo</dt>
                      <dd className="truncate text-mist">
                        {SHARED_CONTACT.email}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="uppercase tracking-[0.18em]">Avala</dt>
                      <dd className="text-mist">{SHARED_CONTACT.institution}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <CamaraSignature />
      </SmoothScroll>
    </div>
  );
}
