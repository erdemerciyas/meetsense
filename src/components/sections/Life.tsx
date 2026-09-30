import type { Chapter as ChapterData, SiteContent } from "@/content/types";
import { KindGlyph } from "@/components/ui/KindGlyph";
import { RailBoard } from "@/components/ui/RailBoard";
import { Ticket } from "@/components/ui/Ticket";
import { Ornament } from "@/components/ui/Ornament";
import { Flight } from "@/components/ui/Flight";
import { Doodle, type DoodleKind } from "@/components/ui/Doodle";
import { Icon, IconChip, type IconName } from "@/components/ui/Icon";
import { personName } from "@/lib/people";
import { cn } from "@/lib/cn";
import { LaterQA } from "./LaterQA";
import { ProcessStage } from "@/components/ui/ProcessStage";
import type { ProcessData } from "@/components/ui/process3d";
import { railTickets } from "@/lib/rail-data";

// The meeting day in the example week (same as the hero's rail)
const MEETING_DAY = 1;

// Each chapter's margin machine, each with its own mechanic. Follow-up gets the paper plane's flight instead.
const CHAPTER_DOODLE: Record<string, DoodleKind> = {
  davet: "invite",
  kayit: "record",
  an: "moment",
  kapanis: "close",
  haftalik: "weekly",
  sonra: "search",
};

// Each chapter's heading icon.
const CHAPTER_ART: Record<string, IconName> = {
  davet: "invite",
  kayit: "record",
  an: "moment",
  kapanis: "close",
  takip: "followup",
  haftalik: "weekly",
  sonra: "later",
};

/** One stop in the meeting's life: the time on the spine, then its own composition. */
function Chapter({ ch, children }: { ch: ChapterData; children: React.ReactNode }) {
  const doodle = CHAPTER_DOODLE[ch.id];
  return (
    <article id={ch.id} aria-labelledby={`${ch.id}-h`} className="relative isolate grid gap-6 py-16 md:py-20 lg:grid-cols-12 lg:gap-10 xl:py-32">
      {ch.id === "takip" && <Flight className="top-[-12rem]" />}
      <div className="lg:col-span-2 lg:border-l lg:border-rule lg:pl-5">
        {/* The spine column is empty below the time: the chapter's drawing rides there with it */}
        <div className="sticky top-28">
          <p className="mono flex items-center gap-2 text-[1rem] font-semibold">
            <span aria-hidden="true" className="size-2 bg-ink lg:-ml-[1.5625rem]" />
            {ch.time}
          </p>
          {doodle && <Doodle kind={doodle} className="mt-8 w-full max-w-[9.5rem]" />}
        </div>
      </div>
      <div className="reveal min-w-0 lg:col-span-10">{children}</div>
    </article>
  );
}

