"use client";

/*
  Firma "LS" adaptada a la dirección CLARA. Es el invariante de marca del estudio (el mismo
  monograma caligráfico del AuthorSignature original), pero repintado en TINTA PROFUNDA sobre
  el hueso, con una micro-salpicadura en bronce de honor, para que se lea sobre fondo claro
  sin tocar el componente compartido. El trazo se dibuja solo al entrar al viewport
  (stroke-dashoffset animado con GSAP, el mismo régimen de motion de la landing) y honra
  prefers-reduced-motion mostrando la firma completa y estática. Copy desde SHARED_AUTHOR.
*/

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsapPlugins,
} from "@/components/premium/_shared/gsapSetup";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";
import { SHARED_AUTHOR } from "@/lib/variants-content";

const SPLATTER_RESTING_OPACITY = 0.5;

export function ReflectorSignature() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const strokes = Array.from(
      root.querySelectorAll<SVGPathElement>("[data-signature-stroke]"),
    );
    const splatters = Array.from(
      root.querySelectorAll<SVGElement>("[data-ink-splatter]"),
    );
    if (strokes.length === 0) {
      return;
    }

    if (prefersReducedMotionNow()) {
      strokes.forEach((stroke) => {
        stroke.style.strokeDasharray = "none";
        stroke.style.strokeDashoffset = "0";
      });
      splatters.forEach((splatter) => {
        splatter.style.opacity = String(SPLATTER_RESTING_OPACITY);
      });
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      strokes.forEach((stroke) => {
        const length = stroke.getTotalLength();
        stroke.style.strokeDasharray = String(length);
        stroke.style.strokeDashoffset = String(length);
      });
      gsap.set(splatters, { opacity: 0, scale: 0.2, transformOrigin: "center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
        },
      });

      timeline.to(strokes, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power2.inOut",
      });
      timeline.to(
        splatters,
        {
          opacity: SPLATTER_RESTING_OPACITY,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.05,
        },
        "-=0.4",
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === root)
        .forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <footer ref={rootRef} className="r-section">
      <div className="r-shell flex flex-col items-center gap-5 text-center">
        <hr className="r-hairline w-16" />
        <svg
          viewBox="0 0 240 120"
          className="h-20 w-auto r-sign__mono"
          fill="none"
          role="img"
          aria-label={`Firma del estudio ${SHARED_AUTHOR.studio}`}
        >
          <defs>
            <filter id="reflector-ink-texture" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves={1}
                seed={7}
                result="inkNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="inkNoise"
                scale={1.4}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g
            filter="url(#reflector-ink-texture)"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              data-signature-stroke
              d="M52 24 C 40 22, 36 32, 40 50 C 44 72, 44 86, 62 92 C 78 97, 98 86, 106 72"
              strokeWidth={3.2}
            />
            <path
              data-signature-stroke
              d="M106 50 C 132 26, 158 40, 142 58 C 128 73, 120 79, 140 90 C 156 99, 178 91, 190 72"
              strokeWidth={3.2}
            />
            <path
              data-signature-stroke
              d="M34 104 C 96 92, 168 116, 212 97 C 220 93, 215 86, 207 91"
              strokeWidth={1.8}
              opacity={0.8}
            />
          </g>

          <g fill="#b4822d" stroke="none">
            <circle data-ink-splatter cx={198} cy={64} r={2.1} />
            <circle data-ink-splatter cx={207} cy={73} r={1.4} />
            <circle data-ink-splatter cx={214} cy={59} r={1} />
            <circle data-ink-splatter cx={189} cy={82} r={1.6} />
          </g>
        </svg>

        <p className="r-sign__caption">
          {SHARED_AUTHOR.label} {SHARED_AUTHOR.studio} · {SHARED_AUTHOR.year}
        </p>
        <p className="r-sign__caption" style={{ opacity: 0.72 }}>
          {SHARED_AUTHOR.note}
        </p>
      </div>
    </footer>
  );
}
