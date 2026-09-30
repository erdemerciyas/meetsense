"use client";

import { useState } from "react";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/cn";

export function LaterQA({ c }: { c: SiteContent }) {
  const L = c.life.later;
  const [active, setActive] = useState(0);
  const qa = L.qa[active];

  return (
    <figure className="mt-12">
      <p className="label mb-3">{L.pick}</p>
      <div className="rail-bar" aria-hidden="true" />
      <ul className="grid gap-4 pt-5 md:grid-cols-3">
        {L.qa.map((item, i) => (
          <li key={item.q}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "ticket block min-h-12 w-full px-4 pt-4 pb-4 text-left text-[0.9375rem] transition-colors duration-150",
                i === active ? "font-semibold shadow-[inset_0_3px_0_var(--color-ember)]" : "text-ink-2 hover:text-ink",
              )}
            >
              <span className="ticket-clip" aria-hidden="true" />
              <span className={cn("mono mb-2 block text-[0.6875rem]", i === active ? "text-ember-ink" : "text-ink-3")}>
                {c.ui.assistant} · {item.scope}
              </span>
              {item.q}
            </button>
          </li>
        ))}
      </ul>

      <div key={active} className="ticket torn swap-in mt-8 max-w-3xl px-6 pt-6 pb-10" aria-live="polite">
        <p className="text-[1.125rem] leading-snug font-bold">{qa.q}</p>
        <hr className="tear my-4" />
        <p className="text-ink-2">{qa.a}</p>
        <p className="label mt-5">{c.ui.sources}</p>
        <ul className="mt-1.5 divide-y divide-dashed divide-rule border-y border-dashed border-rule">
          {qa.sources.map((s) => (
            <li key={s.ref} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2 text-[0.875rem]">
              <span className="mono font-semibold">{s.ref}</span>
              <span className="text-ink-2">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="label mt-3">{c.ui.example}</p>
    </figure>
  );
}
