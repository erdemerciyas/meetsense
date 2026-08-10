"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type WaveformCanvasProps = {
  className?: string;
  intensity?: number;
  /** Skip solid background fill — for layering over hero video */
  overlay?: boolean;
};

export function WaveformCanvas({
  className,
  intensity = 1,
  overlay = false,
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

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
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "rgba(12, 10, 8, 1)");
        gradient.addColorStop(0.5, "rgba(22, 18, 14, 1)");
        gradient.addColorStop(1, "rgba(34, 28, 22, 1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const bars = Math.floor(width / 8);
      const centerY = height / 2;

      for (let i = 0; i < bars; i++) {
        const progress = i / bars;
        const wave =
          Math.sin(progress * Math.PI * 6 + tick * 0.04) * 0.35 +
          Math.sin(progress * Math.PI * 14 + tick * 0.02) * 0.2;
        const barHeight = (wave + 0.55) * height * 0.28 * intensity;
        const alpha = 0.25 + progress * 0.55;

        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.fillRect(i * 8 + 2, centerY - barHeight / 2, 4, barHeight);
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
  }, [intensity, overlay, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
