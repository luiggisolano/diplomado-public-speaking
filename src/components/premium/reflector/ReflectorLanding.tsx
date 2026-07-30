"use client";

/*
  Reflector — landing CLARA del Diplomado en Public Speaking (UTMACH). Modo lfront
  editorial-saas / conversion-showcase. "El foco cae sobre el mensaje": una galería de
  hueso recorrida por un reflector azul (shader OGL fijo) que barre la página con el scroll
  y va "encendiendo" cada módulo. Titulares serif anclados a la izquierda con revelado por
  máscara (SplitText), CTA de WhatsApp prominente y sticky (la lección LATAM del cerebro: el
  WhatsApp convierte muy por encima del formulario), y un único capítulo oscuro-teatro para
  la tarjeta de inscripción. Copy 100% desde variants-content (fuente única).

  Motion: Lenis + GSAP + ScrollTrigger, un único régimen. Un ScrollTrigger global alimenta el
  uniform uScroll del haz. Todo honra prefers-reduced-motion: si el usuario pide menos
  movimiento, no se añade la clase motion-on (el contenido nace visible) y el haz no monta.
*/

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SmoothScroll } from "@/components/premium/_shared/SmoothScroll";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import { LineIcon } from "@/components/LineIcon";
import { ReflectorSignature } from "./ReflectorSignature";
import {
  SHARED_AUDIENCE,
  SHARED_CLOSE,
  SHARED_CONTACT,
  SHARED_CTA,
  SHARED_FACTS,
  SHARED_FAQ,
  SHARED_HERO,
  SHARED_METHOD,
  SHARED_MODULES,
  SHARED_PROMISE,
  SHARED_STATS,
  SHARED_TRANSFORMATION,
  SHARED_URGENCY,
} from "@/lib/variants-content";

const BeamCanvas = dynamic(
  () => import("./BeamCanvas").then((module) => module.BeamCanvas),
  { ssr: false },
);

function InstitutionalSeal() {
  return (
    <a href="#top" className="r-seal" aria-label="Diplomado en Public Speaking · UTMACH · Centro de Educación Continua">
      <svg className="r-seal__ring" viewBox="0 0 48 48" fill="none" aria-hidden>
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
        <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        <path d="M24 13 L31 33 L24 28 L17 33 Z" fill="currentColor" />
      </svg>
      <span className="flex flex-col">
        <span className="r-seal__name">UTMACH</span>
        <span className="r-seal__sub">Educación Continua</span>
      </span>
    </a>
  );
}

type FaqItemProps = {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: (index: number) => void;
};

