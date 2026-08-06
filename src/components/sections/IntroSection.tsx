"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { IntroStepIcon } from "@/components/icons/IntroStepIcons";
import { getMediaSlot } from "@/content/media";
import type { SiteContent, StepItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { getTeamsScroller } from "@/lib/teamsScroll";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const stepMedia = [
  getMediaSlot("introJoin"),
  getMediaSlot("introRecord"),
  getMediaSlot("introTranscribe"),
  getMediaSlot("introAnalyze"),
] as const;

/** Sticky offset inside Teams content scroller — aligns with card top band */
const STICKY_TOP = "top-6";

function scrollPanelIntoView(element: HTMLElement) {
  const scroller = getTeamsScroller();
  if (!scroller) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const scrollerRect = scroller.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const top =
    scroller.scrollTop +
    (elementRect.top - scrollerRect.top) -
    24;

  scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function StepMarker({
  step,
  index,
  isActive,
  isPast,
  isLast,
  onSelect,
}: {
  step: StepItem;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isLast: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="relative">
      {/* Line to next marker — centered on circle (18px = half of 36px) */}
      {!isLast ? (
        <span
          className="pointer-events-none absolute left-[1.125rem] top-9 bottom-[-2rem] hidden w-px -translate-x-1/2 lg:block"
          aria-hidden
        >
          <span className="absolute inset-0 bg-teams-border" />
          <span
            className={cn(
              "absolute inset-x-0 top-0 bg-teams-accent transition-all duration-500 ease-out",
              isPast ? "h-full" : "h-0",
            )}
          />
        </span>
      ) : null}

      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "step" : undefined}
        className="relative flex w-full items-start gap-3 text-left"
      >
        <span
          className={cn(
            "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors duration-300",
            isActive
              ? "border-teams-accent bg-teams-accent text-white shadow-[0_0_0_4px_rgba(91,95,199,0.18)]"
              : isPast
                ? "border-teams-accent/50 bg-teams-accent/20 text-teams-accent-light"
                : "border-teams-border bg-teams-canvas text-teams-muted",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={cn(
            "min-w-0 flex-1 rounded-lg px-2.5 py-1.5 transition-colors duration-300",
            isActive && "bg-teams-accent/10",
          )}
        >
          <span
            className={cn(
              "block text-sm font-semibold leading-snug",
              isActive ? "text-teams-text" : "text-teams-text-secondary",
            )}
          >
            {step.title}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-teams-muted">
            {step.highlights?.[0]}
          </span>
        </span>
      </button>
    </div>
  );
}

function StepPanel({
  step,
  index,
  mediaIndex,
  reducedMotion,
}: {
  step: StepItem;
  index: number;
  mediaIndex: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -6% 0px" }}
      transition={{ duration: motionDuration.slow, ease: motionEase }}
      className="elevated-card-lg overflow-hidden p-0"
    >
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="flex flex-col p-5 md:p-7 lg:p-8">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teams-accent/30 bg-gradient-to-br from-teams-accent/20 to-teams-surface md:h-14 md:w-14">
              <IntroStepIcon
                stepId={step.id}
                className="h-8 w-8 md:h-9 md:w-9"
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teams-accent-light">
                {String(index + 1).padStart(2, "0")} / 04
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-teams-text md:text-2xl lg:text-3xl">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-teams-text-secondary md:mt-5 md:text-base">
            {step.description}
          </p>

          {step.highlights?.length ? (
            <ul className="mt-5 space-y-2.5 border-t border-teams-border pt-5 md:mt-6 md:space-y-3 md:pt-6">
              {step.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-teams-muted"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teams-accent"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="border-t border-teams-border bg-teams-bg/40 p-3 md:border-l md:border-t-0 md:p-4 lg:p-5">
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-teams-border bg-teams-bg">
            <VideoSlot
              slot={{ ...stepMedia[mediaIndex], fullScreen: true }}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function IntroSection({ content }: { content: SiteContent["intro"] }) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectStep = useCallback(
    (index: number) => {
      const step = content.steps[index];
      if (!step) return;
      const panel = document.getElementById(`intro-step-${step.id}`);
      if (panel) scrollPanelIntoView(panel);
      setActiveIndex(index);
    },
    [content.steps],
  );

  useEffect(() => {
    const scroller = getTeamsScroller();
    const panels = content.steps
      .map((step) => document.getElementById(`intro-step-${step.id}`))
      .filter(Boolean) as HTMLElement[];

    if (!panels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible?.target) return;
        const id = visible.target.id.replace("intro-step-", "");
        const index = content.steps.findIndex((step) => step.id === id);
        if (index >= 0) setActiveIndex(index);
      },
      {
        root: scroller,
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.55],
      },
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [content.steps]);

  return (
    <section id="intro" ref={sectionRef} className="section-padding relative">
      <SectionDivider />
      <div
        className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-teams-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="section-shell relative">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />

        {/* Each step = [sticky marker | card] so marker stays aligned with its card */}
        <div className="mt-8 flex flex-col gap-5 md:gap-6 lg:mt-10 lg:gap-8">
          {content.steps.map((step, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isLast = index === content.steps.length - 1;

            return (
              <div
                key={step.id}
                id={`intro-step-${step.id}`}
                data-intro-panel={index}
                className="grid scroll-mt-6 items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[16.5rem_minmax(0,1fr)]"
              >
                {/* Mobile marker */}
                <div className="lg:hidden">
                  <StepMarker
                    step={step}
                    index={index}
                    isActive={isActive}
                    isPast={isPast}
                    isLast={isLast}
                    onSelect={() => selectStep(index)}
                  />
                </div>

                {/* Desktop sticky marker — sticks for the height of this card row */}
                <div className="relative hidden min-h-0 lg:block">
                  <div
                    className={cn(
                      "sticky z-20",
                      STICKY_TOP,
                    )}
                  >
                    <StepMarker
                      step={step}
                      index={index}
                      isActive={isActive}
                      isPast={isPast}
                      isLast={isLast}
                      onSelect={() => selectStep(index)}
                    />
                  </div>
                </div>

                <StepPanel
                  step={step}
                  index={index}
                  mediaIndex={index}
                  reducedMotion={reducedMotion}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
