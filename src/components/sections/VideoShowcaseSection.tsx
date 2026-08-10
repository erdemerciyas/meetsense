"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { CountUp } from "@/components/ui/CountUp";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { getMediaSlot } from "@/content/media";
import type { SiteContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function VideoShowcaseSection({
  content,
  locale,
}: {
  content: SiteContent["videoShowcase"];
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const videoWrap = videoWrapRef.current;
    if (reducedMotion || !section || !videoWrap) return;

    const ctx = gsap.context(() => {
      gsap.to(videoWrap, {
        scale: 1.06,
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="video-showcase"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <SectionDivider />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/6 blur-3xl"
        aria-hidden
      />

      <div className="section-shell">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
          align="center"
        />
      </div>

      <div className="section-shell section-content">
        <div className="gradient-border-card group relative overflow-hidden rounded-3xl">
          <BorderBeam className="opacity-60" size={280} duration={12} />
          <div ref={videoWrapRef} className="overflow-hidden rounded-[calc(1.5rem-1px)]">
            <VideoSlot
              slot={getMediaSlot("showcase")}
              className="aspect-video md:aspect-[21/9]"
            />
          </div>
        </div>
      </div>

      <div className="section-shell section-content grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={reducedMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: motionDuration.normal,
              delay: index * 0.08,
              ease: motionEase,
            }}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            className="elevated-card group px-6 py-8 text-center transition-shadow duration-500 hover:border-accent/25 hover:shadow-[0_20px_56px_-24px_var(--accent-glow)]"
          >
            <p className="font-display text-3xl font-semibold text-foreground transition-colors duration-300 group-hover:text-accent-warm md:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix} locale={locale} />
            </p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
