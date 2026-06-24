import type { Metadata } from "next";
import "./sintesis.css";

import { SynHero }            from "@/components/variants/sintesis/SynHero";
import { SynWaveDivider }     from "@/components/variants/sintesis/SynWaveDivider";
import { SynRevealSection }   from "@/components/variants/sintesis/SynRevealSection";
import { SynModuleGrid }      from "@/components/variants/sintesis/SynModuleGrid";
import { SynTransformacion }  from "@/components/variants/sintesis/SynTransformacion";
import { SynFaq }             from "@/components/variants/sintesis/SynFaq";
import { SynAuthorSignature } from "@/components/variants/sintesis/SynAuthorSignature";

import {
  SHARED_PROMISE,
  SHARED_METHOD,
  SHARED_AUDIENCE,
  SHARED_FACTS,
  SHARED_URGENCY,
  SHARED_CLOSE,
  SHARED_CONTACT,
  SHARED_CTA,
} from "@/lib/variants-content";

/*
  Variante experimental "La Síntesis — El Orador Integral".
  Combina las tres mecánicas de las variantes anteriores, cada una en su mejor
  momento, sin superponerlas. Una sola paleta, un solo sistema de movimiento.

  Hero          → tipografía cinética (La Palabra) + haz dorado (El Escenario)
                  + atmósfera de voz (La Voz) + stats CountUp
  Onda          → hilo conductor scroll-driven entre secciones (La Voz)
  Módulos       → spotlight localizado SOLO en esta sección (El Escenario)
  Transformación → contraste tipográfico tachado/afirmado (La Palabra)
  Resto         → secciones limpias con reveals suaves y card-tech
  Cierre        → haz dorado + CTA WhatsApp + ancla #inscripcion-sin
  Firma         → LS en tinta dorada draw-on-scroll (invariante de marca)

  Todo el copy proviene de @/lib/variants-content.ts — cero texto hardcodeado.
  CSS en sintesis.css con prefijo .syn-*. Componentes en variants/sintesis/.
*/

export const metadata: Metadata = {
  title: "La Síntesis · El Orador Integral — Diplomado Public Speaking · UTMACH",
  description:
    "Variante síntesis: tipografía cinética, haz de luz y onda vocal integrados. Diplomado en Public Speaking y Comunicación Persuasiva, Universidad Técnica de Machala. 160 h, 10 créditos, 100% en línea.",
};

