import type { Metadata } from "next";
import "./voz.css";

import { VozHero }            from "@/components/variants/voz/VozHero";
import { VozScrollWave }      from "@/components/variants/voz/VozScrollWave";
import { VozRevealSection }   from "@/components/variants/voz/VozRevealSection";
import { VozFaq }             from "@/components/variants/voz/VozFaq";
import { VozAuthorSignature } from "@/components/variants/voz/VozAuthorSignature";

import {
  SHARED_PROMISE,
  SHARED_MODULES,
  SHARED_TRANSFORMATION,
  SHARED_METHOD,
  SHARED_AUDIENCE,
  SHARED_FACTS,
  SHARED_URGENCY,
  SHARED_CLOSE,
  SHARED_CONTACT,
  SHARED_CTA,
} from "@/lib/variants-content";

/*
  Variante experimental "La Voz" — scrollytelling de onda de voz.
  Una forma de onda es el hilo conductor de la página: arranca temblorosa
  (orador inseguro) y con el scroll se estabiliza, engrosa y gana amplitud
  rítmica (voz con autoridad). El scroll = el viaje de ganar dominio de la palabra.

  Orden de secciones: Hero → Promesa → 6 Módulos → Transformación → Metodología
  → Público → Ficha académica → Urgencia → FAQ → Cierre CTA → Firma LS.

  Todo el copy proviene de @/lib/variants-content.ts — cero texto hardcodeado.
  Componentes bajo src/components/variants/voz/ para aislamiento total.
  CSS co-localizado en voz.css con prefijo .voz-*.
*/

export const metadata: Metadata = {
  title: "La Voz — Diplomado Public Speaking · UTMACH | Variante experimental",
  description:
    "Scrollytelling de onda vocal. Diplomado en Public Speaking y Comunicación Persuasiva, Universidad Técnica de Machala. 160 h, 10 créditos, 100% en línea.",
};

