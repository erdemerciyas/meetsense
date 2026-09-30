import type { SiteContent, Ticket as TicketData } from "@/content/types";
import { Rail } from "@/components/ui/Rail";
import { Ticket } from "@/components/ui/Ticket";
import { cn } from "@/lib/cn";

/**
 * Tickets hanging on the week's rail. Wide screens show the whole rail with
 * day columns; narrow screens stack the days that hold tickets.
 */
export function RailBoard({
  c,
  tickets,
  active,
  span,
  delay,
  aside,
  hot,
}: {
  c: SiteContent;
  tickets: TicketData[];
  active: number;
  span?: { from: number; to: number; delay: number };
  /** Seconds after load at which a ticket prints; omit for no animation. */
  delay?: (t: TicketData) => number;
  /** Extra content under a given day column (e.g. a ticket that never reached the rail). */
  aside?: { day: number; node: React.ReactNode };
  /** Light up the active day's column. */
  hot?: boolean;
}) {
  const days = c.meeting.days;
  const hang = (list: TicketData[], onRail = true) =>
    list.map((t, j) => (
      <Ticket
        key={t.no}
        t={t}
        c={c}
        clip={onRail && j === 0}
        className={cn(delay && "print-in")}
        style={delay ? { animationDelay: `${delay(t)}s` } : undefined}
      />
    ));

  return (
    <>
      <div className="hidden md:block">
        <Rail days={days} active={active} span={span} />
        <div className="grid gap-x-4" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
          {days.map((d, i) => (
            <div key={d} className={cn("flex flex-col gap-4 pt-4", hot && i === active && "day-hot")}>
              {hang(tickets.filter((t) => t.day === i))}
              {aside?.day === i && aside.node}
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <Rail days={days} active={active} span={span} className="mb-6" />
      </div>
      <ol className="space-y-6 md:hidden">
        {days.map((d, i) => {
          const list = tickets.filter((t) => t.day === i);
          if (!list.length && aside?.day !== i) return null;
          return (
            <li key={d}>
              <p className={cn("mono mb-3 text-[0.8125rem] font-semibold", i === active ? "text-ember-ink" : "text-ink-2")}>{d}</p>
              <div className="flex flex-col gap-4 pt-1">
                {hang(list, false)}
                {aside?.day === i && aside.node}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