export default function SintesisPage() {
  return (
    <div className="syn-stage">
      {/* Skip link de accesibilidad */}
      <a
        href="#syn-main"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[color:var(--color-navy)] focus:px-4 focus:py-2 focus:text-sm focus:text-[color:var(--color-paper)]"
      >
        Ir al contenido principal
      </a>

      <main id="syn-main">

        {/* ─── HERO: La Voz + La Palabra + El Escenario ─── */}
        <SynHero />

        {/* Hilo conductor: onda de voz scroll-driven */}
        <SynWaveDivider />

        {/* ─── PROMESA ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-navy-deep)]"
          id="promesa"
        >
          <div className="syn-section mx-auto max-w-3xl text-center">
            <p data-syn-reveal className="syn-eyebrow">
              {SHARED_PROMISE.eyebrow}
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline"
            >
              {SHARED_PROMISE.headline}
            </h2>
            <p
              data-syn-reveal
              className="text-base leading-relaxed text-[color:var(--color-mist)]"
            >
              {SHARED_PROMISE.body}
            </p>
          </div>
        </SynRevealSection>

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="seis módulos" />

        {/* ─── MÓDULOS: spotlight localizado — El Escenario ─── */}
        <SynRevealSection id="modulos">
          <div className="syn-section mx-auto">
            <div className="mb-12 text-center">
              <p data-syn-reveal className="syn-eyebrow">El programa</p>
              <h2
                data-syn-reveal
                className="syn-section-headline"
              >
                Seis módulos. Seis especialistas.
              </h2>
              <p
                data-syn-reveal
                className="mx-auto max-w-lg text-sm leading-relaxed text-[color:var(--color-mist)]"
              >
                Mueve el cursor sobre las tarjetas para descubrir cada disciplina.
              </p>
            </div>
          </div>

          {/* ModuleGrid fuera del max-w para que ocupe el ancho completo */}
          <SynModuleGrid />
        </SynRevealSection>

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="la transformación" />

        {/* ─── TRANSFORMACIÓN: contraste tipográfico — La Palabra ─── */}
        <SynTransformacion />

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="metodología" />

        {/* ─── METODOLOGÍA ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-abyss)]"
          id="metodologia"
        >
          <div className="syn-section mx-auto max-w-4xl">
            <p data-syn-reveal className="syn-eyebrow text-center">
              {SHARED_METHOD.eyebrow}
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline text-center"
            >
              {SHARED_METHOD.headline}
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {SHARED_METHOD.pillars.map((pillar, i) => (
                <div key={i} data-syn-reveal className="syn-pillar">
                  <h3 className="mb-2 mt-4 text-sm font-semibold text-[color:var(--color-paper)]">
                    {pillar.t}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--color-mist)]">
                    {pillar.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SynRevealSection>

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="para quién es" />

        {/* ─── PÚBLICO ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-navy-deep)]"
          id="publico"
        >
          <div className="syn-section mx-auto max-w-3xl">
            <p data-syn-reveal className="syn-eyebrow text-center">
              {SHARED_AUDIENCE.eyebrow}
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline text-center"
            >
              {SHARED_AUDIENCE.headline}
            </h2>

            <ul className="mt-8 space-y-3">
              {SHARED_AUDIENCE.profiles.map((profile, i) => (
                <li
                  key={i}
                  data-syn-reveal
                  className="flex items-center gap-4 rounded-lg border border-[color:var(--color-line)] px-5 py-4"
                  style={{
                    background: "color-mix(in oklch, var(--color-navy-raised) 42%, transparent)",
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      background: "color-mix(in oklch, var(--color-gold) 16%, transparent)",
                      color: "var(--color-gold)",
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
        </SynRevealSection>

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="ficha académica" />

        {/* ─── FICHA ACADÉMICA ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-abyss)]"
          id="ficha"
        >
          <div className="syn-section mx-auto max-w-3xl">
            <p data-syn-reveal className="syn-eyebrow text-center">
              Información académica
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline text-center"
            >
              Lo que necesitas saber.
            </h2>

            <dl className="mt-10 divide-y divide-[color:var(--color-line)]">
              {SHARED_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  data-syn-reveal
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
        </SynRevealSection>

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="por qué ahora" />

        {/* ─── URGENCIA ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-navy-deep)]"
          id="urgencia"
        >
          <div className="syn-section mx-auto max-w-4xl">
            <p data-syn-reveal className="syn-eyebrow text-center">
              {SHARED_URGENCY.eyebrow}
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline text-center"
            >
              {SHARED_URGENCY.headline}
            </h2>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {SHARED_URGENCY.reasons.map((reason, i) => (
                <div key={i} data-syn-reveal className="syn-urgency-card">
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
        </SynRevealSection>

        {/* Hilo conductor */}
        <SynWaveDivider sectionLabel="preguntas frecuentes" />

        {/* ─── FAQ ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-abyss)]"
          id="faq"
        >
          <div className="syn-section mx-auto max-w-3xl">
            <p data-syn-reveal className="syn-eyebrow text-center">
              Preguntas frecuentes
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline text-center"
            >
              Lo que tal vez te preguntas.
            </h2>
            <div className="mt-10">
              <SynFaq />
            </div>
          </div>
        </SynRevealSection>

        {/* Hilo conductor final */}
        <SynWaveDivider />

        {/* ─── CIERRE CON CTA WHATSAPP ─── */}
        <SynRevealSection
          className="bg-[color:var(--color-navy-deep)]"
          id="inscripcion-sin"
        >
          <div className="syn-section mx-auto max-w-3xl text-center">
            <p data-syn-reveal className="syn-eyebrow">
              El momento es ahora
            </p>
            <h2
              data-syn-reveal
              className="syn-section-headline"
            >
              {SHARED_CLOSE.headline}
            </h2>
            <p
              data-syn-reveal
              className="mb-10 text-xs uppercase tracking-[0.2em] text-[color:var(--color-mist-dim)]"
            >
              {SHARED_CLOSE.microcopy}
            </p>

            {/* Panel de inscripción */}
            <div
              data-syn-reveal
              className="syn-cta-panel mx-auto max-w-md p-8"
            >
              <div className="relative z-10 flex flex-col items-center gap-5">
                {/* Mini onda decorativa */}
                <div aria-hidden className="flex items-end gap-[2px]">
                  {[4, 8, 14, 10, 18, 12, 20, 10, 16, 8, 12, 6].map((h, i) => (
                    <span
                      key={i}
                      className="inline-block w-[2px] rounded-full bg-[color:var(--color-gold)]"
                      style={{ height: `${h}px`, opacity: 0.45 + i * 0.025 }}
                    />
                  ))}
                </div>

                <a
                  href={SHARED_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gold)] px-8 py-4 text-sm font-semibold text-[color:var(--color-abyss)] shadow-[0_0_36px_-8px_rgba(255,169,2,0.6)] transition-all duration-300 hover:brightness-110"
                >
                  {/* WhatsApp icon */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {SHARED_CTA.whatsapp}
                </a>

                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--color-mist-dim)]">
                  {SHARED_CONTACT.institution}
                </p>
              </div>
            </div>
          </div>
        </SynRevealSection>

      </main>

      {/* Firma LS — invariante de marca del autor */}
      <SynAuthorSignature />
    </div>
  );
}
