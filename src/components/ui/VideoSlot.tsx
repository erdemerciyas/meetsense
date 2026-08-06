"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { MediaSlot } from "@/content/media";
import { WaveformCanvas } from "./WaveformCanvas";

type VideoSlotProps = {
  slot: MediaSlot;
  className?: string;
  parallax?: boolean;
};

function AnimatedMockup() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(252,211,77,0.12),transparent_35%)]" />
      <div className="absolute inset-x-6 top-6 h-8 rounded-lg border border-white/10 bg-white/5" />
      <div className="absolute inset-x-6 top-20 bottom-6 rounded-xl border border-white/10 bg-background/70 p-4">
        <div className="mb-3 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-300/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </div>
        <div className="space-y-2">
          {[88, 72, 94, 64, 80].map((width, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-white/10"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="aspect-video rounded-lg border border-accent/20 bg-accent/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GradientFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#0c0a08_0%,#16120e_35%,#221c16_70%,#0c0a08_100%)]" />
      <div className="absolute inset-0 opacity-40">
        <WaveformCanvas className="h-full w-full" intensity={1.4} />
      </div>
    </div>
  );
}

export function VideoSlot({ slot, className, parallax = false }: VideoSlotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFullScreen = slot.fullScreen;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !slot.src) return;

    if (slot.autoPlay) {
      void video.play().catch(() => undefined);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else if (!slot.autoPlay) {
          video.pause();
        }
      },
      { threshold: slot.autoPlay ? 0.1 : 0.35 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [slot.autoPlay, slot.src]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        isFullScreen
          ? "h-full w-full"
          : "rounded-2xl border border-white/10",
        parallax && "will-change-transform",
        className,
      )}
      style={isFullScreen ? undefined : { aspectRatio: slot.aspectRatio ?? "16/9" }}
    >
      {slot.src ? (
        <video
          ref={videoRef}
          className={cn(
            isFullScreen
              ? "absolute top-1/2 left-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
              : "h-full w-full object-cover",
          )}
          muted
          loop
          playsInline
          poster={slot.poster}
          preload={slot.autoPlay ? "auto" : "none"}
          autoPlay={slot.autoPlay}
        >
          <source src={slot.src} type="video/mp4" />
        </video>
      ) : slot.fallback === "waveform" ? (
        <WaveformCanvas className="h-full w-full" />
      ) : slot.fallback === "gradient" ? (
        <GradientFallback />
      ) : (
        <AnimatedMockup />
      )}
      {!isFullScreen ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      ) : null}
    </div>
  );
}
