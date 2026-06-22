"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { LineIcon } from "@/components/LineIcon";
import { VoiceWaveform } from "@/components/motion/VoiceWaveform";
import { TRANSFORMATION } from "@/lib/content";

/*
  Bloque 6 — La transformación / antes y después, en el sistema "Aula Futura". A la izquierda
  las dos listas (Antes con íconos apagados, Después con íconos e índice azul); a la derecha un
  retrato en blanco y negro con una cita superpuesta en serif. El retrato es un slot de imagen
  (data-image-slot) que se desatura en reposo y recupera color al entrar el bloque al viewport,
  materializando el cambio que promete el copy. Honra prefers-reduced-motion mostrando el estado
  final sin transición.
*/

const VIEWPORT_TRIGGER_RATIO = 0.4;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PORTRAIT_GLOW =
  "radial-gradient(80% 60% at 50% 20%, rgba(77,147,245,0.2), transparent 70%)";
const PORTRAIT_SCRIM =
  "linear-gradient(180deg, transparent 40%, rgba(5,11,26,0.92) 100%)";

export default function Transformation() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (prefersReducedMotion) {
      setHasRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: VIEWPORT_TRIGGER_RATIO },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const portraitStateClassName = hasRevealed
    ? "saturate-100 opacity-100"
    : "saturate-0 opacity-70";

  return (
    <section
      ref={rootRef}
      className="stage-b relative overflow-hidden py-[var(--space-section)]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-x-16 gap-y-12 px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={TRANSFORMATION.eyebrow}
            title={TRANSFORMATION.title}
          />

          <div className="mt-12 flex flex-col gap-10">
            <div className="opacity-60">
              <div className="flex items-center gap-3">
                <LineIcon
                  name="block"
                  className="h-5 w-5 shrink-0 text-mist-dim"
                />
                <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-mist-dim">
                  {TRANSFORMATION.beforeLabel}
                </h3>
              </div>
              <ul className="mt-5 flex flex-col gap-3 pl-8">
                {TRANSFORMATION.before.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-mist"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <LineIcon
                  name="check"
                  className="h-5 w-5 shrink-0 text-blue-bright"
                />
                <h3 className="tech-label">{TRANSFORMATION.afterLabel}</h3>
              </div>
              <ul className="mt-5 flex flex-col gap-3 pl-8">
                {TRANSFORMATION.after.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-paper">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <figure className="relative">
          <span className="spotlight -left-10 -top-10 h-40 w-40" aria-hidden />
          <div
            data-image-slot="retrato-bn-orador"
            data-image-aspect="3/4"
            className={`relative aspect-[3/4] overflow-hidden rounded-2xl border border-line-strong bg-navy-raised transition-all duration-700 ease-out ${portraitStateClassName}`}
          >
            <div
              className="absolute inset-0"
              style={{ background: PORTRAIT_GLOW }}
              aria-hidden
            />
            <div
              className="absolute inset-0"
              style={{ background: PORTRAIT_SCRIM }}
              aria-hidden
            />
            <figcaption className="absolute bottom-8 left-8 right-8">
              <p className="font-serif text-xl font-semibold leading-snug text-paper">
                <span className="serif-accent serif-accent--italic font-normal text-paper">
                  “{TRANSFORMATION.portraitQuote}”
                </span>
              </p>
            </figcaption>
          </div>
        </figure>
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-6 text-center">
        <p className="font-serif text-2xl font-semibold text-paper sm:text-3xl">
          <span className="serif-accent serif-accent--italic font-normal text-gold">
            {TRANSFORMATION.closing}
          </span>
        </p>
        <VoiceWaveform className="mt-12" />
      </div>
    </section>
  );
}
