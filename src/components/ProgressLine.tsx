"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

export default function ProgressLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        anime({
          targets: el,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 1600,
          easing: "easeInOutSine",
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      viewBox="0 0 4 500"
      className="h-full w-1 absolute left-0 top-0"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M2 0 L2 500"
        stroke="#C9A85C"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
