import type { Metadata } from "next";
import "./escenario.css";

import {
  SHARED_PROMISE,
  SHARED_TRANSFORMATION,
  SHARED_METHOD,
  SHARED_AUDIENCE,
  SHARED_FACTS,
  SHARED_URGENCY,
  SHARED_CLOSE,
  SHARED_CONTACT,
  SHARED_CTA,
  SHARED_AUTHOR,
} from "@/lib/variants-content";

import { SpotlightLayer } from "@/components/variants/escenario/SpotlightLayer";
import { SkipLink } from "@/components/variants/escenario/SkipLink";
import { EscenarioHero } from "@/components/variants/escenario/EscenarioHero";
import { StatsCounter } from "@/components/variants/escenario/StatsCounter";
import { ModuleGrid } from "@/components/variants/escenario/ModuleGrid";
import { FaqAccordion } from "@/components/variants/escenario/FaqAccordion";
import { RevealOnScroll } from "@/components/variants/escenario/RevealOnScroll";

export const metadata: Metadata = {
  title: "El Escenario · Diplomado Public Speaking UTMACH",
  description:
    "Formación universitaria en oratoria y comunicación persuasiva. 160 h, 100% en línea. UTMACH · Centro de Educación Continua.",
};

/*
  Variante "El Escenario" — cursor reflector / spotlight teatral.
  La página vive en penumbra y el cursor del usuario actúa como reflector.
  Metáfora: salir al escenario, que la luz caiga sobre ti.

  Accesibilidad / degradación sin JS:
  - SpotlightLayer tiene opacity:0 por defecto en CSS; JS lo activa.
  - RevealOnScroll usa prefers-reduced-motion via CSS (opacity:1 forzado).
  - Todo el contenido es legible sin JS ni cursor.
*/

