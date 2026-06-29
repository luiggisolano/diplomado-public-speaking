"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { INSCRIPTION_DEADLINE } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const diff = INSCRIPTION_DEADLINE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(display);

  useEffect(() => {
    if (prev.current === display) return;
    prev.current = display;
    anime({
      targets: ref.current,
      translateY: [-14, 0],
      opacity: [0, 1],
      duration: 420,
      easing: "cubicBezier(.34,1.56,.64,1)",
    });
  }, [display]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative overflow-hidden rounded-lg border border-gold/25 bg-black/60 px-4 py-3 backdrop-blur-md min-w-[64px] text-center gold-border-glow">
        <span
          ref={ref}
          className="block font-display text-3xl sm:text-4xl font-semibold tabular-nums text-cream"
        >
          {display}
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70">
        {label}
      </span>
    </div>
  );
}

interface CountdownTimerProps {
  className?: string;
}

export default function CountdownTimer({ className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div className={`h-[92px] ${className}`} aria-hidden />;
  }

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      <FlipDigit value={timeLeft.days} label="Días" />
      <FlipDigit value={timeLeft.hours} label="Horas" />
      <FlipDigit value={timeLeft.minutes} label="Min" />
      <FlipDigit value={timeLeft.seconds} label="Seg" />
    </div>
  );
}
