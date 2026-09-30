import { cn } from "@/lib/cn";

/**
 * The steel rail with weekday notches. `active` marks the meeting day;
 * `span` draws an action's due-date span along the bar.
 */
export function Rail({
  days,
  active,
  span,
  className,
}: {
  days: string[];
  active?: number;
  span?: { from: number; to: number; delay: number };
  className?: string;
}) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
        {days.map((d, i) => (
          <li key={d} className="relative pb-2">
            <span className={cn("mono text-[0.75rem] font-medium", i === active ? "font-semibold text-ember-ink" : "text-ink-3")}>{d}</span>
            <span className={cn("absolute bottom-0 left-0 h-2 w-px", i === active ? "notch-live bg-ember" : "bg-steel-lo")} />
          </li>
        ))}
      </ol>
      <div className="relative">
        <div className="rail-bar" />
        {span && (
          <span
            className="span-in absolute top-1/2 h-[3px] -translate-y-1/2 bg-ember"
            style={{
              left: `${(span.from / days.length) * 100}%`,
              width: `${((span.to - span.from) / days.length) * 100}%`,
              animationDelay: `${span.delay}s`,
            }}
          />
        )}
      </div>
    </div>
  );
}
