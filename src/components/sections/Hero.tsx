import type { SiteContent } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { RailBoard } from "@/components/ui/RailBoard";
import { LiveRecorder } from "@/components/ui/LiveRecorder";
import { RailStage } from "@/components/ui/RailStage";
import type { RailData } from "@/components/ui/rail3d";
import { railTickets } from "@/lib/rail-data";

const MEETING_DAY = 1;

export function Hero({ c }: { c: SiteContent }) {
  const h = c.hero;
  // Print order follows the timecode each ticket came from.
  const order = [...h.tickets].sort((a, b) => a.from.localeCompare(b.from));
  const delay = (no: string) => 0.5 + order.findIndex((t) => t.no === no) * 0.65;
  const spanned = h.tickets.find((t) => t.day !== undefined && t.day > MEETING_DAY);
  // The same tickets, flattened for the 3D rail's canvas textures
  const rail: RailData = {
    days: c.meeting.days,
    active: MEETING_DAY,
    span: spanned && { from: MEETING_DAY, to: spanned.day!, ticket: spanned.no },
    tickets: railTickets(c, h.tickets, MEETING_DAY, (t) => delay(t.no) - 0.2),
  };

  return (
    <section id="top" className="pt-28 pb-24 md:pt-32 lg:pb-28">
      <div className="shell grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <h1 className="h-display lg:col-span-7">{h.title}</h1>
        <div className="lg:col-span-5 lg:pb-2">
          <p className="lead">{h.lead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#akis" className="text-link inline-flex items-center gap-2">
              <Icon name="play" className="text-ember-ink" />
              {h.secondary}
            </a>
          </div>
        </div>
      </div>

      <div className="shell mt-12 md:mt-14">
        <figure className="board board-in relative isolate px-4 pt-5 pb-7 md:px-7 md:pt-6 md:pb-9">
          <div aria-hidden="true" className="board-grid absolute inset-0 -z-10" />
          <figcaption className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-rule pb-4">
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className="live-dot" />
              <span className="text-[1.125rem] font-bold">{c.meeting.title}</span>
              <span className="mono hidden text-[0.75rem] text-ink-3 sm:inline">
                {c.meeting.date} · {c.meeting.platform}
              </span>
            </span>
            <span className="label">
              {h.railLabel} · {c.ui.example}
            </span>
          </figcaption>

          <LiveRecorder c={c} lines={c.life.record.lines} tickets={h.tickets} status={c.life.record.status} />

        <RailStage data={rail}>
          <RailBoard
            c={c}
            tickets={h.tickets}
            active={MEETING_DAY}
            span={spanned ? { from: MEETING_DAY, to: spanned.day!, delay: delay(spanned.no) - 0.55 } : undefined}
            delay={(t) => delay(t.no)}
            hot
          />
        </RailStage>
        </figure>
      </div>
    </section>
  );
}
