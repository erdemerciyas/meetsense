"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Particles } from "@/components/ui/Particles";
import { Spotlight } from "@/components/ui/Spotlight";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { WaveformCanvas } from "@/components/ui/WaveformCanvas";
import { getMediaSlot } from "@/content/media";
import type { SiteContent } from "@/content/types";
import { motionDuration, motionEase, revealItemVariants } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection({ content }: { content: SiteContent["hero"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".hero-video", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-waveform", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <Spotlight className="relative min-h-[100svh] overflow-hidden">
      <section
        ref={sectionRef}
        className="relative min-h-[100svh] pt-24 md:pt-28"
      >
        <div className="hero-video absolute inset-0 -z-20 h-full w-full">
          <VideoSlot
            slot={getMediaSlot("hero")}
            className="h-full w-full rounded-none border-0"
          />
        </div>
        <div className="hero-waveform pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[55%] opacity-90 md:block [mask-image:linear-gradient(to_left,black_55%,transparent)]">
          <WaveformCanvas overlay intensity={1.2} className="h-full w-full" />
        </div>
        <div className="hero-waveform pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 opacity-70 md:hidden [mask-image:linear-gradient(to_top,black_40%,transparent)]">
          <WaveformCanvas overlay intensity={1} className="h-full w-full" />
        </div>
        <AnimatedGrid className="-z-10 opacity-50" />
        <Particles className="-z-10 opacity-80" count={36} />
        <div className="noise-overlay absolute inset-0 -z-10 opacity-30" />
        <div className="grid-bg absolute inset-0 -z-10 opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/85 via-background/55 to-background/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/20 via-transparent to-background" />

        <div className="section-shell relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center pb-20">
          {reducedMotion ? (
            <>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-accent">
                {content.eyebrow}
              </p>
              <h1 className="font-display max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                <span className="text-gradient">{content.title}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                {content.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {content.badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="#cta">{content.ctaPrimary}</Button>
                <Button href="#intro" variant="secondary">
                  {content.ctaSecondary}
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
              }}
            >
              <motion.p
                variants={revealItemVariants}
                transition={{ duration: motionDuration.normal, ease: motionEase }}
                className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-accent"
              >
                {content.eyebrow}
              </motion.p>
              <motion.h1
                variants={revealItemVariants}
                transition={{ duration: motionDuration.slow, ease: motionEase }}
                className="font-display max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
              >
                <span className="text-gradient">{content.title}</span>
              </motion.h1>
              <motion.p
                variants={revealItemVariants}
                transition={{ duration: motionDuration.normal, ease: motionEase }}
                className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
              >
                {content.subtitle}
              </motion.p>
              <motion.div
                variants={revealItemVariants}
                transition={{ duration: motionDuration.normal, ease: motionEase }}
                className="mt-8 flex flex-wrap gap-2"
              >
                {content.badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </motion.div>
              <motion.div
                variants={revealItemVariants}
                transition={{ duration: motionDuration.normal, ease: motionEase }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Button href="#cta">{content.ctaPrimary}</Button>
                <Button href="#intro" variant="secondary">
                  {content.ctaSecondary}
                </Button>
              </motion.div>
            </motion.div>
          )}

          <motion.div
            className="mt-16 flex items-center gap-3 text-sm text-muted"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={reducedMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 1.2, duration: motionDuration.slow, ease: motionEase }}
          >
            <span className="inline-block h-8 w-px bg-accent/60" />
            <span className="flex items-center gap-2">
              {content.scrollHint}
              <motion.span
                className="inline-block h-4 w-px bg-accent/40"
                animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>
        </div>
      </section>
    </Spotlight>
  );
}