function FaqItem({ index, question, answer, isOpen, onToggle }: FaqItemProps) {
  const panelId = `reflector-faq-panel-${index}`;
  const triggerId = `reflector-faq-trigger-${index}`;
  return (
    <div className="r-faq__item">
      <h3 className="m-0">
        <button
          id={triggerId}
          type="button"
          className="r-faq__trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(index)}
        >
          <span>{question}</span>
          <LineIcon name="spark" className="r-faq__icon" strokeWidth={1.6} />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="r-faq__panel"
        data-open={isOpen}
      >
        <div className="r-faq__panel-inner">
          <p className="r-faq__answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function ReflectorLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<number>(0);

  const [openFaq, setOpenFaq] = useState<number>(0);
  const [stickyArmed, setStickyArmed] = useState<boolean>(false);
  const [stickyMuted, setStickyMuted] = useState<boolean>(false);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root) {
      return;
    }

    registerGsapPlugins();

    if (prefersReducedMotionNow()) {
      return;
    }

    root.classList.add("motion-on");
    const splits: SplitText[] = [];
    let disposed = false;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-module]").forEach((element) => {
        ScrollTrigger.create({
          trigger: element,
          start: "top 72%",
          end: "bottom 42%",
          onToggle: (self) => element.classList.toggle("is-lit", self.isActive),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count ?? "0");
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
          onUpdate: () => {
            element.textContent = Math.round(counter.value).toString();
          },
          onComplete: () => {
            element.textContent = target.toString();
          },
        });
      });

      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: "bottom 92%",
          onEnter: () => setStickyArmed(true),
          onLeaveBack: () => setStickyArmed(false),
        });
      }

      ScrollTrigger.create({
        trigger: "#inscripcion",
        start: "top 78%",
        end: "bottom bottom",
        onToggle: (self) => setStickyMuted(self.isActive),
      });

      const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      document.fonts.ready.then(() => {
        if (disposed) {
          return;
        }
        const heroTitle = root.querySelector<HTMLElement>("[data-hero-title]");
        if (heroTitle) {
          const split = new SplitText(heroTitle, {
            type: "lines",
            mask: "lines",
            linesClass: "r-split-line",
          });
          splits.push(split);
          intro.set(heroTitle, { opacity: 1 }, 0);
          intro.from(split.lines, { yPercent: 115, duration: 1.05, stagger: 0.12 }, 0.1);
        }
        intro.to(
          "[data-hero-fade]",
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.09 },
          0.4,
        );
        intro.play(0);
        ScrollTrigger.refresh();
      });
    }, root);

    return () => {
      disposed = true;
      splits.forEach((split) => split.revert());
      ctx.revert();
      root.classList.remove("motion-on");
    };
  }, []);

  const stickyVisible = stickyArmed && !stickyMuted;

  return (
    <SmoothScroll>
      <div ref={rootRef} id="top" className="reflector-root reflector-grain">
        <BeamCanvas progressRef={progressRef} />

        <div className="reflector-content">
          {/* ---------------- Nav / sello institucional ---------------- */}
          <header className="r-shell flex items-center justify-between gap-4 py-6">
            <InstitutionalSeal />
            <a href={SHARED_CTA.href} className="r-btn r-btn--primary hidden sm:inline-flex">
              {SHARED_CTA.primary}
              <LineIcon name="arrow-right" />
            </a>
          </header>

          {/* ---------------- Hero ---------------- */}
          <section ref={heroRef} className="r-section pt-4" aria-labelledby="reflector-hero-title">
            <div className="r-shell">
              <p data-hero-fade className="r-eyebrow">
                {SHARED_HERO.kicker}
              </p>
              <h1
                id="reflector-hero-title"
                data-hero-title
                className="r-display mt-6 max-w-[16ch]"
              >
                {SHARED_HERO.line1}{" "}
                <span className="r-mute">{SHARED_HERO.line2}</span>{" "}
                <span className="r-pivot--muted">{SHARED_HERO.accent}</span>
              </h1>

              <p data-hero-fade className="r-lead r-measure mt-8">
                {SHARED_HERO.sub}
              </p>

              <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
                <a href={SHARED_CTA.href} className="r-btn r-btn--primary">
                  {SHARED_CTA.primary}
                  <LineIcon name="arrow-right" />
                </a>
                <a
                  href={SHARED_CONTACT.whatsappLink}
                  className="r-btn r-btn--whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LineIcon name="whatsapp" />
                  {SHARED_CTA.whatsapp}
                </a>
              </div>

              <p data-hero-fade className="r-label mt-6">
                {SHARED_HERO.microcopy}
              </p>

              <div
                data-hero-fade
                className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3"
              >
                {["UTMACH · CEC", "160 horas", "10 créditos", "Certificación oficial"].map(
                  (signal, index) => (
                    <span key={signal} className="flex items-center gap-3">
                      {index > 0 ? (
                        <span aria-hidden className="h-1 w-1 rounded-full bg-[color:var(--r-bronze)]" />
                      ) : null}
                      <span className="r-mono text-[0.74rem] uppercase tracking-[0.18em] text-[color:var(--r-bronze-ink)]">
                        {signal}
                      </span>
                    </span>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* ---------------- Banda de stats ---------------- */}
          <section className="r-section r-chapter-deep" aria-label="Datos del diplomado">
            <div className="r-shell grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {SHARED_STATS.map((stat) => (
                <div key={stat.label} data-reveal>
                  <p className="r-stat__value">
                    <span className="r-mono" data-count={stat.value} data-suffix={stat.suffix}>
                      {stat.value}
                    </span>
                    {stat.suffix ? <span className="r-stat__suffix">{stat.suffix}</span> : null}
                  </p>
                  <p className="r-stat__label">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Promesa ---------------- */}
          <section className="r-section" aria-labelledby="reflector-promise">
            <div className="r-shell max-w-[52ch]">
              <p data-reveal className="r-eyebrow">
                {SHARED_PROMISE.eyebrow}
              </p>
              <h2 id="reflector-promise" data-reveal className="r-h2 mt-6">
                {SHARED_PROMISE.headline}
              </h2>
              <p data-reveal className="r-body mt-6">
                {SHARED_PROMISE.body}
              </p>
            </div>
          </section>

          {/* ---------------- Módulos que se encienden ---------------- */}
          <section className="r-section r-chapter-deep" aria-labelledby="reflector-modules">
            <div className="r-shell">
              <div className="max-w-[46ch]">
                <p data-reveal className="r-eyebrow">
                  Seis disciplinas · Seis especialistas
                </p>
                <h2 id="reflector-modules" data-reveal className="r-h2 mt-6">
                  El reflector recorre cada módulo.
                </h2>
              </div>

              <div className="mt-12">
                {SHARED_MODULES.map((module) => (
                  <article key={module.key} data-module className="r-module">
                    <span className="r-module__beam" aria-hidden />
                    <span className="r-module__num">{module.n}</span>
                    <div>
                      <h3 className="r-module__title">{module.title}</h3>
                      <p className="r-module__line">{module.line}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Público ---------------- */}
          <section className="r-section" aria-labelledby="reflector-audience">
            <div className="r-shell">
              <p data-reveal className="r-eyebrow">
                {SHARED_AUDIENCE.eyebrow}
              </p>
              <h2 id="reflector-audience" data-reveal className="r-h2 mt-6 max-w-[20ch]">
                {SHARED_AUDIENCE.headline}
              </h2>
              <ul data-reveal className="mt-10 flex flex-wrap gap-3 list-none p-0">
                {SHARED_AUDIENCE.profiles.map((profile) => (
                  <li
                    key={profile}
                    className="rounded-[var(--r-radius-pill)] border border-[color:var(--r-line)] bg-[color:var(--r-paper-raise)] px-5 py-2.5 text-[0.95rem] text-[color:var(--r-ink-body)]"
                  >
                    {profile}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ---------------- Transformación antes/después + cita ---------------- */}
          <section className="r-section r-chapter-deep" aria-labelledby="reflector-transformation">
            <div className="r-shell">
              <p data-reveal className="r-eyebrow">
                {SHARED_TRANSFORMATION.eyebrow}
              </p>
              <h2 id="reflector-transformation" data-reveal className="r-h2 mt-6">
                {SHARED_TRANSFORMATION.headline}
              </h2>

              <div className="r-ba mt-10">
                <div data-reveal className="r-ba__col r-ba__col--before">
                  <p className="r-label mb-2">Hoy</p>
                  {SHARED_TRANSFORMATION.before.map((item) => (
                    <div key={item} className="r-ba__item">
                      <LineIcon name="block" className="r-ba__icon r-ba__icon--before" />
                      <p className="r-body">{item}</p>
                    </div>
                  ))}
                </div>
                <div data-reveal className="r-ba__col r-ba__col--after">
                  <p className="r-label mb-2" style={{ color: "var(--r-beam-ink)" }}>
                    Después del diplomado
                  </p>
                  {SHARED_TRANSFORMATION.after.map((item) => (
                    <div key={item} className="r-ba__item">
                      <LineIcon name="check" className="r-ba__icon r-ba__icon--after" />
                      <p className="r-body" style={{ color: "var(--r-ink-90)" }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <blockquote data-reveal className="mt-14 max-w-[24ch]">
                <p className="r-quote">
                  <span className="r-quote__mark">“</span>
                  {SHARED_TRANSFORMATION.quote}
                  <span className="r-quote__mark">”</span>
                </p>
              </blockquote>
            </div>
          </section>

          {/* ---------------- Método ---------------- */}
          <section className="r-section" aria-labelledby="reflector-method">
            <div className="r-shell">
              <div className="max-w-[46ch]">
                <p data-reveal className="r-eyebrow">
                  {SHARED_METHOD.eyebrow}
                </p>
                <h2 id="reflector-method" data-reveal className="r-h2 mt-6">
                  {SHARED_METHOD.headline}
                </h2>
              </div>
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {SHARED_METHOD.pillars.map((pillar, index) => (
                  <div key={pillar.t} data-reveal className="r-card p-7">
                    <span className="r-mono text-[0.72rem] tracking-[0.2em] text-[color:var(--r-beam-ink)]">
                      M{String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="r-h3 mt-4">{pillar.t}</h3>
                    <p className="r-body mt-3">{pillar.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Ficha técnica ---------------- */}
          <section className="r-section r-chapter-deep" aria-label="Ficha del diplomado">
            <div className="r-shell">
              <p data-reveal className="r-eyebrow">
                La ficha
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {SHARED_FACTS.map((fact) => (
                  <div key={fact.label} data-reveal className="r-fact">
                    <p className="r-fact__label">{fact.label}</p>
                    <p className="r-fact__value">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Urgencia ---------------- */}
          <section className="r-section" aria-labelledby="reflector-urgency">
            <div className="r-shell">
              <div className="max-w-[40ch]">
                <p data-reveal className="r-eyebrow">
                  {SHARED_URGENCY.eyebrow}
                </p>
                <h2 id="reflector-urgency" data-reveal className="r-h2 mt-6">
                  {SHARED_URGENCY.headline}
                </h2>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {SHARED_URGENCY.reasons.map((reason) => (
                  <div key={reason.t} data-reveal className="r-card p-7">
                    <LineIcon
                      name="seal"
                      className="mb-4 h-6 w-6 text-[color:var(--r-beam)]"
                      strokeWidth={1.4}
                    />
                    <h3 className="r-h3">{reason.t}</h3>
                    <p className="r-body mt-3">{reason.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}
          <section className="r-section r-chapter-deep" aria-labelledby="reflector-faq">
            <div className="r-shell max-w-[46rem]">
              <p data-reveal className="r-eyebrow">
                Preguntas frecuentes
              </p>
              <h2 id="reflector-faq" data-reveal className="r-h2 mt-6 mb-10">
                Lo que necesitas saber antes de inscribirte.
              </h2>
              <div data-reveal className="r-faq">
                {SHARED_FAQ.map((item, index) => (
                  <FaqItem
                    key={item.q}
                    index={index}
                    question={item.q}
                    answer={item.a}
                    isOpen={openFaq === index}
                    onToggle={(target) =>
                      setOpenFaq((current) => (current === target ? -1 : target))
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Cierre: tarjeta de inscripción (capítulo oscuro) ---------------- */}
          <section id="inscripcion" className="r-section" aria-labelledby="reflector-close">
            <div className="r-shell">
              <div data-reveal className="r-stage">
                <span className="r-stage__glow" aria-hidden />
                <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                  <div>
                    <p className="r-stage__trust">Diplomado universitario · UTMACH · CEC</p>
                    <h2 id="reflector-close" className="r-stage__title mt-5">
                      {SHARED_CLOSE.headline}
                    </h2>
                    <p className="r-stage__meta mt-5 max-w-[46ch] r-body" style={{ color: "var(--r-bone-body)" }}>
                      160 horas · 10 créditos universitarios · Certificación oficial. Una sola
                      cohorte por ciclo, con seis especialistas.
                    </p>
                    <p className="r-stage__trust mt-6">{SHARED_CLOSE.microcopy}</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <a
                      href={SHARED_CONTACT.whatsappLink}
                      className="r-btn r-btn--on-stage w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LineIcon name="whatsapp" />
                      {SHARED_CTA.whatsapp}
                    </a>
                    <a
                      href={`mailto:${SHARED_CONTACT.email}`}
                      className="r-btn r-btn--stage-ghost w-full"
                    >
                      <LineIcon name="mail" />
                      {SHARED_CONTACT.email}
                    </a>
                    <hr className="r-stage__divider mt-2" />
                    <p className="r-mono text-[0.72rem] tracking-[0.14em]" style={{ color: "var(--r-bone-muted)" }}>
                      {SHARED_CONTACT.whatsapp} · {SHARED_CONTACT.institution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Firma LS ---------------- */}
          <ReflectorSignature />
        </div>

        {/* ---------------- CTA sticky de WhatsApp ---------------- */}
        <div className={`r-sticky${stickyVisible ? " is-visible" : ""}`} aria-hidden={!stickyVisible}>
          <a
            href={SHARED_CONTACT.whatsappLink}
            className="r-sticky__btn"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={stickyVisible ? 0 : -1}
          >
            <LineIcon name="whatsapp" />
            <span className="hidden sm:inline">{SHARED_CTA.whatsapp}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>
    </SmoothScroll>
  );
}
