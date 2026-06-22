"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { LineIcon } from "@/components/LineIcon";
import { DotGrid } from "@/components/motion/DotGrid";
import { MicrophoneMotif } from "@/components/motion/MicrophoneMotif";
import { CountUp } from "@/components/motion/CountUp";
import { HERO, PRIMARY_CTA_HREF } from "@/lib/content";

/*
  Bloque 1 — Hero. Composición asimétrica académico-futurista: a la izquierda, eyebrow
  técnica en mono, titular en serif Spectral con la línea de cierre en ámbar institucional,
  subtítulo, CTA azul y la fila de datos animados (CountUp). A la derecha, el panel-instrumento
  con la grilla de partículas (firma animejs.com) y el emblema de micrófono que traza su
  silueta y emite ondas. Sobre todo, el plano blueprint y los halos del hero-field. La entrada
  se orquesta con una timeline de anime.js (líneas enmascaradas + escalonado). Respeta
  prefers-reduced-motion mostrando el contenido completo.
*/

const MOUNT_DELAY_MS = 150;

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animatedNodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-hero]"),
    );

    if (prefersReducedMotion) {
      animatedNodes.forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "none";
      });
      return;
    }

    const timeline = createTimeline({
      defaults: { ease: "out(4)", duration: 1100 },
    });

    timeline
      .add(
        '[data-hero="pretitle"]',
        { opacity: [0, 1], translateY: [16, 0], duration: 800 },
        MOUNT_DELAY_MS,
      )
      .add(
        '[data-hero="line"]',
        { translateY: ["110%", "0%"], duration: 1200, delay: stagger(140) },
        "-=400",
      )
      .add(
        '[data-hero="subtitle"]',
        { opacity: [0, 1], translateY: [20, 0] },
        "-=700",
      )
      .add(
        '[data-hero="cta"]',
        { opacity: [0, 1], translateY: [20, 0], scale: [0.96, 1] },
        "-=850",
      )
      .add(
        '[data-hero="stat"]',
        { opacity: [0, 1], translateY: [16, 0], delay: stagger(90) },
        "-=800",
      )
      .add(
        '[data-hero="panel"]',
        { opacity: [0, 1], scale: [0.94, 1], duration: 1300 },
        "-=1200",
      )
      .add(
        '[data-hero="trust"]',
        { opacity: [0, 1], translateY: [12, 0], delay: stagger(60) },
        "-=700",
      );

    return () => {
      timeline.pause();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="grain relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-6 pb-16 pt-32"
    >
      <HeroBackdrop />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col">
          <p
            data-hero="pretitle"
            className="tech-label mb-7 flex items-center gap-3 opacity-0"
          >
            <span className="inline-block h-px w-8 bg-blue-bright/50" />
            {HERO.preTitle}
          </p>

          <h1 className="font-serif text-[length:var(--text-display)] font-semibold leading-[1.04] tracking-[-0.02em] text-paper">
            <span className="mask-line">
              <span data-hero="line" className="inline-block">
                {HERO.titleLineOne}
              </span>
            </span>
            <span className="mask-line">
              <span data-hero="line" className="inline-block">
                {HERO.titleLineTwo}{" "}
                <em className="serif-accent serif-accent--italic font-normal text-gold">
                  {HERO.titleAccent}
                </em>
              </span>
            </span>
          </h1>

          <p
            data-hero="subtitle"
            className="mt-7 max-w-xl text-base leading-relaxed text-mist opacity-0 sm:text-lg"
          >
            {HERO.subtitle}
          </p>

          <div
            data-hero="cta"
            className="mt-10 flex flex-col items-start gap-5 opacity-0 sm:flex-row sm:items-center sm:gap-7"
          >
            <a
              href={PRIMARY_CTA_HREF}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-blue-bright to-blue px-9 py-4 text-sm font-semibold tracking-wide text-paper transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(77,147,245,0.6)]"
            >
              {HERO.cta}
              <LineIcon
                name="arrow-right"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </a>
            <p className="max-w-[17rem] text-xs leading-relaxed text-mist-dim">
              {HERO.microcopy}
            </p>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {HERO.stats.map((stat) => (
              <div
                key={stat.label}
                data-hero="stat"
                className="flex flex-col gap-1 border-l border-line pl-4 opacity-0"
              >
                <dt className="text-3xl font-semibold text-blue-bright sm:text-4xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="text-[0.7rem] uppercase tracking-[0.14em] text-mist-dim">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          data-hero="panel"
          className="relative hidden aspect-square w-full opacity-0 lg:block"
        >
          <div className="card-tech absolute inset-0 overflow-hidden rounded-2xl">
            <DotGrid
              columns={16}
              rows={16}
              className="absolute inset-0 p-6 opacity-70"
            />
            <div className="spotlight absolute -right-10 -top-10 h-48 w-48" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MicrophoneMotif className="h-[62%] w-auto drop-shadow-[0_0_30px_rgba(77,147,245,0.35)]" />
            </div>
            <p className="tech-label absolute bottom-5 left-6 text-[0.6rem] opacity-80">
              CEC · UTMACH / 2026
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-14 w-full max-w-6xl border-t border-line pt-7">
        <p className="tech-label mb-4 text-[0.6rem]">Aval institucional</p>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-mist sm:text-sm">
          {HERO.trust.map((item, index) => (
            <li
              key={item}
              data-hero="trust"
              className="flex items-center gap-3 opacity-0"
            >
              {index > 0 && (
                <span className="h-1 w-1 rounded-full bg-gold/70" aria-hidden />
              )}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/*
  Capa de fondo del hero. El plano blueprint (retícula técnica) sobre los halos del
  hero-field arma la atmósfera de aula futura. La viñeta inferior fija el texto sobre el
  navy. Todo es decorativo (aria-hidden).
*/
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <div className="hero-field absolute inset-0" />
      <div className="blueprint absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, rgba(7,17,42,0.7) 85%, var(--color-abyss) 100%)",
        }}
      />
    </div>
  );
}
