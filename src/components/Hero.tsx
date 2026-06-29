"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "@phosphor-icons/react";
import CountdownTimer from "./CountdownTimer";
import GoldButton from "./GoldButton";
import { CTA_LINK } from "@/lib/constants";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
    >
      <Image
        src="/hero-speaker.png"
        alt="Ponente iluminado frente a una audiencia en un auditorio"
        fill
        priority
        className="object-cover object-[center_30%]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(10,10,10,0.5)_100%)]" />

      {mounted && (
        <div className="absolute top-0 inset-x-0 pt-20 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="animate-fade-in inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80 border border-gold/25 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-shimmer" />
                Inscripciones abiertas · Cupos limitados
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 pt-32">
        <div className="max-w-3xl flex flex-col gap-7">
          <p className="animate-fade-in text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70">
            Diplomado Universitario · 160 horas · Modalidad 100% en línea
          </p>

          <h1 className="animate-fade-in-up animation-delay-100 font-display text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.93] tracking-[-0.01em]">
            Puedes ser el mejor
            <br />
            en lo que haces.
            <br />
            <span className="text-gold">Si no sabes comunicarlo,</span>
            <br />
            nadie lo notará.
          </h1>

          <p className="animate-fade-in-up animation-delay-200 max-w-xl text-cream-dim/80 text-base sm:text-lg leading-relaxed">
            Diplomado en Public Speaking y Comunicación Persuasiva de Alto
            Impacto. Una formación universitaria diseñada para profesionales
            que entendieron que su voz pública es parte de su trabajo.
          </p>

          {mounted && (
            <div className="animate-fade-in-up animation-delay-300 flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Las inscripciones cierran en
              </p>
              <CountdownTimer />
            </div>
          )}

          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <GoldButton href={CTA_LINK} size="lg">
              Asegurar mi cupo
            </GoldButton>
            <a
              href="#programa"
              className="inline-flex items-center justify-center bg-white/8 backdrop-blur-sm border border-white/15 text-cream text-[13px] font-semibold uppercase tracking-[0.08em] px-8 py-4 rounded-full hover:bg-white/15 hover:border-white/30 transition-all duration-150"
            >
              Conocer el programa
            </a>
          </div>

          <p className="animate-fade-in-up animation-delay-500 text-[11px] text-muted tracking-wide">
            Cupos limitados · Inicio en julio · Aval Universidad Técnica de Machala
          </p>
        </div>
      </div>

      <a
        href="#aval"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-white/70 transition-colors animate-bounce"
        aria-label="Continuar"
      >
        <ArrowDown size={22} />
      </a>
    </section>
  );
}
