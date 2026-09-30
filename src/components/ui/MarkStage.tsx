"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Api = Awaited<ReturnType<typeof import("./mark3d").mountMark>>;

/**
 * The 3D MeetSense mark. The flat mark is server-rendered and stays until the 3D one is
 * ready (or for good without WebGL). Reduced motion gets the 3D mark, standing still.
 */
export function MarkStage({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let api: Api | undefined;
    let alive = true;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || api) return;
        io.disconnect();
        if (!document.createElement("canvas").getContext("webgl2")) return;
        const { mountMark } = await import("./mark3d");
        const made = await mountMark(host.current!, { still: matchMedia("(prefers-reduced-motion: reduce)").matches });
        if (!alive) return made.dispose();
        api = made;
        setLive(true);
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(host.current!);
    return () => {
      alive = false;
      io.disconnect();
      api?.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <div ref={host} className="absolute inset-0" />
      <img src="/brand/meetsense-mark.svg" alt="" className={cn("absolute inset-[22%] transition-opacity duration-500", live && "opacity-0")} />
    </div>
  );
}
