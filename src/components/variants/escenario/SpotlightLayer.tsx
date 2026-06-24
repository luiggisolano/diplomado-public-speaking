"use client";

import { useEffect, useRef } from "react";

/*
  SpotlightLayer — capa de oscuridad teatral con reflector de cursor.

  Mecánica:
  - La capa .esc-darkness cubre la página con opacity:0 por defecto (contenido visible).
  - Al montar, detectamos si el dispositivo tiene puntero fino (mouse).
  - Si SÍ: activamos la oscuridad y empezamos a seguir el cursor vía rAF,
    actualizando CSS custom props --esc-mx / --esc-my en el elemento.
  - Si NO (touch): dejamos la capa oculta; las secciones usan IntersectionObserver.
  - prefers-reduced-motion: nunca activamos la oscuridad.

  Accesibilidad (estado sin JS / sin cursor):
  opacity:0 en el CSS base garantiza que todo el contenido sea visible si el
  script no carga o la media query lo suprime.
*/

export function SpotlightLayer() {
  const darknessRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (reduceMotion || !hasFinePointer) return;

    const el = darknessRef.current;
    if (!el) return;

    el.classList.add("esc-darkness--active");

    function onMouseMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };
    }

    function tick() {
      const el = darknessRef.current;
      if (!el) return;
      const { x, y } = posRef.current;
      const pxX = `${x}px`;
      const pxY = `${y}px`;
      el.style.setProperty("--esc-mx", pxX);
      el.style.setProperty("--esc-my", pxY);
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={darknessRef}
      className="esc-darkness"
      aria-hidden="true"
    />
  );
}
