"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * The follow-up's paper plane: a hand-drawn trail across the full page width. As the block
 * scrolls through the viewport the plane swoops in, loops twice and climbs away, the line
 * drawing in behind it. Reduced motion: the finished drawing just sits there.
 */
const W = 1600;
const H = 520;
const D =
  "M-60 40C180 60 300 380 560 420C760 450 860 300 780 220C700 140 580 260 680 360C800 470 1000 480 1120 380C1200 310 1180 180 1090 200C1000 220 1040 360 1180 370C1330 380 1460 300 1660 120";

export function Flight({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const plane = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = box.current!;
    const path = trail.current!;
    const r = plane.current!;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;

    const place = (p: number) => {
      const at = Math.max(0.5, p * len);
      const a = path.getPointAtLength(at - 0.5);
      const b = path.getPointAtLength(Math.min(len, at + 0.5));
      const pt = path.getPointAtLength(at);
      const heading = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      r.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${heading})`);
      path.style.strokeDashoffset = `${len - at}`;
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return place(1);

    let frame = 0;
    const update = () => {
      const { top, height } = el.getBoundingClientRect();
      // 0 as the block enters the bottom of the screen, 1 once its middle passes the top third
      const p = (innerHeight - top) / (innerHeight * 0.66 + height / 2);
      place(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) addEventListener("scroll", onScroll, { passive: true });
      else removeEventListener("scroll", onScroll);
      update();
    });
    io.observe(el);
    update();
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-[calc(50%-50vw)] -z-10 hidden w-screen text-steel-lo lg:block", className)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} overflow="visible" className="w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path ref={trail} d={D} className="opacity-60" />
        <g ref={plane} className="text-ink-3" stroke="currentColor">
          <path d="M0 0-52-22-36-2-44 18Z" className="fill-paper" />
          <path d="M-36-2 0 0M-36-2-32 10" />
        </g>
      </svg>
    </div>
  );
}
