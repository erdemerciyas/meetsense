"use client";

import { useEffect } from "react";

/** Publishes the pointer position as --px/--py (-1..1) so margin ornaments can lean toward it. */
export function PointerLean() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const root = document.documentElement;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onMove);
    };
  }, []);
  return null;
}
