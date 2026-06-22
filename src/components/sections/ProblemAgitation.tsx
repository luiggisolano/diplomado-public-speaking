"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { SectionHeading } from "@/components/SectionHeading";
import { LineIcon } from "@/components/LineIcon";
import { VoiceWaveform } from "@/components/motion/VoiceWaveform";
import { PROBLEM_AGITATION } from "@/lib/content";

/*
  Bloque 2 — Agitación del problema, en el sistema "Aula Futura". Compone a dos columnas:
  a la izquierda la narrativa (encabezado, escena, pivote con acento serif dorado); a la
  derecha el catálogo de dolores en paneles card-tech con índice mono, ícono lineal azul y
  filete sutil. Cada panel entra con un micro-temblor que luego se asienta, reforzando la
  incomodidad del copy. Honra prefers-reduced-motion saltando el temblor. Los seis dolores se
  reparten un panel cada uno, con un ícono semántico asociado sin inventar texto.
*/

const PAIN_SHAKE_AMPLITUDE_PX = 4;
const PAIN_ENTER_DURATION_MS = 620;
const PAIN_STAGGER_MS = 110;
const VIEWPORT_TRIGGER_RATIO = 0.25;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PAIN_SELECTOR = "[data-pain]";

const PAIN_ICON_SEQUENCE = [
  "voice",
  "target",
  "voice",
  "eye-off",
  "eye-off",
  "block",
] as const;

export default function ProblemAgitation() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const pains = Array.from(root.querySelectorAll<HTMLElement>(PAIN_SELECTOR));

    if (prefersReducedMotion) {
      pains.forEach((pain) => {
        pain.style.opacity = "1";
        pain.style.transform = "none";
      });
      return;
    }

    const runShake = () => {
      animate(pains, {
        opacity: [0, 1],
        translateX: [
          { to: -PAIN_SHAKE_AMPLITUDE_PX, duration: 90 },
          { to: PAIN_SHAKE_AMPLITUDE_PX, duration: 90 },
          { to: -PAIN_SHAKE_AMPLITUDE_PX / 2, duration: 90 },
          { to: 0, duration: 140 },
        ],
        duration: PAIN_ENTER_DURATION_MS,
        delay: stagger(PAIN_STAGGER_MS),
        ease: "out(3)",
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runShake();
            observer.disconnect();
          }
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="problema"
      className="stage-b relative scroll-mt-24 py-[var(--space-section)]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow={PROBLEM_AGITATION.eyebrow}
            title={PROBLEM_AGITATION.title}
          />

          <p className="mt-8 max-w-[60ch] text-lg font-medium text-paper">
            {PROBLEM_AGITATION.intro}
          </p>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-mist">
            {PROBLEM_AGITATION.scenario}
          </p>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-mist">
            {PROBLEM_AGITATION.pivot}
          </p>
          <p className="mt-6 font-serif text-2xl font-semibold leading-snug text-paper">
            <span className="serif-accent serif-accent--italic font-normal text-gold">
              {PROBLEM_AGITATION.pivotAccent}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="tech-label mb-1">{PROBLEM_AGITATION.painsLead}</p>
          {PROBLEM_AGITATION.pains.map((pain, index) => (
            <article
              key={pain}
              data-pain
              className="card-tech flex items-start gap-5 rounded-xl p-6 opacity-0 sm:p-7"
            >
              <span
                className="mono-num mt-0.5 shrink-0 text-sm font-semibold text-blue-bright/60"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line text-blue-bright">
                <LineIcon
                  name={PAIN_ICON_SEQUENCE[index] ?? "block"}
                  className="h-5 w-5"
                />
              </span>
              <p className="text-base leading-relaxed text-mist">{pain}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-6">
        <p className="border-t border-line pt-10 text-center font-serif text-xl font-semibold italic leading-snug text-paper sm:text-2xl">
          {PROBLEM_AGITATION.closing}
        </p>
        <VoiceWaveform className="mt-12" />
      </div>
    </section>
  );
}
