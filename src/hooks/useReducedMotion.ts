"use client";

import { useEffect, useState } from "react";

/**
 * SSR and the first client render must match. Start with `true` (static markup),
 * then sync to the real preference after mount to avoid hydration mismatches.
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}
