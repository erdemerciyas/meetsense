import { Children, Fragment, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Line-art that sits in the page margin where one section hands over to the next.
 * Strokes draw themselves as the ornament scrolls into view, each drawing then idles
 * with a small loop of its own and leans toward the pointer (see .ornament in globals.css).
 * Ember marks the one thing each drawing is about.
 */
const E = { stroke: "var(--color-ember)" };
const d = (i: number) => ({ "--i": i }) as React.CSSProperties;

const ART = {
  // Hero → life: sound rings spreading from a live mic
  waves: (
    <>
      <rect x="104" y="78" width="32" height="56" rx="16" />
      <path d="M92 118a28 28 0 0 0 56 0M120 146v18M104 164h32" />
      <path className="o-ring" style={d(0)} d="M70 92a58 58 0 0 0 0 64M170 92a58 58 0 0 1 0 64" />
      <path className="o-ring" style={d(1)} d="M48 74a88 88 0 0 0 0 100M192 74a88 88 0 0 1 0 100" />
      <path className="o-ring" style={d(2)} d="M26 56a118 118 0 0 0 0 136M214 56a118 118 0 0 1 0 136" />
      <circle className="o-blink" cx="120" cy="96" r="3" style={E} />
    </>
  ),
  // Templates: stacked layout sheets
  templates: (
    <>
      <path d="M68 48v148h116M56 60v148h116" />
      <g className="o-float">
        <rect x="80" y="36" width="116" height="148" rx="2" />
        <path d="M96 60h56M96 76h84M96 100h36v36H96zM144 100h36M144 116h36M144 132h24M96 156h84" />
        <path className="o-type" d="M96 60h24" strokeWidth="3" style={E} />
      </g>
    </>
  ),
  // Enterprise: shield and keyhole over a server stack
  enterprise: (
    <>
      <g className="o-float">
        <path d="M120 28 184 52v52c0 44-28 76-64 92-36-16-64-48-64-92V52Z" />
        <g className="o-blink">
          <circle cx="120" cy="98" r="12" style={E} />
          <path d="M120 110v24" style={E} />
        </g>
      </g>
      <path d="M40 204h160M52 216h136" />
    </>
  ),
  // Demo: a calendar slip being handed over
  demo: (
    <>
      <g className="o-float">
        <rect x="60" y="48" width="120" height="100" rx="3" />
        <path d="M60 76h120M92 36v24M148 36v24" />
        <path className="o-pulse" d="M100 108l14 14 28-28" style={E} />
      </g>
      <path d="M28 196c20-20 44-28 72-28h48c10 0 16 6 16 14s-6 14-16 14h-36M164 176l40-24" />
    </>
  ),
} as const;

export type OrnamentKind = keyof typeof ART;

/** Plain solid strokes get a unit path length so CSS can draw them in; dashed and idling parts keep their own motion. */
function drawable(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ children?: ReactNode; strokeDasharray?: string; className?: string }>;
    if (el.type === "g" || el.type === Fragment) {
      return cloneElement(el, {}, drawable(el.props.children));
    }
    if (el.props.strokeDasharray || el.props.className) return el;
    return cloneElement(el, { pathLength: 1, className: "o-draw" } as object);
  });
}

/**
 * `split` is for an ornament that straddles a light and a dark section: the stroke
 * takes each ground's tone on its own side of the boundary so neither half fades out.
 */
export function Ornament({
  kind,
  side,
  split,
  className,
}: {
  kind: OrnamentKind;
  side: "left" | "right";
  split?: "light-dark" | "dark-light";
  className?: string;
}) {
  const id = useId();
  const [top, bottom] = split === "dark-light" ? ["dark", "light"] : ["light", "dark"];
  return (
    <div
      aria-hidden="true"
      data-side={side}
      data-split={split}
      className={cn(
        "ornament pointer-events-none absolute -z-10 hidden w-80 text-steel-lo xl:block",
        side === "left" ? "left-[calc(50%-50vw+1rem)]" : "right-[calc(50%-50vw+1rem)]",
        className,
      )}
    >
      <div className="ornament-lean">
        <svg viewBox="0 0 240 240" overflow="visible" fill="none" stroke={split ? `url(#${id})` : "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {split && (
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0.5" className={`orn-${top}`} />
                <stop offset="0.5" className={`orn-${bottom}`} />
              </linearGradient>
            </defs>
          )}
          {drawable(ART[kind])}
        </svg>
      </div>
    </div>
  );
}
