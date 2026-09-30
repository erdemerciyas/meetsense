"use client";

import { useEffect, useState } from "react";
import type { SiteContent, Ticket, TranscriptLine } from "@/content/types";
import { KindGlyph } from "@/components/ui/KindGlyph";
import { personName } from "@/lib/people";
import { cn } from "@/lib/cn";

const BARS = 110;
const TYPE_MS = 32;
const HOLD_MS = 2200;

/**
 * The bot in the room: a live waveform, the running timecode and the sentence
 * being written as it is spoken. When a sentence carries work, the ticket it
 * prints is named beside it. Decorative: the same transcript is on the page as text.
 */
export function LiveRecorder({ c, lines, tickets, status }: { c: SiteContent; lines: TranscriptLine[]; tickets: Ticket[]; status: string }) {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [sec, setSec] = useState(0);

  const line = lines[i];
  const done = typed >= line.text.length;
  const hit = done ? tickets.find((t) => t.from === line.time) : undefined;

  useEffect(() => {
    // Reduced motion: the first sentence appears whole and stays.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setTyped(line.text.length), 0);
      return () => clearTimeout(id);
    }
    const id = done
      ? setTimeout(() => {
          setI((n) => (n + 1) % lines.length);
          setTyped(0);
          setSec(0);
        }, HOLD_MS)
      : setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
    return () => clearTimeout(id);
  }, [typed, done, line.text.length, lines.length]);

  // Tell the 3D rail (if it's up) which ticket this sentence just printed
  const hitNo = hit?.no;
  useEffect(() => {
    if (hitNo) dispatchEvent(new CustomEvent("ms:hit", { detail: hitNo }));
  }, [hitNo, i]);

  useEffect(() => {
    const id = setInterval(() => setSec((s) => Math.min(s + 1, 59)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden="true" className="rec mb-7 grid gap-5 md:grid-cols-[13rem_1fr] md:items-center md:gap-8">
      <div className="flex items-center gap-4">
        <span className="rec-orb" data-speaking={!done}>
          <span />
          <span />
          <span />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-6">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
          </svg>
        </span>
        <span>
          <span className="mono flex items-center gap-1.5 text-[0.75rem] font-semibold text-ember-ink">
            <span className="rec-dot" />
            REC
            <span className="text-ink tabular-nums">
              {line.time}:{String(sec).padStart(2, "0")}
            </span>
          </span>
          <span className="mt-0.5 block text-[0.9375rem] font-semibold">MeetSense AI</span>
          <span className="mono block text-[0.75rem] text-ink-3">{status}</span>
        </span>
      </div>

      <div className="min-w-0">
        <div className={cn("rec-wave", done && "rec-wave-quiet")}>
          {Array.from({ length: BARS }, (_, b) => (
            <span
              key={b}
              style={{
                animationDuration: `${0.55 + ((b * 37) % 11) / 18}s`,
                animationDelay: `${-((b * 53) % 17) / 20}s`,
                height: `${30 + ((b * 29) % 70)}%`,
              }}
            />
          ))}
        </div>
        <p className="mt-3 flex min-h-[3.25rem] flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="mono text-[0.8125rem] text-ink-3">{line.time}</span>
          <span className="text-[0.9375rem] font-semibold">{personName(line.who, c.people)}</span>
          <span className="min-w-0 flex-1 basis-80 text-[1.0625rem] leading-snug">
            {line.text.slice(0, typed)}
            {!done && <span className="rec-caret" />}
          </span>
          {hit && (
            <span key={hit.no} className="rec-hit mono inline-flex items-center gap-1.5 text-[0.75rem] font-semibold">
              <KindGlyph kind={hit.kind} className="size-3.5" />#{hit.no} {c.ui.kinds[hit.kind]}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
