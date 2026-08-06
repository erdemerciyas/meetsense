"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { TeamsMeetSenseIcon } from "@/components/icons/TeamsIcons";
import { getMediaSlot } from "@/content/media";
import type { SiteContent } from "@/content/types";
import { motionDuration, motionEase, revealItemVariants } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type HeroSectionProps = {
  content: SiteContent["hero"];
  teamsShell: SiteContent["teamsShell"];
};

export function HeroSection({ content, teamsShell }: HeroSectionProps) {
  const reducedMotion = useReducedMotion();

  const heroContent = (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-teams-accent/30 bg-teams-accent/10 px-3 py-1.5">
          <TeamsMeetSenseIcon className="h-4 w-4" />
          <span className="text-xs font-semibold text-teams-accent-light">
            {content.eyebrow}
          </span>
        </div>

        <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-teams-text md:text-4xl lg:text-5xl">
          <span className="text-gradient">{content.title}</span>
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-teams-text-secondary md:text-base">
          {content.subtitle}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {content.badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#cta">{content.ctaPrimary}</Button>
          <Button href="#intro" variant="secondary">
            {content.ctaSecondary}
          </Button>
        </div>
      </div>

      {/* Teams meeting preview */}
      <div className="teams-meeting-preview relative overflow-hidden rounded-lg border border-teams-border bg-teams-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-teams-border bg-teams-surface px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="teams-live-dot inline-block" />
            <span className="text-xs font-medium text-teams-success">
              {teamsShell.liveMeeting}
            </span>
          </div>
          <span className="truncate text-xs text-teams-muted">
            {teamsShell.meetingTitle}
          </span>
        </div>

        <div className="hero-video relative aspect-video">
          <VideoSlot
            slot={getMediaSlot("hero")}
            className="h-full w-full rounded-none border-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teams-bg/80 via-transparent to-teams-bg/20" />

          {/* MeetSense bot overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-teams-accent/40 bg-teams-bg/90 px-3 py-2 backdrop-blur-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teams-accent text-[10px] font-bold text-white">
              MS
            </div>
            <div>
              <p className="text-xs font-semibold text-teams-text">
                {teamsShell.participants[0]?.name}
              </p>
              <p className="text-[10px] text-teams-success">
                {teamsShell.participants[0]?.status}
              </p>
            </div>
          </div>

          {/* Participant tiles */}
          <div className="absolute bottom-3 right-3 flex -space-x-2">
            {teamsShell.participants.slice(1, 4).map((p) => (
              <div
                key={p.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-teams-bg bg-teams-surface-hover text-[10px] font-semibold text-teams-text"
                title={p.name}
              >
                {p.initials}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 border-t border-teams-border bg-teams-surface px-4 py-3">
          {["🎤", "📹", "🖥️", "💬", "•••", "📞"].map((icon) => (
            <button
              key={icon}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-teams-surface-hover text-sm transition-colors hover:bg-teams-border"
              aria-hidden
            >
              {icon}
            </button>
          ))}
          <button
            type="button"
            className="ml-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white"
            aria-hidden
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative border-b border-teams-border bg-teams-canvas px-4 py-10 md:px-6 md:py-14">
      {reducedMotion ? (
        <div className="section-shell">{heroContent}</div>
      ) : (
        <motion.div
          className="section-shell"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={revealItemVariants}
            transition={{ duration: motionDuration.normal, ease: motionEase }}
          >
            {heroContent}
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="section-shell mt-8 flex items-center gap-2 text-xs text-teams-muted"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={{ delay: 0.8, duration: motionDuration.slow, ease: motionEase }}
      >
        <span>{content.scrollHint}</span>
        <motion.span
          className="inline-block text-teams-accent"
          animate={reducedMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
