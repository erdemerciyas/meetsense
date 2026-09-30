import type { SiteContent } from "@/content/types";

export function Enterprise({ c }: { c: SiteContent }) {
  const s = c.enterprise;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-h`} className="border-y border-rule bg-paper">
      <div className="shell grid gap-10 py-24 lg:grid-cols-12 lg:gap-10 lg:py-32">
        <div className="lg:col-span-5">
          <h2 id={`${s.id}-h`} className="h-section">
            {s.title}
          </h2>
          <p className="lead mt-6">{s.lead}</p>
        </div>
        <dl className="lg:col-span-6 lg:col-start-7">
          {s.items.map((item) => (
            <div key={item.label} className="grid gap-1 border-t border-rule py-5 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <dt className="mono pt-0.5 text-[0.875rem] font-semibold">{item.label}</dt>
              <dd className="text-ink-2">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
