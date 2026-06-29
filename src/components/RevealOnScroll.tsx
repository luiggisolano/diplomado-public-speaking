"use client";

import { type ReactNode } from "react";
import { useRevealAnime } from "@/hooks/useRevealAnime";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  translateY?: number;
}

export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  translateY = 32,
}: RevealOnScrollProps) {
  const ref = useRevealAnime<HTMLDivElement>({ delay, translateY });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
