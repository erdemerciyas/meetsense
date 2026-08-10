"use client";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type BorderBeamProps = {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
};

export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  colorFrom = "transparent",
  colorTo = "var(--accent)",
}: BorderBeamProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden
    >
      <div
        className="border-beam absolute aspect-square animate-border-beam"
        style={
          {
            width: size,
            background: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
            "--beam-duration": `${duration}s`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
