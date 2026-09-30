import type { MarkKind } from "@/content/types";

/** State glyphs: decision, action and risk read apart without colour. */
export function KindGlyph({ kind, className = "size-4" }: { kind: MarkKind | "info"; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
      {kind === "decision" && (
        <>
          <rect x="2" y="2" width="12" height="12" rx="1" />
          <path d="M5 8.2 7.1 10.3 11 5.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "action" && (
        <>
          <circle cx="8" cy="8" r="6" />
          <path d="M5.5 8h5M8.5 5.8 10.7 8l-2.2 2.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "risk" && (
        <>
          <path d="M8 2.2 14.2 13H1.8L8 2.2Z" strokeLinejoin="round" />
          <path d="M8 6.5v3" strokeLinecap="round" />
          <circle cx="8" cy="11.2" r="0.4" fill="currentColor" />
        </>
      )}
      {kind === "info" && (
        <>
          <circle cx="8" cy="8" r="6" />
          <path d="M8 7.3v3.6" strokeLinecap="round" />
          <circle cx="8" cy="5.1" r="0.4" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
