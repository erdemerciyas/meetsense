"use client";

import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LifecycleFlow } from "@/components/sections/LifecycleFlow";
import type { SiteContent } from "@/content/types";

export function LifecycleSection({
  content,
}: {
  content: SiteContent["lifecycle"];
}) {
  return (
    <section id="lifecycle" className="section-padding relative overflow-hidden">
      <SectionDivider />
      <div
        className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-accent-warm/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent/6 blur-3xl"
        aria-hidden
      />

      <div className="section-shell relative">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />

        <LifecycleFlow content={content} />
      </div>
    </section>
  );
}
