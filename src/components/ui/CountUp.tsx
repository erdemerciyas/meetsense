"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CountUp({
  value,
  suffix = "",
  locale = "tr",
  className,
}: {
  value: number;
  suffix?: string;
  locale?: Locale;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [animatedValue, setAnimatedValue] = useState(0);
  const display = reducedMotion ? value : animatedValue;

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const duration = 1800;
        const start = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setAnimatedValue(Math.floor(value * eased));
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, reducedMotion]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display.toLocaleString(locale === "tr" ? "tr-TR" : "en-US")}
      {suffix}
    </span>
  );
}
