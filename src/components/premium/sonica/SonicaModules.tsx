"use client";

/*
  Galería horizontal PINNED de los seis módulos. Con movimiento permitido, la sección
  se ancla (pin) y el track se desplaza en X ligado al scroll (scrub), convirtiendo el
  avance vertical del usuario en un recorrido horizontal por las seis disciplinas. Una
  barra fina refleja el progreso del recorrido.

  prefers-reduced-motion: el efecto no se instala; el CSS convierte el track en una
  pila vertical estática legible (sin scroll horizontal forzado, sin pin, sin scrub).
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import { SHARED_MODULES, SHARED_PROMISE } from "@/lib/variants-content";

export function SonicaModules() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    registerGsapPlugins();

    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track || prefersReducedMotionNow()) {
      return;
    }

    section.classList.add("son-mods--pinned");

    const context = gsap.context(() => {
      const getScrollDistance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: horizontalTween,
        onUpdate: (self) => {
          if (progress) {
            gsap.set(progress, { scaleX: self.progress });
          }
        },
      });
    }, section);

    return () => {
      context.revert();
      section.classList.remove("son-mods--pinned");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="son-section son-mods"
      aria-labelledby="son-mods-heading"
    >
      <div className="son-mods__viewport">
        <div ref={trackRef} className="son-mods__track">
          <div className="son-mods__intro">
            <p className="son-label">06 disciplinas · un especialista cada una</p>
            <h2 id="son-mods-heading" className="son-h son-mods__title">
              Seis frecuencias,
              <br />
              una sola voz.
            </h2>
            <p className="son-body son-dim">{SHARED_PROMISE.body}</p>
          </div>

          {SHARED_MODULES.map((module) => (
            <article key={module.key} className="son-mod">
              <div className="son-mod__head">
                <span className="son-mod__n">{module.n}</span>
                <span className="son-signal" aria-hidden="true" />
              </div>
              <h3 className="son-mod__title">{module.title}</h3>
              <p className="son-mod__line">{module.line}</p>
              <span className="son-mod__key">{module.key}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="son-mods__progress" aria-hidden="true">
        <span ref={progressRef} className="son-mods__progress-bar" />
      </div>
    </section>
  );
}
