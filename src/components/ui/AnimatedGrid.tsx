"use client";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AnimatedGrid({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "animated-grid pointer-events-none absolute inset-0",
        !reducedMotion && "animated-grid--active",
        className,
      )}
      aria-hidden
    />
  );
}
