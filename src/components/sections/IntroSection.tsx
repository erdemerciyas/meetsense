"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { getMediaSlot } from "@/content/media";
import type { SiteContent, StepItem } from "@/content/types";
import { IntroStepIconBadge } from "@/components/icons/IntroStepIcons";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const stepMedia = [
  getMediaSlot("introJoin"),
  getMediaSlot("introRecord"),
  getMediaSlot("introTranscribe"),
  getMediaSlot("introAnalyze"),
] as const;

const PINNED_CARD_CLASS =
  "elevated-card rounded-[2rem] border border-accent/20 p-8 xl:p-10";

function getStepState(
  stepIndex: number,
  activeIndex: number,
  exitX: number,
  enterX: number,
) {
  const diff = activeIndex - stepIndex;

  if (diff === 0) {
    return { x: 0, scale: 1, opacity: 1, zIndex: 20, filter: "blur(0px)" };
  }

  if (diff > 0) {
    return {
      x: exitX,
      scale: 0.96,
      opacity: 0,
      zIndex: 1,
      filter: "blur(0px)",
    };
  }

  return {
    x: enterX,
    scale: 0.96,
    opacity: 0,
    zIndex: 1,
    filter: "blur(0px)",
  };
}

function StepCardContent({
  step,
  className,
}: {
  step: StepItem;
  className?: string;
}) {
  return (
    <article className={className}>
      <h3 className="font-display text-3xl font-semibold leading-[1.08] text-foreground xl:text-5xl">
        {step.title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-foreground/85 xl:mt-5 xl:text-lg">
        {step.description}
      </p>
      {step.highlights?.length ? (
        <ul className="mt-5 space-y-2.5 border-t border-border pt-5 xl:mt-6 xl:space-y-3 xl:pt-6">
          {step.highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-relaxed text-muted xl:text-base"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function PinnedStep({
  step,
  index,
}: {
  step: StepItem;
  index: number;
}) {
  return (
    <div className="intro-step absolute flex w-full max-w-[min(100%,820px)] items-center gap-5 will-change-transform xl:gap-7">
      <IntroStepIconBadge
        stepId={step.id}
        index={index}
        size="pinned"
        className="shrink-0"
      />
      <StepCardContent step={step} className={cn("min-w-0 flex-1", PINNED_CARD_CLASS)} />
    </div>
  );
}

function InlineStep({
  step,
  index,
  cardClassName,
}: {
  step: StepItem;
  index: number;
  cardClassName?: string;
}) {
  return (
    <div className="group flex items-start gap-5 transition-all duration-500 hover:-translate-y-1 sm:gap-6 lg:items-center xl:gap-8">
      <IntroStepIconBadge stepId={step.id} index={index} className="shrink-0" />
      <StepCardContent
        step={step}
        className={cn("min-w-0 flex-1", cardClassName)}
      />
    </div>
  );
}

function MobileSteps({ content }: { content: SiteContent["intro"] }) {
  return (
    <div className="section-shell mt-10 space-y-8 lg:hidden">
      {content.steps.map((step, index) => (
        <div key={step.id} className="space-y-6">
          <InlineStep
            step={step}
            index={index}
            cardClassName="glass-panel rounded-3xl p-7 transition-shadow duration-500 group-hover:border-accent/20 group-hover:shadow-[0_24px_64px_-32px_var(--accent-glow)]"
          />
          <VideoSlot slot={stepMedia[index]} className="aspect-[4/3] w-full" />
        </div>
      ))}
    </div>
  );
}

function DesktopFallback({ content }: { content: SiteContent["intro"] }) {
  return (
    <div className="section-shell mt-16 hidden space-y-8 lg:block">
      {content.steps.map((step, index) => (
        <InlineStep
          key={step.id}
          step={step}
          index={index}
          cardClassName="glass-panel rounded-3xl p-10 transition-shadow duration-500 group-hover:border-accent/20 group-hover:shadow-[0_24px_64px_-32px_var(--accent-glow)]"
        />
      ))}
    </div>
  );
}

export function IntroSection({ content }: { content: SiteContent["intro"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !pinRef.current || !stageRef.current) return;

    const pin = pinRef.current;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const stage = stageRef.current;
      if (!stage) return;

      const ctx = gsap.context(() => {
        const steps = gsap.utils.toArray<HTMLElement>(".intro-step", pin);
        const mockups = gsap.utils.toArray<HTMLElement>(".intro-mockup", pin);
        const count = steps.length;

        const measure = () => {
          const width = stage.clientWidth;
          const cardWidth =
            (steps[0] as HTMLElement | undefined)?.offsetWidth ?? width;
          const travel = width / 2 + cardWidth / 2 + 48;
          return {
            exitX: -travel,
            enterX: travel,
          };
        };

        let { exitX, enterX } = measure();

        gsap.set(steps, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
        });

        steps.forEach((step, index) => {
          gsap.set(step, getStepState(index, 0, exitX, enterX));
        });

        gsap.set(mockups, { autoAlpha: 0, scale: 0.98 });
        gsap.set(mockups[0], { autoAlpha: 1, scale: 1 });

        const refreshLayout = () => {
          ({ exitX, enterX } = measure());
          ScrollTrigger.refresh();
        };

        requestAnimationFrame(() => {
          requestAnimationFrame(refreshLayout);
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top 80px",
            end: () => `+=${Math.max(count - 1, 1) * 100}%`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let activeIndex = 1; activeIndex < count; activeIndex++) {
          const segment = activeIndex - 1;

          tl.call(
            () => {
              ({ exitX, enterX } = measure());
            },
            [],
            segment,
          );

          steps.forEach((step, stepIndex) => {
            tl.to(
              step,
              {
                x: () => getStepState(stepIndex, activeIndex, exitX, enterX).x,
                scale: () =>
                  getStepState(stepIndex, activeIndex, exitX, enterX).scale,
                opacity: () =>
                  getStepState(stepIndex, activeIndex, exitX, enterX).opacity,
                zIndex: () =>
                  getStepState(stepIndex, activeIndex, exitX, enterX).zIndex,
                filter: () =>
                  getStepState(stepIndex, activeIndex, exitX, enterX).filter,
                duration: 1,
                ease: "power3.inOut",
              },
              segment,
            );
          });

          tl.to(
            mockups[activeIndex - 1],
            { autoAlpha: 0, scale: 0.98, duration: 0.35 },
            segment,
          ).to(
            mockups[activeIndex],
            { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.out" },
            segment,
          );
        }

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
        };
      }, pin);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reducedMotion, content.steps.length]);

  if (reducedMotion) {
    return (
      <section id="intro" ref={sectionRef} className="relative py-24 md:py-32">
        <SectionDivider />
        <div className="section-shell">
          <SectionHeading
            label={content.label}
            title={content.title}
            subtitle={content.subtitle}
          />
        </div>
        <DesktopFallback content={content} />
        <MobileSteps content={content} />
      </section>
    );
  }

  return (
    <section id="intro" ref={sectionRef} className="relative py-24 md:py-32">
      <SectionDivider />
      <div className="section-shell">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />
      </div>

      <div ref={pinRef} className="intro-pin-area relative mt-16 hidden lg:block">
        <div className="relative mx-auto grid min-h-[min(88vh,820px)] w-full max-w-[min(100%,92rem)] grid-cols-[minmax(0,42.5rem)_minmax(0,1fr)] items-center gap-10 px-6 md:px-10 xl:gap-14">
          <div
            ref={stageRef}
            className="intro-stage relative isolate z-10 h-[min(64vh,560px)] w-full overflow-hidden"
          >
            {content.steps.map((step, index) => (
              <PinnedStep key={step.id} step={step} index={index} />
            ))}
          </div>

          <div className="relative z-0 flex h-[min(64vh,560px)] min-w-0 items-center">
            <div className="intro-mockup-frame relative aspect-[16/10] w-full">
              {content.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "intro-mockup absolute inset-0",
                    index > 0 && "invisible opacity-0",
                  )}
                >
                  <VideoSlot
                    slot={stepMedia[index]}
                    className="h-full w-full rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileSteps content={content} />
    </section>
  );
}
