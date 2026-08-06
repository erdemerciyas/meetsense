"use client";

import { motion } from "framer-motion";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ValueSection({ content }: { content: SiteContent["value"] }) {
  const reducedMotion = useReducedMotion();

  return (
    <section id="value" className="section-padding relative">
      <SectionDivider />
      <div className="section-shell">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="section-content grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reducedMotion ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: motionDuration.normal,
                delay: index * 0.06,
                ease: motionEase,
              }}
              whileHover={
                reducedMotion
                  ? undefined
                  : { y: -4, transition: { duration: motionDuration.fast } }
              }
              className="elevated-card group p-6 transition-colors duration-500 hover:border-accent/25 hover:shadow-[0_24px_64px_-24px_rgba(245,158,11,0.18)]"
            >
              <div
                className="mb-4 h-px w-8 bg-accent/40 transition-all duration-500 group-hover:w-12 group-hover:bg-accent"
                aria-hidden
              />
              <h3 className="font-display text-xl font-semibold text-white transition-colors duration-300 group-hover:text-accent-warm">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
