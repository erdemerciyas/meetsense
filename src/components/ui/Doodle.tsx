"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Little machines placed in a free slot of the layout (never over content), each with its own mechanic: an envelope opens, a cassette
 * winds, a receipt prints, a stamp comes down. The wrapper publishes scroll progress
 * as --p (0..1); each part plays its own slice of it via --a/--b (see .doodle in globals.css).
 * Reduced motion: --p is 1, so every drawing just shows its finished state.
 */
const F = { fill: "var(--flight-bg, var(--color-paper))" };
const E = { stroke: "var(--color-ember)" };
const EF = { stroke: "var(--color-ember)", fill: "var(--color-ember)" };
const s = (a: number, b: number, v: Record<string, string> = {}) => ({ "--a": a, "--b": b, ...v }) as CSSProperties;

function Invite({ id }: { id: string }) {
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width="240" height="200" />
        </clipPath>
      </defs>
      <rect x="40" y="100" width="160" height="100" rx="3" style={F} />
      {/* The flap folds up and back */}
      <path className="seg d-flip" style={s(0, 0.3)} d="M40 100 120 156 200 100Z" />
      {/* Then the invite card slides out */}
      <g clipPath={`url(#${id})`}>
        <g className="seg d-move" style={s(0.3, 0.75, { "--y": "110px" })}>
          <rect x="56" y="54" width="128" height="116" rx="2" style={F} />
          <path d="M72 74h60M72 88h96M72 108h96M72 126h96M72 144h96M104 108v52M136 108v52" />
          <circle className="seg d-draw" style={{ ...s(0.75, 0.95), ...E }} pathLength={1} cx="152" cy="135" r="11" />
        </g>
      </g>
      <path d="M40 100 120 156 200 100V200H40Z" style={F} />
    </>
  );
}

function Cassette() {
  const reel = (x: number) => (
    <g className="seg d-turn" style={s(0, 1, { "--r": "900deg" })}>
      <g className="d-spin">
        <circle cx={x} cy="142" r="7" />
        <path d={`M${x} 135v14M${x - 7} 142h14`} />
      </g>
    </g>
  );
  return (
    <>
      <rect x="28" y="56" width="184" height="136" rx="10" style={F} />
      <rect x="44" y="70" width="152" height="40" rx="3" />
      <circle className="d-blink" cx="60" cy="90" r="4" style={EF} />
      <path d="M74 84h64M74 96h40" />
      <rect x="62" y="118" width="116" height="48" rx="24" />
      {/* Tape moves from the left pack to the right one */}
      <circle className="seg d-unwind" style={s(0, 1)} cx="92" cy="142" r="20" />
      <circle className="seg d-wind" style={s(0, 1)} cx="148" cy="142" r="20" />
      {reel(92)}
      {reel(148)}
      <path d="M64 192l10-18h92l10 18" />
    </>
  );
}

function Moment() {
  return (
    <>
      <g className="seg d-pop" style={s(0.05, 0.3, { "--o": "0% 100%" })}>
        <path d="M38 36h94a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H58l-14 12V76h-6a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8Z" style={F} />
        <path d="M46 52h70M46 62h44" />
      </g>
      <g className="seg d-pop" style={s(0.3, 0.55, { "--o": "100% 100%" })}>
        <path d="M108 94h94a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-4v12l-14-12h-76a8 8 0 0 1-8-8v-24a8 8 0 0 1 8-8Z" style={F} />
        {[134, 150, 166].map((x, i) => (
          <circle key={x} className="d-bob" style={{ "--i": i } as CSSProperties} cx={x} cy="114" r="3" />
        ))}
      </g>
      <g className="seg d-pop" style={s(0.55, 0.75, { "--o": "0% 100%" })}>
        <path d="M38 152h124a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H58l-14 12v-12h-6a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-8Z" style={F} />
        <path d="M46 168h104" />
        {/* The decision gets marked as it's said */}
        <path className="seg d-draw" style={{ ...s(0.75, 0.92), ...E }} pathLength={1} d="M46 184h80" strokeWidth="3" />
      </g>
      <g className="seg d-pop" style={s(0.9, 1)}>
        <circle cx="178" cy="152" r="12" style={F} />
        <path d="M172 152l4 4 8-8" style={E} />
      </g>
    </>
  );
}

