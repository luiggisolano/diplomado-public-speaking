"use client";

/*
  Telemetría de coalescencia. HUD fijo (solo desktop) que refleja el mismo progreso de
  scroll que conduce el campo de partículas: a mayor descenso, mayor coalescencia. Lee
  el scroll con rAF y actualiza el DOM por referencia directa, sin re-render de React,
  para no generar trabajo por frame. Es telemetría decorativa; la página funciona sin
  él, por eso queda oculto en pantallas pequeñas y marcado aria-hidden.
*/

import { useEffect, useRef } from "react";

export function CoalesceHud() {
  const percentRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0
          ? Math.min(Math.max(window.scrollY / scrollable, 0), 1)
          : 0;
      const rounded = Math.round(progress * 100);

      if (percentRef.current) {
        percentRef.current.textContent = `${rounded}%`;
      }
      if (fillRef.current) {
        fillRef.current.style.setProperty("--cam-hud-progress", `${rounded}%`);
      }
      rafId = 0;
    };

    const requestUpdate = () => {
      if (rafId === 0) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div className="cam-hud" aria-hidden="true">
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mist-dim">
        Coalescencia
      </span>
      <div ref={fillRef} className="cam-hud-track">
        <div className="cam-hud-fill" />
      </div>
      <span
        ref={percentRef}
        className="mono-num text-[0.72rem] text-blue-bright"
      >
        0%
      </span>
    </div>
  );
}
