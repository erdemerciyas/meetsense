import type { SiteContent } from "@/content/types";
import { Ornament } from "@/components/ui/Ornament";
import { Icon } from "@/components/ui/Icon";
import { DemoForm } from "./DemoForm";

export function Demo({ c }: { c: SiteContent }) {
  const s = c.demo;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-h`} className="shell relative isolate grid gap-12 pt-24 pb-28 lg:grid-cols-12 lg:gap-10 lg:pt-32 lg:pb-40 xl:pt-40">
      <Ornament kind="demo" side="right" className="top-[-10rem]" />
      <div className="reveal lg:col-span-5">
        <h2 id={`${s.id}-h`} className="h-section">
          {s.title}
        </h2>
        <p className="lead mt-6">{s.lead}</p>
        <p className="mt-8 flex flex-wrap items-center gap-x-2 text-ink-2">
          <Icon name="mail" className="text-ember-ink" />
          {s.direct}:{" "}
          <a className="text-link" href="mailto:hello@bgts.ai">
            hello@bgts.ai
          </a>
        </p>
      </div>
      <div className="reveal lg:col-span-7">
        <div className="rail-bar mb-5" aria-hidden="true" />
        <div className="ticket">
          <span className="ticket-clip" aria-hidden="true" />
          <p className="flex items-baseline justify-between gap-4 px-5 pt-5 md:px-7">
            <span className="text-[1.125rem] font-bold">{s.formTitle}</span>
            <span className="mono text-[0.75rem] text-ink-3">MeetSense</span>
          </p>
          <hr className="tear mx-5 mt-4 md:mx-7" />
          <DemoForm c={c} />
        </div>
      </div>
    </section>
  );
}
