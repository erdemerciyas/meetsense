import { Children, Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Line-art placed in a free slot of the layout, beside a section's heading.
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

export function Ornament({ kind, className }: { kind: OrnamentKind; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("ornament pointer-events-none hidden text-steel-lo lg:block", className)}>
      <div className="ornament-lean">
        <svg viewBox="0 0 240 240" overflow="visible" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {drawable(ART[kind])}
        </svg>
      </div>
    </div>
  );
}
