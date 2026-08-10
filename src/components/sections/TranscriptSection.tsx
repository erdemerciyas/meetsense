"use client";

import { motion } from "framer-motion";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function TranscriptSection({
  content,
}: {
  content: SiteContent["transcript"];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section id="transcript" className="section-padding relative">
      <SectionDivider />
      <div className="section-shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />

        <motion.div
          className="elevated-card action-panel rounded-2xl p-6 md:p-8"
          initial={reducedMotion ? false : { opacity: 0, x: 24, filter: "blur(8px)" }}
          whileInView={reducedMotion ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: motionDuration.slow, ease: motionEase }}
        >
          <h3 className="font-display text-lg font-semibold text-white">
            {content.actionTitle}
          </h3>
          <ul className="mt-4 space-y-3">
            {content.actionItems.map((item, index) => (
              <motion.li
                key={item}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: motionDuration.normal,
                  delay: index * 0.1,
                  ease: motionEase,
                }}
                className="action-item group flex items-start gap-3 rounded-lg border border-accent/25 bg-accent/8 px-4 py-3 text-sm text-muted transition-all duration-200 hover:bg-accent/12"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="section-shell mt-12">
        <div className="elevated-card-lg rounded-3xl p-6 md:p-10">
          <div className="space-y-5">
            {content.lines.map((line, index) => (
              <motion.div
                key={`${line.speaker}-${index}`}
                initial={
                  reducedMotion ? false : { opacity: 0, x: -24, filter: "blur(6px)" }
                }
                whileInView={
                  reducedMotion ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }
                }
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: motionDuration.normal,
                  delay: index * 0.08,
                  ease: motionEase,
                }}
                className={cn(
                  "transcript-line group rounded-lg border px-4 py-3 transition-all duration-200",
                  line.highlight
                    ? "border-accent/40 bg-accent/10"
                    : "border-border bg-surface hover:bg-surface-elevated",
                )}
              >
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: line.speakerColor }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: line.speakerColor }}
                  >
                    {line.speaker}
                  </span>
                  {line.highlightLabel ? (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      {line.highlightLabel}
                    </span>
                  ) : null}
                </div>
                <p className="text-base leading-relaxed text-foreground/90">
                  {line.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
