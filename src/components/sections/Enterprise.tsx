import type { SiteContent } from "@/content/types";
import { Ornament } from "@/components/ui/Ornament";
import { Flight } from "@/components/ui/Flight";
import { Icon, type IconName } from "@/components/ui/Icon";

const ITEM_ICONS: IconName[] = ["key", "calendar", "eye", "channels", "share", "globe"];

export function Enterprise({ c }: { c: SiteContent }) {
  const s = c.enterprise;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-h`} className="on-ink edge-torn relative isolate">
      <Ornament kind="enterprise" side="left" split="light-dark" className="top-[-10rem]" />
      <Flight kind="key" className="top-4 xl:top-8" />
      <div className="shell grid gap-10 py-24 lg:grid-cols-12 lg:gap-10 lg:py-32 xl:py-40">
        <div className="reveal lg:col-span-5">
          <h2 id={`${s.id}-h`} className="h-section">
            {s.title}
          </h2>
          <p className="lead mt-6">{s.lead}</p>
        </div>
        <dl className="reveal lg:col-span-6 lg:col-start-7">
          {s.items.map((item, i) => (
            <div key={item.label} className="group grid gap-1 border-t border-rule py-5 transition-colors duration-200 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <dt className="mono flex items-center gap-2.5 text-[0.875rem] font-semibold transition-colors duration-200 group-hover:text-ember-ink">
                {ITEM_ICONS[i] && <Icon name={ITEM_ICONS[i]} className="text-ember transition-transform duration-200 group-hover:scale-110" />}{item.label}</dt>
              <dd className="text-ink-2">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
