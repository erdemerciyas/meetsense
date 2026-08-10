"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/components/theme/ThemeProvider";

type WaveformCanvasProps = {
  className?: string;
  intensity?: number;
  /** Skip solid background fill — for layering over hero video */
  overlay?: boolean;
};

function readCssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function WaveformCanvas({
  className,
  intensity = 1,
  overlay = false,
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let tick = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      if (!overlay) {
        const background = readCssColor("--background", "#0c0a08");
        const surface = readCssColor("--surface", "#16120e");
        const elevated = readCssColor("--surface-elevated", "#221c16");
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, background);
        gradient.addColorStop(0.5, surface);
        gradient.addColorStop(1, elevated);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const bars = Math.floor(width / 8);
      const centerY = height / 2;
      const accent = readCssColor("--accent", "#f59e0b");

      for (let i = 0; i < bars; i++) {
        const progress = i / bars;
        const wave =
          Math.sin(progress * Math.PI * 6 + tick * 0.04) * 0.35 +
          Math.sin(progress * Math.PI * 14 + tick * 0.02) * 0.2;
        const barHeight = (wave + 0.55) * height * 0.28 * intensity;
        const alpha = 0.25 + progress * 0.55;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = accent;
        ctx.fillRect(i * 8 + 2, centerY - barHeight / 2, 4, barHeight);
        ctx.globalAlpha = 1;
      }

      tick += reducedMotion ? 0 : 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [intensity, overlay, reducedMotion, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