function Intro({ ch, points, className }: { ch: ChapterData; points?: string[]; className?: string }) {
  return (
    <div className={className}>
      {CHAPTER_ART[ch.id] && <IconChip name={CHAPTER_ART[ch.id]} className="mb-5" />}
      <h3 id={`${ch.id}-h`} className="h-chapter max-w-[22ch]">
        {ch.title}
      </h3>
      <p className="mt-4 max-w-[60ch] text-ink-2">{ch.text}</p>
      {points && (
        <ul className="mt-5 max-w-[60ch] space-y-2">
          {points.map((p) => (
            <li key={p} className="grid grid-cols-[1.5rem_1fr] text-ink-2">
              <Icon name="chevron" className="mt-[0.3em] size-4 text-ember" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A length of rail that the chapter's outputs hang from. */
function RailLength() {
  return <div className="rail-bar" aria-hidden="true" />;
}

export function Life({ c }: { c: SiteContent }) {
  const L = c.life;
  const m = c.meeting;
  const doc = L.close.doc;
  const spanned = c.hero.tickets.find((t) => t.day !== undefined && t.day > MEETING_DAY);
  const process: ProcessData = {
    title: m.title,
    date: `${m.date} · ${m.platform}`,
    invite: L.invite.card.label,
    assistant: c.ui.assistant,
    question: L.later.qa[0].q,
    days: m.days,
    active: MEETING_DAY,
    span: spanned && { from: MEETING_DAY, to: spanned.day!, ticket: spanned.no },
    lines: L.record.lines.map((l) => ({ time: l.time, who: personName(l.who, c.people) ?? "", text: l.text })),
    tickets: railTickets(c, c.hero.tickets, MEETING_DAY),
  };

  return (
    <section id={L.id} aria-labelledby={`${L.id}-h`} className="relative isolate border-t border-rule bg-pass-2/50">
      <div aria-hidden="true" className="pad-grid absolute inset-0 -z-20" />
      <div className="shell pt-24 lg:pt-32 xl:pt-40">
        <div className="reveal grid gap-6 lg:grid-cols-12 lg:gap-10 xl:mb-24">
          <Ornament kind="waves" className="w-full max-w-[9.5rem] self-center lg:col-span-2" />
          <h2 id={`${L.id}-h`} className="h-section lg:col-span-6 lg:col-start-3">
            {L.title}
          </h2>
          <p className="lead lg:col-span-4 lg:pt-3">{L.lead}</p>
        </div>

        <ProcessStage data={process} steps={[L.invite, L.record, L.moment, L.followup, L.later].map(({ id, time, title }) => ({ id, time, title }))} />

        {/* 1. Invite: the slip hangs, the copy sits under the rail beside it */}
        <Chapter ch={L.invite}>
          <RailLength />
          <div className="grid gap-10 pt-5 md:grid-cols-10">
            <figure aria-hidden="true" className="md:col-span-4">
              <div className="ticket px-5 py-5">
                <span className="ticket-clip" />
                <p className="font-semibold">{m.title}</p>
                <p className="mono mt-1 text-[0.75rem] text-ink-3">
                  {m.date} · {m.platform}
                </p>
                <hr className="tear my-4" />
                <p className="text-[0.9375rem] font-semibold">{L.invite.card.label}</p>
                <ul className="mt-2 space-y-1.5 text-[0.9375rem]">
                  {L.invite.card.options.map((o, i) => (
                    <li key={o} className="flex items-center gap-2.5">
                      <span className={cn("grid size-4 place-items-center rounded-full border", i === L.invite.card.selected ? "border-ink" : "border-steel")}>
                        {i === L.invite.card.selected && <span className="size-2 rounded-full bg-ink" />}
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
                <span className="btn btn-primary mt-4 min-h-10 px-4 text-[0.9375rem]">{L.invite.card.send}</span>
                <p className="mono mt-4 border-t border-dashed border-rule pt-3 text-[0.75rem] text-ink-2">{L.invite.card.lobby}</p>
              </div>
            </figure>
            <Intro ch={L.invite} points={L.invite.points} className="md:col-span-5 md:col-start-6 md:pt-6" />
          </div>
        </Chapter>

        {/* 2. Record: a running log printed across the full width */}
        <Chapter ch={L.record}>
          <Intro ch={L.record} points={L.record.points} />
          <figure className="mt-10">
            <p className="mono mb-3 flex items-center gap-2 text-[0.75rem] font-semibold text-ember-ink">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              {L.record.status}
              <span className="font-medium text-ink-3">· {c.ui.example}</span>
            </p>
            <RailLength />
            <div className="ticket torn mt-4 pb-3">
              <span className="ticket-clip" aria-hidden="true" />
              <ol className="divide-y divide-dashed divide-rule">
                {L.record.lines.map((line) => (
                  <li key={line.time} className="grid gap-1 px-5 py-3.5 md:grid-cols-[4.5rem_10rem_1fr] md:gap-4">
                    <span className="mono text-[0.8125rem] text-ink-3">{line.time}</span>
                    <span className="text-[0.9375rem] font-semibold">{personName(line.who, c.people)}</span>
                    <span className="text-ink-2">{line.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </figure>
        </Chapter>

        {/* 3. The moment: the sentence, where it came from, and the ticket it prints */}
        <Chapter ch={L.moment}>
          <Intro ch={L.moment} />
          <figure className="mt-12 grid gap-10 md:grid-cols-10 md:items-start">
            <blockquote className="md:col-span-6">
              <p className="text-[clamp(1.5rem,1.15rem+1.4vw,2.25rem)] leading-[1.18] font-semibold tracking-[-0.015em]">
                “{L.moment.line.text.split(L.moment.phrase)[0]}
                <span className="spoken">{L.moment.phrase}</span>
                {L.moment.line.text.split(L.moment.phrase)[1]}”
              </p>
              <footer className="mono mt-4 text-[0.8125rem] text-ink-3">
                {personName(L.moment.line.who, c.people)} · {L.moment.line.time}
              </footer>
            </blockquote>
            <div className="md:col-span-3 md:col-start-8">
              <RailLength />
              <div className="pt-4">
                <Ticket t={L.moment.ticket} c={c} />
              </div>
            </div>
          </figure>
        </Chapter>

        {/* 4. Close: the long record hangs from the rail and tears off at the bottom */}
        <Chapter ch={L.close}>
          <RailLength />
          <div className="grid gap-10 pt-5 md:grid-cols-10">
            <figure className="md:col-span-6">
              <div className="ticket torn px-6 pt-6 pb-10 md:px-8 md:pt-7">
                <span className="ticket-clip" aria-hidden="true" />
                <header>
                  <p className="text-[1.25rem] leading-tight font-bold">{doc.title}</p>
                  <p className="mono mt-1.5 text-[0.75rem] text-ink-3">{doc.meta}</p>
                  <p className="mono mt-1 text-[0.75rem] font-semibold text-ink-2">{doc.template}</p>
                </header>
                <hr className="tear my-5" />
                <p className="label">{doc.summaryTitle}</p>
                <p className="mt-1.5 text-[0.9375rem]">{doc.summary}</p>

                {(
                  [
                    ["decisions", doc.decisions],
                    ["actions", doc.actions],
                    ["risks", doc.risks],
                  ] as const
                ).map(([key, list]) => (
                  <div key={key} className="mt-6">
                    <p className="label">{doc.sections[key]}</p>
                    <ul className="mt-1.5 divide-y divide-dashed divide-rule border-y border-dashed border-rule">
                      {list.map((t) => {
                        const unowned = t.kind === "action" && !t.owner;
                        return (
                          <li key={t.no} className="grid grid-cols-[2.5rem_1fr] gap-x-2 py-2.5 text-[0.9375rem] sm:grid-cols-[2.5rem_1fr_auto]">
                            <span className="mono text-[0.8125rem] text-ink-3">#{t.no}</span>
                            <span className="flex gap-2">
                              <KindGlyph kind={t.kind} className={cn("mt-1 size-3.5 flex-none", unowned ? "text-ember" : "text-ink-3")} />
                              {t.text}
                            </span>
                            <span className="mono col-start-2 text-[0.75rem] text-ink-3 sm:col-start-3 sm:text-right">
                              {unowned ? <span className="font-semibold text-ember-ink">{c.ui.noOwner}</span> : personName(t.owner, c.people)}
                              {t.due && ` · ${t.due}`}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                <hr className="tear my-5" />
                <p className="mono flex flex-wrap gap-x-5 gap-y-1 text-[0.75rem] font-semibold text-ink-2" aria-hidden="true">
                  {doc.share.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </p>
              </div>
              <p className="label mt-3">{c.ui.example}</p>
            </figure>
            <div className="md:col-span-4">
              <Intro ch={L.close} points={L.close.points} className="md:sticky md:top-28 md:pt-6" />
            </div>
          </div>
        </Chapter>

        {/* 5. Follow-up: the week's rail, and the ticket that never reached it */}
        <Chapter ch={L.followup}>
          <Intro ch={L.followup} />
          <figure className="mt-12">
            <RailBoard
              c={c}
              tickets={L.followup.rail}
              active={3}
              aside={{
                day: 1,
                node: (
                  <div className="relative mx-2 mt-6 rotate-[-4deg] md:mx-0 md:mt-24">
                    <Ticket t={L.followup.stalled} c={c} clip={false} stamped>
                      <span className="stamp absolute right-3 -bottom-3 rotate-[-5deg] bg-paper">{L.followup.stamp}</span>
                    </Ticket>
                  </div>
                ),
              }}
            />
            <figcaption className="mono mt-8 text-[0.8125rem] text-ink-2">
              #{L.followup.stalled.no} · {L.followup.note} <span className="text-ink-3">· {c.ui.example}</span>
            </figcaption>
          </figure>
        </Chapter>

        {/* 6. Weekly: the tally slip and what kept coming back, hung side by side */}
        <Chapter ch={L.weekly}>
          <Intro ch={L.weekly} />
          <figure className="mt-12">
            <div className="hidden gap-5 pb-3 md:grid md:grid-cols-10">
              <p className="label md:col-span-4">{L.weekly.report.period}</p>
              <p className="label md:col-span-6">{L.weekly.report.notesTitle}</p>
            </div>
            <RailLength />
            <div className="grid gap-5 pt-5 md:grid-cols-10 md:items-start">
              <div className="ticket torn px-5 pt-5 pb-9 md:col-span-4">
                <span className="ticket-clip" aria-hidden="true" />
                <p className="text-[1.125rem] font-bold">{L.weekly.report.title}</p>
                <p className="mono mt-1 text-[0.75rem] text-ink-3">{L.weekly.report.period}</p>
                {L.weekly.report.groups.map((g) => (
                  <div key={g.label} className="mt-5">
                    <p className="label">{g.label}</p>
                    <dl className="mono mt-1 text-[0.8125rem]">
                      {g.rows.map((r) => (
                        <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-dotted border-rule py-1.5">
                          <dt className="flex items-center gap-1.5">
                            {r.flag && <KindGlyph kind="risk" className="size-3.5 text-ember" />}
                            {r.label}
                          </dt>
                          <dd className="text-right">
                            <span className="text-[1rem] font-semibold">{r.value}</span>
                            <span className="block text-[0.6875rem] text-ink-3">
                              {L.weekly.report.prevLabel} {r.prev}
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-6 md:col-span-6 md:mt-0">
                <p className="label mb-3 md:hidden">{L.weekly.report.notesTitle}</p>
                <div className="rail-bar mb-5 md:hidden" aria-hidden="true" />
                <ul className="grid gap-4 sm:grid-cols-3">
                  {L.weekly.report.notes.map((n, i) => (
                    <li key={n.text} className="ticket px-4 pt-3.5 pb-4">
                      <span className={cn("ticket-clip", i > 0 && "hidden sm:block")} aria-hidden="true" />
                      <p className={cn("mono flex items-center gap-1.5 text-[0.75rem] font-semibold", n.flag ? "text-ember-ink" : "text-ink-2")}>
                        <KindGlyph kind={n.flag ? "risk" : "info"} className={cn("size-3.5", n.flag ? "text-ember" : "text-ink-3")} />
                        {n.tag}
                      </p>
                      <hr className="tear my-2.5" />
                      <p className="text-[0.9375rem] leading-snug font-semibold">{n.text}</p>
                      <p className="mono mt-2.5 text-[0.6875rem] text-ink-3">{n.meetings}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="label mt-3">{c.ui.example}</p>
          </figure>
        </Chapter>

        {/* 7. A month later: the questions hang on the rail, the answer slip below */}
        <Chapter ch={L.later}>
          <Intro ch={L.later} />
          <p className="mt-2 max-w-[60ch] text-ink-2">{L.later.scopes}</p>
          <LaterQA c={c} />
        </Chapter>
      </div>
    </section>
  );
}
