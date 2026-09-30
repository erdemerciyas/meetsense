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
  // Invite: a month grid, one day circled
  invite: (
    <>
      <rect x="40" y="52" width="160" height="140" rx="3" />
      <path d="M40 84h160M76 40v24M164 40v24" />
      <path d="M72 84v108M104 84v108M136 84v108M168 84v108M40 112h160M40 140h160M40 168h160" />
      <circle className="o-pulse" cx="120" cy="126" r="17" style={E} />
    </>
  ),
  // Recording: a live waveform with the red dot
  record: (
    <>
      {[
        [52, 16], [64, 32], [76, 10], [88, 48], [100, 24], [112, 8], [124, 40], [136, 20], [148, 30], [160, 6], [172, 22], [184, 12],
      ].map(([x, h], i) => (
        <path key={x} className="o-eq" style={d(i)} d={`M${x} ${120 - h}v${h * 2}`} />
      ))}
      <path d="M28 120h14M196 120h16" />
      <circle className="o-blink" cx="120" cy="52" r="8" style={E} />
      <path d="M100 52h-20M140 52h20" />
    </>
  ),
  // The moment: a speech bubble, the spoken line being typed out
  moment: (
    <g className="o-float">
      <path d="M48 64h144a8 8 0 0 1 8 8v76a8 8 0 0 1-8 8h-84l-32 28v-28H48a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8Z" />
      <path d="M68 96h104M68 118h72" />
      <path className="o-type" d="M150 118h24" style={E} />
    </g>
  ),
  // Closing: a checklist receipt
  close: (
    <>
      <path d="M64 36h112v164l-14-10-14 10-14-10-14 10-14-10-14 10-14-10-14 10Z" />
      <path d="M84 72l8 8 14-16M84 108l8 8 14-16M120 72h36M120 108h36M120 144h36" />
      <rect className="o-pulse" x="84" y="136" width="16" height="16" rx="1" style={E} />
    </>
  ),
  // Follow-up: a paper plane with its dashed trail
  followup: (
    <>
      <g className="o-float">
        <path d="M200 48 40 112l56 20 16 60 28-44 60-100Z" />
        <path d="M96 132 200 48M112 192l8-40" />
      </g>
      <path className="o-flow" d="M20 212c24-8 44-28 60-56" strokeDasharray="4 7" style={E} />
    </>
  ),
  // Weekly: a bar chart over a week
  weekly: (
    <>
      <path d="M36 196h168M36 196V44" />
      {[
        [56, 48], [84, 80], [112, 60], [168, 104], [196, 36],
      ].map(([x, h], i) => (
        <path key={x} className="o-bar" style={d(i)} d={`M${x} 196v-${h}`} strokeWidth="6" />
      ))}
      <path className="o-bar" style={{ ...d(5), ...E }} d="M140 196v-128" strokeWidth="6" />
      <path className="o-flow" d="M56 140 84 108l28 20 28-68 28 28" strokeDasharray="3 6" />
    </>
  ),
  // Later: a magnifier scanning an archive of lines
  later: (
    <>
      <path d="M40 60h96M40 84h72M40 108h88M40 132h56M40 156h80" />
      <g className="o-scan">
        <circle cx="148" cy="120" r="36" />
        <path d="M174 146l30 30" strokeWidth="4" />
        <path d="M132 120h32" style={E} />
      </g>
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
