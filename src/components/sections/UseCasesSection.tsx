"use client";

import { motion } from "framer-motion";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function UseCasesSection({
  content,
}: {
  content: SiteContent["useCases"];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section id="use-cases" className="section-padding relative">
      <SectionDivider />
      <div className="section-shell">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />
      </div>

      <div className="section-shell section-content space-y-8">
        {content.items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={reducedMotion ? false : { opacity: 0, y: 32, filter: "blur(8px)" }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: motionDuration.slow,
              delay: index * 0.05,
              ease: motionEase,
            }}
            className={cn(
              "use-case-card group relative overflow-hidden rounded-3xl",
              !reducedMotion && "lg:sticky lg:top-28",
            )}
            style={{ zIndex: index + 1 }}
          >
            <BorderBeam
              className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              size={240}
              duration={10}
            />
            <div className="elevated-card-lg relative p-8 transition-shadow duration-500 group-hover:shadow-[0_32px_80px_-32px_rgba(245,158,11,0.15)] md:p-10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/8 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />

              <p className="chip border-accent/30 bg-accent/10 text-accent">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-accent-warm md:text-3xl">
                {item.title}
              </h3>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="elevated-card rounded-2xl border-accent-dim/20 p-4 transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <p className="chip border-transparent bg-transparent p-0 text-accent-warm">
                    {content.caseLabels.problem}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.problem}</p>
                </div>
                <div className="elevated-card rounded-2xl border-accent/20 p-4 transition-transform duration-300 group-hover:translate-y-[-2px] [transition-delay:50ms]">
                  <p className="chip border-transparent bg-transparent p-0 text-accent-warm">
                    {content.caseLabels.flow}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.flow}</p>
                </div>
                <div className="elevated-card rounded-2xl border-accent-warm/20 p-4 transition-transform duration-300 group-hover:translate-y-[-2px] [transition-delay:100ms]">
                  <p className="chip border-transparent bg-transparent p-0 text-accent-warm">
                    {content.caseLabels.result}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.result}</p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
