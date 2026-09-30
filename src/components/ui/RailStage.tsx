"use client";

import { useEffect, useRef, useState } from "react";
import type { RailData } from "./rail3d";
import { cn } from "@/lib/cn";
import { introDone } from "@/lib/intro";

type Api = Awaited<ReturnType<typeof import("./rail3d").mountRail>>;

/**
 * Swaps the 2D rail board for the 3D one on wide screens with motion allowed and WebGL
 * available. The 2D board is server-rendered and stays in the DOM (visually hidden) for
 * screen readers; everywhere else it is simply what you see. three.js loads on demand.
 */
export function RailStage({ data, children }: { data: RailData; children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"2d" | "pending" | "3d">("2d");

  useEffect(() => {
    const mq = matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let api: Api | undefined;
    let run = 0;

    const start = async () => {
      if (api || !mq.matches || !document.createElement("canvas").getContext("webgl2")) return;
      const id = ++run;
      setState("pending");
      try {
        const { mountRail } = await import("./rail3d");
        // Tickets print once: not behind the loader's curtain
        await introDone();
        if (id !== run) return;
        api = await mountRail(host.current!, data);
        if (id !== run) return api.dispose();
        setState("3d");
      } catch {
        setState("2d");
      }
    };
    const stop = () => {
      run++;
      api?.dispose();
      api = undefined;
      setState("2d");
    };
    const onChange = () => (mq.matches ? start() : stop());
    const onHit = (e: Event) => api?.hit((e as CustomEvent<string>).detail);

    mq.addEventListener("change", onChange);
    addEventListener("ms:hit", onHit);
    start();
    return () => {
      mq.removeEventListener("change", onChange);
      removeEventListener("ms:hit", onHit);
      stop();
    };
  }, [data]);

  return (
    <div className="relative">
      <div className={cn(state === "pending" && "opacity-0", state === "3d" && "sr-only")}>{children}</div>
      <div ref={host} aria-hidden="true" className={cn(state === "3d" ? "block" : "pointer-events-none absolute inset-x-0 top-0 opacity-0")} />
    </div>
  );
}
