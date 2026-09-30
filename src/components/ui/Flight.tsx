"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * A playful hand-drawn trail across the full page width. As the block scrolls through
 * the viewport a small rider travels along the path and the line draws in behind it.
 * Each rider moves in its own character: the plane follows its heading, the calendar
 * sways like a falling leaf, the mic stays upright on its waveform.
 * Reduced motion: the finished drawing just sits there, rider at the end.
 */
const W = 1600;
const H = 520;

/** Riders are filled with the ground so the trail doesn't show through them */
const F = { fill: "var(--flight-bg, var(--color-paper))" };
const E = { stroke: "var(--color-ember)" };

// A voice waveform: alternating peaks of uneven height
const AMP = [6, 18, 34, 12, 40, 22, 8, 30, 46, 16, 26, 10];
const WAVE = "M-60 150" + Array.from({ length: 43 }, (_, i) => `Q${-40 + i * 40} ${150 + (i % 2 ? 1 : -1) * AMP[i % 12]} ${-20 + i * 40} 150`).join("");

type Rot = "follow" | "upright" | "sway";

const FLIGHTS = {
  // Invite: a calendar sheet drifting down like a leaf
  invite: {
    d: "M1660-60C1400-40 1300 40 1360 90C1420 140 1180 150 1000 120C820 90 760 150 860 190C960 230 700 250 500 200C340 160 200 190-60 230",
    rot: "sway",
    rider: (
      <g>
        <rect x="-18" y="-16" width="36" height="32" rx="2" style={F} />
        <path d="M-18-6h36M-9-22v10M9-22v10" />
        <circle cx="0" cy="5" r="5" style={E} />
      </g>
    ),
  },
  // Record: a mic riding the voice waveform
  record: {
    d: WAVE,
    rot: "upright",
    rider: (
      <g>
        <rect x="-10" y="-40" width="20" height="32" rx="10" style={F} />
        <path d="M-17-22a17 17 0 0 0 34 0M0-5v5" />
        <circle cx="0" cy="-30" r="2.5" style={{ ...E, fill: "var(--color-ember)" }} />
      </g>
    ),
  },
  // The moment: a speech bubble bouncing along, then a big hop
  moment: {
    d: "M-60 300Q80 110 220 300Q340 150 460 300Q560 190 660 300Q740 230 820 300Q880 260 940 300Q1240 20 1660 240",
    rot: "upright",
    rider: (
      <g>
        <path d="M-24-52h48a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H-4l-10 12v-12h-10a6 6 0 0 1-6-6v-22a6 6 0 0 1 6-6Z" style={F} />
        <path d="M-16-38h26M-16-30h12" />
        <path d="M0-30h10" style={E} />
      </g>
    ),
  },
  // Close: the minutes curl off the printer like a paper ribbon
  close: {
    d: "M1660 40C1400 60 1300 160 1360 220C1420 280 1480 180 1400 150C1300 110 1140 240 960 260C780 280 700 330 540 320C420 312 400 250 460 250C540 250 460 330-60 320",
    rot: "sway",
    rider: (
      <g>
        <path d="M-14-20h28v36l-5-4-4 4-5-4-4 4-5-4-5 4Z" style={F} />
        <path d="M-8-11h16M-8-4h11" />
        <path d="M-8 4l3 3 6-6" style={E} />
      </g>
    ),
  },
  // Follow-up: the paper plane swoops in, loops twice, climbs away
  plane: {
    d: "M-60 40C180 60 300 380 560 420C760 450 860 300 780 220C700 140 580 260 680 360C800 470 1000 480 1120 380C1200 310 1180 180 1090 200C1000 220 1040 360 1180 370C1330 380 1460 300 1660 120",
    rot: "follow",
    rider: (
      <g>
        <path d="M0 0-52-22-36-2-44 18Z" style={F} />
        <path d="M-36-2 0 0M-36-2-32 10" />
      </g>
    ),
  },
  // Weekly: a trend line climbing the week, one loop where it stumbled
  weekly: {
    d: "M-60 470L160 400L300 440L460 330L560 380C640 420 700 300 640 260C580 220 540 320 680 300L860 220L980 260L1160 140L1280 180L1460 60L1660-20",
    rot: "follow",
    rider: <path d="M0 0-20-11-15 0-20 11Z" style={{ ...E, fill: "var(--color-ember)" }} />,
  },
  // Later: a magnifier wandering over the archive, circling one spot
  magnifier: {
    d: "M1660 80C1440 120 1300 60 1160 140C1020 220 1080 360 960 380C860 396 820 300 890 270C960 240 980 350 880 420C760 500 520 460 380 400C240 340 100 380-60 460",
    rot: "upright",
    rider: (
      <g>
        <circle cx="0" cy="0" r="18" style={F} />
        <path d="M13 13 30 30" strokeWidth="4" />
      </g>
    ),
  },
  // Templates: a pencil scribbling a loose underline with a curl
  pencil: {
    d: "M-60 300C140 260 280 330 420 300C560 270 640 180 600 140C560 100 500 170 560 230C640 310 820 300 980 260C1140 220 1260 300 1380 280C1480 264 1560 220 1660 230",
    rot: "follow",
    rider: (
      <g>
        <path d="M0 0-12-6-12 6Z" style={{ ...E, fill: "var(--color-ember)" }} />
        <path d="M-12-6H-62V6H-12M-54-6V6" style={F} />
      </g>
    ),
  },
  // Enterprise: a key lassoing round before it heads for the lock
  key: {
    d: "M-60 90C300 80 520 120 700 70C860 30 1060 10 1160 60C1260 110 1160 160 1020 140C880 120 940 40 1100 40C1300 40 1440 80 1660 70",
    rot: "follow",
    rider: (
      <g>
        <circle cx="-30" cy="0" r="10" style={F} />
        <path d="M-20 0H12M4 0v8M11 0v6" />
        <circle cx="-30" cy="0" r="3" style={E} />
      </g>
    ),
  },
  // Demo: the calendar slip tossed over, one flip in the air, and it lands
  demo: {
    d: "M-60 140C200 20 480 0 660 60C780 100 700 150 640 120C580 90 740 40 880 70C1000 100 1080 130 1180 125",
    rot: "sway",
    rider: (
      <g>
        <rect x="-22" y="-18" width="44" height="36" rx="3" style={F} />
        <path d="M-22-7h44M-10-24v10M10-24v10" />
        <path d="M-8 6l6 6 11-11" style={E} />
      </g>
    ),
  },
} satisfies Record<string, { d: string; rot: Rot; rider: React.ReactNode }>;

export type FlightKind = keyof typeof FLIGHTS;

export function Flight({ kind, className }: { kind: FlightKind; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const rider = useRef<SVGGElement>(null);
  const f = FLIGHTS[kind];

  useEffect(() => {
    const el = box.current!;
    const path = trail.current!;
    const r = rider.current!;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;

    const place = (p: number) => {
      const at = Math.max(0.5, p * len);
      const a = path.getPointAtLength(at - 0.5);
      const b = path.getPointAtLength(Math.min(len, at + 0.5));
      const pt = path.getPointAtLength(at);
      const heading = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      // Sway: tilt with the slope but stay upright whichever way it travels
      const tilt = heading > 90 ? heading - 180 : heading < -90 ? heading + 180 : heading;
      const angle = f.rot === "follow" ? heading : f.rot === "sway" ? tilt * 0.35 : 0;
      r.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
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
  }, [f]);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-[calc(50%-50vw)] -z-10 hidden w-screen text-steel-lo lg:block", className)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} overflow="visible" className="w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path ref={trail} d={f.d} className="opacity-60" />
        <g ref={rider} className="text-ink-3" stroke="currentColor">
          {f.rider}
        </g>
      </svg>
    </div>
  );
}
