"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

interface CountUpProps {
  to: number;
  suffix?: string;
  className?: string;
}

export default function CountUp({ to, suffix = "", className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const obj = { n: 0 };
        anime({
          targets: obj,
          n: to,
          duration: 1800,
          round: 1,
          easing: "easeOutExpo",
          update: () => {
            if (el) el.textContent = `${obj.n}${suffix}`;
          },
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, suffix]);

  return (
    <span ref={ref} className={`font-display tabular-nums ${className}`}>
      {`0${suffix}`}
    </span>
  );
}
