import type { SiteContent, Ticket as TicketData } from "@/content/types";
import { KindGlyph } from "@/components/ui/KindGlyph";
import { personName } from "@/lib/people";
import { cn } from "@/lib/cn";

/** A printed ticket: number, kind, the work itself, and where it came from. */
export function Ticket({
  t,
  c,
  clip = true,
  stamped,
  className,
  style,
  children,
}: {
  t: TicketData;
  c: SiteContent;
  clip?: boolean;
  /** A stamp carries the missing-owner state, so the owner row is left out. */
  stamped?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const owner = personName(t.owner, c.people);
  const unowned = t.kind === "action" && !t.owner;
  return (
    <article className={cn("ticket lift px-4 pt-3.5 pb-4", className)} style={style}>
      {clip && <span className="ticket-clip" aria-hidden="true" />}
      <header className="flex items-center justify-between gap-3">
        <span className="mono text-[0.8125rem] font-semibold">#{t.no}</span>
        <span className={cn("mono flex items-center gap-1.5 text-[0.75rem] font-semibold", t.kind === "decision" ? "text-ink" : "text-ink-2")}>
          <KindGlyph kind={t.kind} className="size-3.5" />
          {c.ui.kinds[t.kind]}
        </span>
      </header>
      <hr className="tear my-2.5" />
      <p className="text-[1rem] leading-snug font-semibold">{t.text}</p>
      <dl className="mono mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[0.75rem] text-ink-3">
        {(owner || (unowned && !stamped)) && (
          <>
            <dt>{t.kind === "action" ? c.ui.owner : c.ui.saidBy}</dt>
            <dd className={unowned ? "font-semibold text-ember-ink" : "text-ink-2"}>{owner ?? c.ui.noOwner}</dd>
          </>
        )}
        {t.due && (
          <>
            <dt>{c.ui.due}</dt>
            <dd className="text-ink-2">{t.due}</dd>
          </>
        )}
        <dt>{c.ui.from}</dt>
        <dd className="text-ink-2">{t.from}</dd>
      </dl>
      {children}
    </article>
  );
}
