"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  RevealOnScroll — envuelve contenido y añade .esc-reveal--visible
  cuando entra al viewport. Para pointer:coarse y en general para
  todas las secciones fuera del spotlight (el spotlight no lo necesita).
  prefers-reduced-motion: el CSS ya fuerza opacity:1/transform:none.
*/

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
}

export function RevealOnScroll({
  children,
  className = "",
  threshold = 0.15,
  delay = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("esc-reveal--visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return (
    <div ref={ref} className={`esc-reveal ${className}`}>
      {children}
    </div>
  );
}
