"use client";

import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    return initSmoothScroll();
  }, [reducedMotion]);

  return <>{children}</>;
}
