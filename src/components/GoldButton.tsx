"use client";

import { type ReactNode, useRef } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import anime from "animejs";

interface GoldButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function GoldButton({
  children,
  href,
  className = "",
  size = "md",
}: GoldButtonProps) {
  const glowRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    anime.remove(glowRef.current);
    anime({
      targets: glowRef.current,
      opacity: [0, 0.55],
      scale: [0.8, 1.25],
      duration: 600,
      easing: "easeOutQuad",
    });
  };

  const onLeave = () => {
    anime({
      targets: glowRef.current,
      opacity: 0,
      duration: 400,
      easing: "easeOutQuad",
    });
  };

  const sizeClasses = {
    sm: "px-6 py-3 text-[12px]",
    md: "px-8 py-4 text-[13px]",
    lg: "px-10 py-5 text-[14px]",
  };

  return (
    <a
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold font-semibold uppercase tracking-[0.08em] text-black transition-transform duration-150 hover:-translate-y-px shadow-[0_4px_24px_rgba(201,168,92,0.35)] ${sizeClasses[size]} ${className}`}
    >
      <span
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 blur-xl"
        style={{ background: "radial-gradient(circle, #E8D49A 0%, transparent 70%)" }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <ArrowRight
          size={15}
          weight="bold"
          className="group-hover:translate-x-0.5 transition-transform duration-150"
        />
      </span>
    </a>
  );
}
