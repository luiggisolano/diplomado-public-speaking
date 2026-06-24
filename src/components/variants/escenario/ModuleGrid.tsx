"use client";

import { useEffect, useRef } from "react";
import { SHARED_MODULES } from "@/lib/variants-content";

/*
  ModuleGrid — rejilla de los 6 módulos como "luces en el escenario".

  En dispositivos con mouse:
  - Al hacer hover sobre una tarjeta, la card se ilumina con halo dorado (CSS).
  - El halo sigue la posición interna del cursor (--esc-card-mx / --esc-card-my).

  En dispositivos touch (pointer: coarse):
  - IntersectionObserver añade .esc-module-card--lit cuando la tarjeta entra
    al viewport (≥60% visible), creando un efecto de "encenderse" al scrollear.
  - prefers-reduced-motion: las tarjetas están iluminadas por defecto (--lit siempre).
*/

export function ModuleGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>(".esc-module-card")
    );

    if (reduceMotion) {
      cards.forEach((card) => card.classList.add("esc-module-card--lit"));
      return;
    }

    if (hasFinePointer) {
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--esc-card-mx", `${x}%`);
          card.style.setProperty("--esc-card-my", `${y}%`);
        }, { passive: true });
      });
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const card = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              card.classList.add("esc-module-card--lit");
            } else {
              card.classList.remove("esc-module-card--lit");
            }
          });
        },
        { threshold: 0.6 }
      );

      cards.forEach((card) => observer.observe(card));
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div ref={gridRef} className="esc-modules-grid" role="list">
      {SHARED_MODULES.map((mod) => (
        <div
          key={mod.key}
          className="esc-module-card"
          role="listitem"
        >
          <span className="esc-module-num">{mod.n}</span>
          <h3 className="esc-module-title">{mod.title}</h3>
          <p className="esc-module-line">{mod.line}</p>
          <div className="esc-beam-indicator" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
