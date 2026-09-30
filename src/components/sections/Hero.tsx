import type { SiteContent } from "@/content/types";
import { RailBoard } from "@/components/ui/RailBoard";

const MEETING_DAY = 1;

export function Hero({ c }: { c: SiteContent }) {
  const h = c.hero;
  // Print order follows the timecode each ticket came from.
  const order = [...h.tickets].sort((a, b) => a.from.localeCompare(b.from));
  const delay = (no: string) => 0.5 + order.findIndex((t) => t.no === no) * 0.65;
  const spanned = h.tickets.find((t) => t.day !== undefined && t.day > MEETING_DAY);

  return (
    <section id="top" className="pt-28 pb-24 md:pt-32 lg:pb-28">
      <div className="shell grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <h1 className="h-display lg:col-span-7">{h.title}</h1>
        <div className="lg:col-span-5 lg:pb-2">
          <p className="lead">{h.lead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#demo" className="btn btn-primary">
              {h.primary}
            </a>
            <a href="#akis" className="text-link">
              {h.secondary}
            </a>
          </div>
        </div>
      </div>

      <figure className="shell mt-12 md:mt-14">
        <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="font-semibold">{c.meeting.title}</span>
          <span className="label">
            {h.railLabel} · {c.ui.example}
          </span>
        </figcaption>

        <RailBoard
          c={c}
          tickets={h.tickets}
          active={MEETING_DAY}
          span={spanned ? { from: MEETING_DAY, to: spanned.day!, delay: delay(spanned.no) - 0.55 } : undefined}
          delay={(t) => delay(t.no)}
        />
      </figure>
    </section>
  );
}
