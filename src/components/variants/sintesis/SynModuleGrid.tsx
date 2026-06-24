"use client";

/*
  Módulos con spotlight LOCALIZADO — El Orador Integral.

  El spotlight está CONFINADO a la sección de módulos mediante un overlay
  con mask-image dentro de un contenedor position:relative + overflow:hidden.
  El resto de la página NUNCA se oscurece.

  Comportamiento por dispositivo:
  - pointer:fine (mouse): overlay oscurece suavemente y sigue el cursor dentro
    del contenedor (.syn-modules-wrap). Las tarjetas individuales tienen halo
    interno al hacer hover.
  - pointer:coarse (touch): IntersectionObserver ilumina (.syn-module-card--lit)
    cada tarjeta al entrar al viewport. El overlay no existe en este modo.
  - prefers-reduced-motion: todas las tarjetas quedan iluminadas por defecto.
  - Sin JS / estado base: tarjetas visibles (background-color en reposo legible).

  Garantías de legibilidad:
  - Penumbra suave: backdrop-opacity 0.72 (no negro total), radio mínimo 320px.
  - En reposo (cursor fuera del contenedor) la penumbra desaparece (opacity:0).
*/

import { useEffect, useRef } from "react";
import { SHARED_MODULES } from "@/lib/variants-content";

export function SynModuleGrid() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const posRef   = useRef({ x: 50, y: 50 });
  const isInsideRef = useRef(false);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const overlay = overlayRef.current;
    if (!wrap) return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion   = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>(".syn-module-card"));

    if (reduceMotion) {
      cards.forEach((card) => card.classList.add("syn-module-card--lit"));
      return;
    }

    if (hasFinePointer && overlay) {
      /* Activar la penumbra localizada */
      wrap.classList.add("syn-modules-wrap--active");

      function onMouseEnter() {
        isInsideRef.current = true;
      }

      function onMouseLeave() {
        isInsideRef.current = false;
        if (overlay) overlay.style.opacity = "0";
      }

      function onMouseMove(e: MouseEvent) {
        const rect = wrap!.getBoundingClientRect();
        posRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }

      function tick() {
        if (overlay && isInsideRef.current) {
          const { x, y } = posRef.current;
          overlay.style.setProperty("--syn-mx", `${x}px`);
          overlay.style.setProperty("--syn-my", `${y}px`);
          overlay.style.opacity = "1";
        }
        rafRef.current = requestAnimationFrame(tick);
      }

      wrap.addEventListener("mouseenter", onMouseEnter, { passive: true });
      wrap.addEventListener("mouseleave", onMouseLeave, { passive: true });
      wrap.addEventListener("mousemove",  onMouseMove,  { passive: true });
      rafRef.current = requestAnimationFrame(tick);

      /* Halo interno en cada tarjeta según posición del cursor */
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--syn-card-mx", `${x}%`);
          card.style.setProperty("--syn-card-my", `${y}%`);
        }, { passive: true });
      });

      return () => {
        wrap.removeEventListener("mouseenter", onMouseEnter);
        wrap.removeEventListener("mouseleave", onMouseLeave);
        wrap.removeEventListener("mousemove",  onMouseMove);
        cancelAnimationFrame(rafRef.current);
      };

    } else {
      /* Touch: IntersectionObserver ilumina tarjetas individualmente */
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const card = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              card.classList.add("syn-module-card--lit");
            } else {
              card.classList.remove("syn-module-card--lit");
            }
          });
        },
        { threshold: 0.55 },
      );

      cards.forEach((card) => observer.observe(card));
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div ref={wrapRef} className="syn-modules-wrap">
      {/* Overlay de penumbra — solo visible en pointer:fine con JS */}
      <div
        ref={overlayRef}
        className="syn-modules-overlay"
        aria-hidden="true"
        style={{ opacity: 0 }}
      />

      <div className="syn-modules-grid" role="list">
        {SHARED_MODULES.map((mod) => (
          <div
            key={mod.key}
            className="syn-module-card"
            role="listitem"
          >
            <span className="syn-module-num">{mod.n}</span>
            <h3 className="syn-module-title">{mod.title}</h3>
            <p className="syn-module-line">{mod.line}</p>
            <div className="syn-beam-indicator" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
