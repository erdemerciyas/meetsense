"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessData } from "./process3d";
import { cn } from "@/lib/cn";

type Api = Awaited<ReturnType<typeof import("./process3d").mountProcess>>;
type Step = { id: string; time: string; title: string };

/**
 * A pinned 3D walk through one meeting's life. Scrolling past it scrubs the scene step by
 * step; each step links to its chapter below. Wide screens with motion allowed and WebGL
 * only: elsewhere it renders nothing, and the chapters tell the same story on their own.
 */
export function ProcessStage({ data, steps }: { data: ProcessData; steps: Step[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const col = useRef<HTMLDivElement>(null);
  const [off, setOff] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Hidden by CSS below lg or with reduced motion; then there's nothing to build
    if (!matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;

    let api: Api | undefined;
    let loading = false;
    let alive = true;
    let frame = 0;

    const progress = () => {
      const r = wrap.current!.getBoundingClientRect();
      return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))) * steps.length;
    };
    const update = () => {
      const P = progress();
      api?.set(P);
      setActive(Math.min(steps.length - 1, Math.floor(P)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    // Build the scene as it approaches, tear it down once it's well out of view
    const io = new IntersectionObserver(
      async ([e]) => {
        if (e.isIntersecting && !api && !loading) {
          if (!document.createElement("canvas").getContext("webgl2")) return setOff(true);
          loading = true;
          const { mountProcess } = await import("./process3d");
          const made = await mountProcess(host.current!, data);
          loading = false;
          if (!alive || !e.target.isConnected) return made.dispose();
          api = made;
          update();
        } else if (!e.isIntersecting && api) {
          api.dispose();
          api = undefined;
        }
      },
      { rootMargin: "100% 0px" },
    );
    const bleed = () => {
      host.current!.style.left = `${-col.current!.getBoundingClientRect().left}px`;
    };
    bleed();
    io.observe(wrap.current!);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", bleed);
    return () => {
      removeEventListener("resize", bleed);
      alive = false;
      io.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      api?.dispose();
    };
  }, [data, steps.length]);

  if (off) return null;
  return (
    <div ref={wrap} className="relative mt-16 hidden lg:motion-safe:block xl:mt-8" style={{ height: `${steps.length * 75 + 100}vh` }}>
      <div className="sticky top-16 grid h-[calc(100vh-4rem)] grid-cols-12 items-center gap-10">
        {/* The canvas bleeds left into the page margin so the scene has room */}
        <div ref={col} className="relative col-span-8 h-[78%]">
          <div ref={host} aria-hidden="true" className="absolute inset-y-0 right-0 left-0 [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]" />
        </div>
        <ol className="col-span-4 space-y-7">
          {steps.map((s, i) => (
            <li key={s.id} className={cn("border-l-2 pl-5 transition-[opacity,border-color] duration-300", i === active ? "border-ember" : "border-rule opacity-40")}>
              <p className={cn("mono text-[0.8125rem] font-semibold", i === active ? "text-ember-ink" : "text-ink-3")}>{s.time}</p>
              <a href={`#${s.id}`} className="mt-1 block text-[1.25rem] leading-snug font-bold tracking-[-0.01em] hover:text-ember-ink">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
