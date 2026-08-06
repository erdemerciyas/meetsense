"use client";

import { useLayoutEffect } from "react";
import { initTeamsScroll } from "@/lib/teamsScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function TeamsScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    return initTeamsScroll();
  }, [reducedMotion]);

  return <>{children}</>;
}