function Close({ id }: { id: string }) {
  const teeth = "l-8-6-8 6".repeat(7);
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x="0" y="86" width="240" height="200" />
        </clipPath>
      </defs>
      {/* The minutes print out of the slot */}
      <g clipPath={`url(#${id})`}>
        <g className="seg d-move" style={s(0.1, 0.8, { "--y": "-140px" })}>
          <path d={`M64 70h112v140${teeth}Z`} style={F} />
          <path d="M80 100h80M80 114h56M80 136h80M80 150h64M100 178h52" />
          <path d="M80 178l5 5 10-10" style={E} />
        </g>
      </g>
      <rect x="40" y="40" width="160" height="48" rx="6" style={F} />
      <path d="M60 80h120" />
      <circle className="d-blink" cx="180" cy="58" r="3" style={EF} />
    </>
  );
}

function Weekly() {
  const bars = [56, 84, 70, 124, 96, 44, 30];
  return (
    <>
      <path d="M32 196h176" />
      {bars.map((h, i) => (
        <rect
          key={i}
          className="seg d-grow"
          style={{ ...s(0.05 + i * 0.08, 0.35 + i * 0.08), ...F, ...(i === 3 ? E : {}) }}
          x={44 + i * 24}
          y={196 - h}
          width="14"
          height={h}
          rx="2"
        />
      ))}
      {["P", "S", "Ç", "P", "C", "C", "P"].map((d, i) => (
        <text key={i} x={51 + i * 24} y="214" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="mono">
          {d}
        </text>
      ))}
      <g className="seg d-pop" style={s(0.85, 1, { "--o": "50% 100%" })}>
        <rect x="104" y="30" width="60" height="28" rx="4" style={F} />
        <text x="134" y="49" textAnchor="middle" fontSize="13" fill="currentColor" stroke="none" className="mono">
          Σ 12
        </text>
      </g>
    </>
  );
}

function Search() {
  return (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <g key={`${r}${c}`}>
            <rect x={36 + c * 58} y={50 + r * 54} width="46" height="40" rx="3" style={F} />
            <path d={`M${44 + c * 58} ${64 + r * 54}h28M${44 + c * 58} ${74 + r * 54}h18`} />
          </g>
        )),
      )}
      {/* The one that answers the question */}
      <rect className="seg d-pop" style={{ ...s(0.85, 1), ...E }} x="152" y="104" width="46" height="40" rx="3" strokeWidth="2.5" />
      <g className="seg d-search" style={s(0.05, 0.85)}>
        <circle cx="59" cy="124" r="22" />
        <path d="M75 140l18 18" strokeWidth="4" />
      </g>
    </>
  );
}

function Templates() {
  return (
    <>
      {[-26, -9, 9, 26].map((r, i) => (
        <g key={r} className="seg d-turn" style={s(0.1, 0.8, { "--r": `${r}deg`, "--o": "50% 100%" })}>
          <rect x="72" y="44" width="96" height="136" rx="4" style={F} />
          <path d="M86 66h50M86 82h68M86 98h40M86 118h68M86 134h52" />
          {i === 3 && <path d="M86 66h26" strokeWidth="3" style={E} />}
        </g>
      ))}
    </>
  );
}

function Stamp() {
  return (
    <>
      <rect x="44" y="112" width="152" height="100" rx="3" style={F} />
      <path d="M44 138h152M80 104v16M160 104v16" />
      <path className="seg d-pop" style={{ ...s(0.52, 0.6), ...E }} d="M94 170l16 16 34-34" strokeWidth="4" />
      {/* Down it comes, then lifts off */}
      <g className="seg d-lift" style={s(0.62, 0.95, { "--y": "-96px" })}>
        <g className="seg d-move" style={s(0.2, 0.5, { "--y": "-96px" })}>
          <circle cx="120" cy="120" r="13" style={F} />
          <rect x="112" y="132" width="16" height="26" style={F} />
          <rect x="82" y="158" width="76" height="20" rx="3" style={F} />
          <rect x="86" y="178" width="68" height="8" rx="1" style={EF} />
        </g>
      </g>
    </>
  );
}

const ART = {
  invite: Invite,
  record: Cassette,
  moment: Moment,
  close: Close,
  weekly: Weekly,
  search: Search,
  templates: Templates,
  stamp: Stamp,
} as const;

export type DoodleKind = keyof typeof ART;

export function Doodle({ kind, className }: { kind: DoodleKind; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const Art: React.FC<{ id: string }> = ART[kind];

  useEffect(() => {
    const el = box.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return el.style.setProperty("--p", "1");

    let frame = 0;
    const update = () => {
      const { top } = el.getBoundingClientRect();
      // 0 as it enters the bottom of the screen, 1 once it has climbed to just above the middle
      const p = (innerHeight - top) / (innerHeight * 0.6);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
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
      className={cn("doodle pointer-events-none hidden text-steel-lo lg:block", className)}
    >
      <svg viewBox="0 0 240 240" overflow="visible" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <Art id={id} />
      </svg>
    </div>
  );
}
