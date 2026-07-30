"use client";

/*
  Panel de instrumentos (pinned) — la escena firma de Cámara Anecoica. El método del
  diplomado se lee como una consola de medición de la sala anecoica: al fijar la
  sección, el progreso de scroll ilumina cada etapa y llena su barra, una a una, como
  un barrido de calibración. Es mejora progresiva pura: el pin y el scrub solo se
  activan en desktop con movimiento permitido (gsap.matchMedia); en móvil, pantallas
  pequeñas o reduced-motion la consola cae a su estado estático legible, con todas las
  etapas completas y visibles. El barrido conduce el DOM por referencia directa (clases
  y variable --fill), sin re-render por frame.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { SHARED_METHOD } from "@/lib/variants-content";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const PIN_TRAVEL_FACTOR = 2.4;

export function MethodConsole() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinRef.current;
    if (!section || !pinned) {
      return;
    }

    registerGsapPlugins();
    const total = SHARED_METHOD.pillars.length;
    const matchMedia = gsap.matchMedia();

    matchMedia.add(PIN_QUERY, () => {
      pinned.classList.add("cam-console--live");
      stageRefs.current.forEach((element) => {
        element?.style.setProperty("--fill", "0");
      });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * PIN_TRAVEL_FACTOR}`,
        pin: pinned,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const scaled = progress * total;
          const activeIndex = Math.min(Math.floor(scaled), total - 1);

          if (readoutRef.current) {
            readoutRef.current.textContent = String(activeIndex + 1).padStart(
              2,
              "0",
            );
          }
          if (percentRef.current) {
            percentRef.current.textContent = `${Math.round(progress * 100)}%`;
          }

          stageRefs.current.forEach((element, index) => {
            if (!element) {
              return;
            }
            const localFill = Math.min(Math.max(scaled - index, 0), 1);
            element.style.setProperty("--fill", localFill.toFixed(3));
            element.classList.toggle("is-active", index === activeIndex);
            element.classList.toggle("is-done", index < activeIndex);
          });
        },
      });

      return () => {
        trigger.kill();
        pinned.classList.remove("cam-console--live");
        stageRefs.current.forEach((element) => {
          element?.style.removeProperty("--fill");
          element?.classList.remove("is-active", "is-done");
        });
      };
    });

    return () => matchMedia.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="metodo"
      aria-labelledby="metodo-title"
      className="relative z-[1] bg-abyss"
    >
      <div ref={pinRef} className="cam-console">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-0">
          <div>
            <p className="tech-label">{SHARED_METHOD.eyebrow}</p>
            <h2
              id="metodo-title"
              className="mt-5 font-serif text-[clamp(2rem,1.2rem+2.6vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.02em] text-paper"
            >
              {SHARED_METHOD.headline}
            </h2>

            <div className="mt-10 flex items-end gap-8 border-t border-line pt-6">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mist-dim">
                  Etapa
                </p>
                <p className="mt-2 font-mono text-4xl text-paper">
                  <span ref={readoutRef}>01</span>
                  <span className="text-mist-dim"> / 0{SHARED_METHOD.pillars.length}</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mist-dim">
                  Calibración
                </p>
                <p className="mt-2 font-mono text-4xl text-blue-bright">
                  <span ref={percentRef}>0%</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            {SHARED_METHOD.pillars.map((pillar, index) => (
              <div
                key={pillar.t}
                ref={(element) => {
                  stageRefs.current[index] = element;
                }}
                className="cam-stage"
              >
                <div className="flex items-baseline gap-5">
                  <span className="cam-stage-index font-mono text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl tracking-[-0.01em]">
                      {pillar.t}
                    </h3>
                    <p className="mt-2 max-w-md text-[0.98rem] leading-relaxed text-mist">
                      {pillar.d}
                    </p>
                    <div className="cam-stage-bar" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