export default function VozPage() {
  return (
    <>
      {/* Skip link de accesibilidad */}
      <a
        href="#main-content"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[color:var(--color-navy)] focus:px-4 focus:py-2 focus:text-sm focus:text-[color:var(--color-paper)]"
      >
        Ir al contenido principal
      </a>

      <main id="main-content">

        {/* ─── HERO ─── */}
        <VozHero />

        {/* Onda de transición */}
        <VozScrollWave />

        {/* ─── PROMESA ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-navy-deep)] px-6 py-24"
          id="promesa"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              data-voz-reveal
              className="tech-label mb-6 text-[color:var(--color-blue-bright)]"
            >
              {SHARED_PROMISE.eyebrow}
            </p>
            <h2
              data-voz-reveal
              className="mb-6 font-semibold leading-tight tracking-tight text-[color:var(--color-paper)]"
              style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
            >
              {SHARED_PROMISE.headline}
            </h2>
            <p
              data-voz-reveal
              className="text-base leading-relaxed text-[color:var(--color-mist)]"
            >
              {SHARED_PROMISE.body}
            </p>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="seis módulos" />

        {/* ─── 6 MÓDULOS ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-abyss)] px-6 py-24"
          id="modulos"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <p
                data-voz-reveal
                className="tech-label mb-4 text-[color:var(--color-blue-bright)]"
              >
                El programa
              </p>
              <h2
                data-voz-reveal
                className="font-semibold tracking-tight text-[color:var(--color-paper)]"
                style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
              >
                Seis módulos. Seis especialistas.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SHARED_MODULES.map((mod) => (
                <div
                  key={mod.key}
                  data-voz-reveal
                  className="voz-module-card rounded-lg p-6"
                >
                  <span
                    className="mb-3 block"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize:   "var(--text-eyebrow)",
                      color:      "var(--color-gold)",
                      letterSpacing: "0.22em",
                    }}
                  >
                    {mod.n}
                  </span>
                  <h3 className="mb-2 text-base font-semibold text-[color:var(--color-paper)]">
                    {mod.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--color-mist)]">
                    {mod.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="la transformación" />

        {/* ─── TRANSFORMACIÓN ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-navy-deep)] px-6 py-24"
          id="transformacion"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-14 text-center">
              <p
                data-voz-reveal
                className="tech-label mb-4 text-[color:var(--color-blue-bright)]"
              >
                {SHARED_TRANSFORMATION.eyebrow}
              </p>
              <h2
                data-voz-reveal
                className="font-semibold tracking-tight text-[color:var(--color-paper)]"
                style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
              >
                {SHARED_TRANSFORMATION.headline}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Antes */}
              <div
                data-voz-reveal
                className="rounded-lg border border-[color:var(--color-line)] p-6"
                style={{ background: "color-mix(in oklch, var(--color-navy-raised) 40%, transparent)" }}
              >
                <p
                  className="mb-4 text-xs uppercase tracking-[0.2em] text-[color:var(--color-mist-dim)]"
                >
                  Antes
                </p>
                <ul className="space-y-3">
                  {SHARED_TRANSFORMATION.before.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--color-mist)]">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--color-mist-dim)" }}
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Después */}
              <div
                data-voz-reveal
                className="rounded-lg border p-6"
                style={{
                  borderColor: "color-mix(in oklch, var(--color-gold) 28%, transparent)",
                  background:  "color-mix(in oklch, var(--color-navy-raised) 55%, transparent)",
                }}
              >
                <p
                  className="mb-4 text-xs uppercase tracking-[0.2em] text-[color:var(--color-gold)]"
                >
                  Después
                </p>
                <ul className="space-y-3">
                  {SHARED_TRANSFORMATION.after.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--color-paper)]">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-gold)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cita de cierre */}
            <blockquote
              data-voz-reveal
              className="mt-12 text-center"
            >
              <p
                className="text-xl font-medium italic leading-snug text-[color:var(--color-paper)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                &ldquo;{SHARED_TRANSFORMATION.quote}&rdquo;
              </p>
            </blockquote>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="metodología" />

        {/* ─── METODOLOGÍA ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-abyss)] px-6 py-24"
          id="metodologia"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-14 text-center">
              <p
                data-voz-reveal
                className="tech-label mb-4 text-[color:var(--color-blue-bright)]"
              >
                {SHARED_METHOD.eyebrow}
              </p>
              <h2
                data-voz-reveal
                className="font-semibold tracking-tight text-[color:var(--color-paper)]"
                style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
              >
                {SHARED_METHOD.headline}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SHARED_METHOD.pillars.map((pillar, i) => (
                <div
                  key={i}
                  data-voz-reveal
                  className="rounded-lg border border-[color:var(--color-line)] p-6"
                  style={{ background: "color-mix(in oklch, var(--color-navy-raised) 50%, transparent)" }}
                >
                  <h3 className="mb-2 text-sm font-semibold text-[color:var(--color-paper)]">
                    {pillar.t}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--color-mist)]">
                    {pillar.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="para quién es" />

        {/* ─── PÚBLICO ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-navy-deep)] px-6 py-24"
          id="publico"
        >
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p
                data-voz-reveal
                className="tech-label mb-4 text-[color:var(--color-blue-bright)]"
              >
                {SHARED_AUDIENCE.eyebrow}
              </p>
              <h2
                data-voz-reveal
                className="font-semibold tracking-tight text-[color:var(--color-paper)]"
                style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
              >
                {SHARED_AUDIENCE.headline}
              </h2>
            </div>

            <ul className="space-y-3">
              {SHARED_AUDIENCE.profiles.map((profile, i) => (
                <li
                  key={i}
                  data-voz-reveal
                  className="flex items-center gap-4 rounded-lg border border-[color:var(--color-line)] px-5 py-4"
                  style={{ background: "color-mix(in oklch, var(--color-navy-raised) 45%, transparent)" }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      background: "color-mix(in oklch, var(--color-gold) 18%, transparent)",
                      color:      "var(--color-gold)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[color:var(--color-paper)]">{profile}</span>
                </li>
              ))}
            </ul>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="ficha académica" />

        {/* ─── FICHA ACADÉMICA ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-abyss)] px-6 py-24"
          id="ficha"
        >
          <div className="mx-auto max-w-3xl">
            <p
              data-voz-reveal
              className="tech-label mb-4 text-center text-[color:var(--color-blue-bright)]"
            >
              Información académica
            </p>
            <h2
              data-voz-reveal
              className="mb-12 text-center font-semibold tracking-tight text-[color:var(--color-paper)]"
              style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
            >
              Lo que necesitas saber.
            </h2>

            <dl className="divide-y divide-[color:var(--color-line)]">
              {SHARED_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  data-voz-reveal
                  className="flex items-baseline justify-between gap-4 py-4"
                >
                  <dt
                    className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-mist-dim)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {fact.label}
                  </dt>
                  <dd className="text-sm font-medium text-[color:var(--color-paper)]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="por qué ahora" />

        {/* ─── URGENCIA ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-navy-deep)] px-6 py-24"
          id="urgencia"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-14 text-center">
              <p
                data-voz-reveal
                className="tech-label mb-4 text-[color:var(--color-blue-bright)]"
              >
                {SHARED_URGENCY.eyebrow}
              </p>
              <h2
                data-voz-reveal
                className="font-semibold tracking-tight text-[color:var(--color-paper)]"
                style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
              >
                {SHARED_URGENCY.headline}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {SHARED_URGENCY.reasons.map((reason, i) => (
                <div
                  key={i}
                  data-voz-reveal
                  className="rounded-lg border border-[color:var(--color-line)] p-6"
                  style={{ background: "color-mix(in oklch, var(--color-navy-raised) 50%, transparent)" }}
                >
                  <h3 className="mb-2 text-sm font-semibold text-[color:var(--color-gold)]">
                    {reason.t}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--color-mist)]">
                    {reason.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave sectionLabel="preguntas frecuentes" />

        {/* ─── FAQ ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-abyss)] px-6 py-24"
          id="faq"
        >
          <div className="mx-auto max-w-3xl">
            <p
              data-voz-reveal
              className="tech-label mb-4 text-center text-[color:var(--color-blue-bright)]"
            >
              Preguntas frecuentes
            </p>
            <h2
              data-voz-reveal
              className="mb-12 text-center font-semibold tracking-tight text-[color:var(--color-paper)]"
              style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
            >
              Lo que tal vez te preguntas.
            </h2>
            <VozFaq />
          </div>
        </VozRevealSection>

        {/* Onda de transición */}
        <VozScrollWave />

        {/* ─── CIERRE CON CTA ─── */}
        <VozRevealSection
          className="bg-[color:var(--color-navy-deep)] px-6 py-24"
          id="inscripcion"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              data-voz-reveal
              className="tech-label mb-6 text-[color:var(--color-blue-bright)]"
            >
              El momento es ahora
            </p>
            <h2
              data-voz-reveal
              className="mb-6 font-semibold tracking-tight text-[color:var(--color-paper)]"
              style={{ fontSize: "var(--text-section)", fontFamily: "var(--font-serif)" }}
            >
              {SHARED_CLOSE.headline}
            </h2>
            <p
              data-voz-reveal
              className="mb-10 text-sm uppercase tracking-[0.18em] text-[color:var(--color-mist-dim)]"
            >
              {SHARED_CLOSE.microcopy}
            </p>

            {/* Panel de inscripción */}
            <div
              data-voz-reveal
              className="voz-cta-panel mx-auto max-w-md rounded-2xl p-8"
            >
              <div className="relative z-10 flex flex-col items-center gap-5">
                {/* Onda decorativa mini en el panel */}
                <div aria-hidden className="flex items-end gap-[2px]">
                  {[4, 8, 14, 10, 18, 12, 20, 10, 16, 8, 12, 6].map((h, i) => (
                    <span
                      key={i}
                      className="inline-block w-[2px] rounded-full bg-[color:var(--color-gold)]"
                      style={{ height: `${h}px`, opacity: 0.5 + i * 0.02 }}
                    />
                  ))}
                </div>

                <a
                  href={SHARED_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gold)] px-8 py-4 text-sm font-semibold text-[color:var(--color-abyss)] shadow-[0_0_36px_-8px_rgba(255,169,2,0.6)] transition-all duration-300 hover:brightness-110"
                >
                  {/* WhatsApp SVG inline */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {SHARED_CTA.whatsapp}
                </a>

                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--color-mist-dim)]">
                  {SHARED_CONTACT.institution}
                </p>
              </div>
            </div>
          </div>
        </VozRevealSection>

      </main>

      {/* Firma LS — invariante de marca del autor */}
      <VozAuthorSignature />
    </>
  );
}