export default function EscenarioPage() {
  return (
    <div className="esc-stage">

      {/* Capa de oscuridad teatral — solo activa con JS + pointer:fine */}
      <SpotlightLayer />

      {/* ── Skip link de accesibilidad ─────────────────────────────────── */}
      <SkipLink />

      <main id="contenido-principal">

        {/* ── 1. HERO — Telón oscuro, haz dorado, titular ──────────────── */}
        <EscenarioHero />

        {/* ── 2. STATS ─────────────────────────────────────────────────── */}
        <StatsCounter />

        <hr className="esc-divider" />

        {/* ── 3. PROMESA ───────────────────────────────────────────────── */}
        <section
          className="esc-section"
          aria-labelledby="promise-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">{SHARED_PROMISE.eyebrow}</span>
            <h2 id="promise-heading" className="esc-section-headline">
              {SHARED_PROMISE.headline}
            </h2>
            <p className="esc-body">{SHARED_PROMISE.body}</p>
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 4. MÓDULOS — Luces en el escenario ───────────────────────── */}
        <section
          aria-labelledby="modules-heading"
          style={{ background: "var(--color-navy-deep)", position: "relative", zIndex: 1 }}
        >
          <div className="esc-section">
            <RevealOnScroll>
              <span className="esc-eyebrow">El programa</span>
              <h2 id="modules-heading" className="esc-section-headline">
                Seis disciplinas.<br />
                <em style={{ fontStyle: "italic", color: "var(--color-gold)" }}>
                  Un solo orador.
                </em>
              </h2>
            </RevealOnScroll>
          </div>
          <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 1.5rem 0" }}>
            <ModuleGrid />
          </div>
          <div style={{ height: "clamp(5rem, 3rem + 7vw, 8.5rem)" }} />
        </section>

        <hr className="esc-divider" />

        {/* ── 5. TRANSFORMACIÓN — Antes / Después ──────────────────────── */}
        <section
          className="esc-section"
          aria-labelledby="transform-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">{SHARED_TRANSFORMATION.eyebrow}</span>
            <h2 id="transform-heading" className="esc-section-headline">
              {SHARED_TRANSFORMATION.headline}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="esc-transform-grid" style={{ marginTop: "2.5rem" }}>
              <div className="esc-transform-col">
                <span className="esc-transform-label esc-transform-label--before">
                  Antes del diplomado
                </span>
                <ul className="esc-transform-list">
                  {SHARED_TRANSFORMATION.before.map((item) => (
                    <li key={item} className="esc-transform-item">
                      <span className="esc-transform-dot" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="esc-transform-col esc-transform-col--after">
                <span className="esc-transform-label esc-transform-label--after">
                  Después del diplomado
                </span>
                <ul className="esc-transform-list">
                  {SHARED_TRANSFORMATION.after.map((item) => (
                    <li key={item} className="esc-transform-item esc-transform-item--after">
                      <span className="esc-transform-dot esc-transform-dot--after" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <blockquote className="esc-quote">
              <p className="esc-quote-text">{SHARED_TRANSFORMATION.quote}</p>
            </blockquote>
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 6. METODOLOGÍA ───────────────────────────────────────────── */}
        <section
          className="esc-section"
          style={{ background: "var(--color-abyss)" }}
          aria-labelledby="method-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">{SHARED_METHOD.eyebrow}</span>
            <h2 id="method-heading" className="esc-section-headline">
              {SHARED_METHOD.headline}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="esc-pillars">
              {SHARED_METHOD.pillars.map((pillar) => (
                <div key={pillar.t} className="esc-pillar">
                  <h3 className="esc-pillar-title">{pillar.t}</h3>
                  <p className="esc-pillar-body">{pillar.d}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 7. PÚBLICO ───────────────────────────────────────────────── */}
        <section
          className="esc-section"
          style={{ background: "var(--color-navy-deep)" }}
          aria-labelledby="audience-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">{SHARED_AUDIENCE.eyebrow}</span>
            <h2 id="audience-heading" className="esc-section-headline">
              {SHARED_AUDIENCE.headline}
            </h2>
            <div className="esc-profiles">
              {SHARED_AUDIENCE.profiles.map((profile) => (
                <span key={profile} className="esc-profile-tag">
                  {profile}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 8. FICHA ACADÉMICA ───────────────────────────────────────── */}
        <section
          className="esc-section"
          aria-labelledby="facts-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">Ficha académica</span>
            <h2 id="facts-heading" className="esc-section-headline">
              Lo que certificas.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="esc-facts">
              {SHARED_FACTS.map((fact) => (
                <div key={fact.label} className="esc-fact">
                  <span className="esc-fact-label">{fact.label}</span>
                  <span className="esc-fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 9. URGENCIA ──────────────────────────────────────────────── */}
        <section
          className="esc-section"
          style={{ background: "var(--color-navy-deep)" }}
          aria-labelledby="urgency-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">{SHARED_URGENCY.eyebrow}</span>
            <h2 id="urgency-heading" className="esc-section-headline">
              {SHARED_URGENCY.headline}
            </h2>
            <div className="esc-urgency-grid">
              {SHARED_URGENCY.reasons.map((reason) => (
                <div key={reason.t} className="esc-urgency-card">
                  <h3 className="esc-urgency-title">{reason.t}</h3>
                  <p className="esc-urgency-desc">{reason.d}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 10. FAQ ──────────────────────────────────────────────────── */}
        <section
          className="esc-section"
          aria-labelledby="faq-heading"
        >
          <RevealOnScroll>
            <span className="esc-eyebrow">Preguntas frecuentes</span>
            <h2 id="faq-heading" className="esc-section-headline">
              Lo que suelen preguntar.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <FaqAccordion />
          </RevealOnScroll>
        </section>

        <hr className="esc-divider" />

        {/* ── 11. CIERRE CON CTA FINAL ─────────────────────────────────── */}
        <section
          id="inscripcion"
          className="esc-close-section"
          style={{ background: "var(--color-navy-deep)" }}
          aria-labelledby="close-heading"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 55% at 50% 100%, rgba(255,169,2,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
          <RevealOnScroll>
            <h2 id="close-heading" className="esc-close-headline">
              {SHARED_CLOSE.headline}
            </h2>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
              <a
                href={SHARED_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="esc-cta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8.5 9.5c.3 1.2.9 2.3 1.7 3.2.9.9 2 1.5 3.2 1.7l1.1-1.1c.1-.1.3-.2.4-.1.6.3 1.2.5 1.9.6.2 0 .3.2.3.4v1.8c0 .2-.2.4-.4.4C9.9 16.4 7.6 14.1 7.6 8.9c0-.2.2-.4.4-.4H9.8c.2 0 .4.1.4.3.1.7.3 1.3.6 1.9.1.2 0 .3-.1.4l-1.1 1.1-.1-.7z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {SHARED_CTA.whatsapp}
              </a>
            </div>

            <span className="esc-close-microcopy">{SHARED_CLOSE.microcopy}</span>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-mist-dim)", letterSpacing: "0.1em" }}>
                {SHARED_CONTACT.institution}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-mist-dim)", letterSpacing: "0.06em", marginTop: "0.25rem" }}>
                {SHARED_CONTACT.email}
              </p>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      {/* ── 12. FIRMA LS ─────────────────────────────────────────────────── */}
      <footer className="esc-author" aria-label="Firma del autor">
        <span className="esc-author-monogram" aria-label="LS">LS</span>
        <span className="esc-author-label">{SHARED_AUTHOR.label}</span>
        <span className="esc-author-year">{SHARED_AUTHOR.note} · {SHARED_AUTHOR.year}</span>
      </footer>
    </div>
  );
}
