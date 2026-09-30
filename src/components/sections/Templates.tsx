import type { SiteContent } from "@/content/types";
import { Ornament } from "@/components/ui/Ornament";
import { Icon, type IconName } from "@/components/ui/Icon";
import { KindGlyph } from "@/components/ui/KindGlyph";

const SPECIMEN_ICONS: IconName[] = ["standard", "client", "interview", "daily"];

export function Templates({ c }: { c: SiteContent }) {
  const s = c.templates;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-h`} className="tone-tint relative isolate border-t border-rule">
      <Ornament kind="templates" side="right" className="top-[-10rem]" />
      <div className="shell py-24 lg:py-32 xl:py-40">
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:gap-10">
        <h2 id={`${s.id}-h`} className="h-section lg:col-span-7">
          {s.title}
        </h2>
        <div className="lg:col-span-5 lg:pt-3">
          <p className="lead">{s.lead}</p>
          <p className="mt-4 text-ink-2">{s.honest}</p>
        </div>
      </div>

      <div className="reveal mt-16">
        <div className="rail-bar hidden lg:block" aria-hidden="true" />
        <ul className="grid gap-x-5 gap-y-12 pt-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {s.specimens.map((sp, i) => (
            <li key={sp.name} className="relative">
              <div className="rail-bar mb-5 lg:hidden" aria-hidden="true" />
              <article className="ticket lift px-5 pt-4 pb-5">
                <span className="ticket-clip" aria-hidden="true" />
                <p className="mono flex items-start justify-between gap-3 text-[0.75rem] text-ink-3">
                  {sp.purpose}
                  {SPECIMEN_ICONS[i] && <Icon name={SPECIMEN_ICONS[i]} className="size-6 text-ember-ink" />}
                </p>
                <h3 className="mt-1 text-[1.375rem] leading-tight font-bold">{sp.name}</h3>
                <hr className="tear my-3.5" />
                <p className="text-[0.9375rem] font-semibold">{sp.heading}</p>
                <dl className="mono mt-3 space-y-1 text-[0.8125rem]">
                  {sp.rows.map((r) => (
                    <div key={r.label} className="flex justify-between gap-3 border-b border-dotted border-rule pb-1">
                      <dt className="text-ink-3">{r.label}</dt>
                      <dd className="font-semibold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                {sp.flag && (
                  <p className="mt-3 flex gap-1.5 text-[0.875rem] font-semibold text-ember-ink">
                    <KindGlyph kind="risk" className="mt-0.5 size-3.5 flex-none text-ember" />
                    {sp.flag}
                  </p>
                )}
                <hr className="tear my-3.5" />
                <p className="mono text-[0.75rem] text-ink-2">{sp.footer}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-10 max-w-[62ch] text-ink-2">{s.custom}</p>
      </div>
    </section>
  );
}
