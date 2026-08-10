"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";
import { FeatureDemo } from "@/components/sections/FeatureDemos";
import type { FeatureCategory, FeatureItem, SiteContent } from "@/content/types";
import {
  CATEGORY_ACCENTS,
  FEATURE_CATEGORIES,
  FEATURE_ICONS,
  getAdjacentFeature,
  getFeatureIndex,
  groupFeaturesByCategory,
} from "@/lib/featuresExplorer";
import { cn } from "@/lib/cn";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = motionEase;

function FeatureNavItem({
  feature,
  categoryLabel,
  isActive,
  index,
  onSelect,
}: {
  feature: FeatureItem;
  categoryLabel: string;
  isActive: boolean;
  index: number;
  onSelect: () => void;
}) {
  const accent = CATEGORY_ACCENTS[feature.category];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0.55,
        x: isActive ? 4 : 0,
      }}
      whileHover={!isActive ? { scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "relative w-full rounded-xl border px-4 py-3.5 text-left transition-colors duration-300",
        isActive
          ? cn(accent.border, accent.bg, accent.glow)
          : "border-transparent hover:border-foreground/10 hover:bg-foreground/5",
      )}
      aria-pressed={isActive}
    >
      {isActive ? (
        <motion.span
          layoutId="feature-active-indicator"
          className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      ) : null}

      <div className="flex items-start gap-3 pl-2">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-foreground/5 text-sm">
          {FEATURE_ICONS[feature.id] ?? "•"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tabular-nums text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider",
                isActive ? accent.text : "text-muted",
              )}
            >
              {categoryLabel}
            </span>
          </div>
          <h3 className="mt-1 font-display text-sm font-semibold text-foreground md:text-base">
            {feature.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function FeatureDetailStage({
  feature,
  content,
  onPrev,
  onNext,
}: {
  feature: FeatureItem;
  content: SiteContent["features"];
  onPrev: () => void;
  onNext: () => void;
}) {
  const accent = CATEGORY_ACCENTS[feature.category];
  const stepIndex = getFeatureIndex(content.items, feature.id);

  return (
    <motion.div
      key={feature.id}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease }}
      className="flex h-full flex-col"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider",
              accent.border,
              accent.bg,
              accent.text,
            )}
          >
            {content.categoryLabels[feature.category]}
          </span>
          <h3 className="mt-3 font-display text-2xl font-semibold text-foreground md:text-3xl">
            {feature.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {feature.longDescription}
          </p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted">
          {stepIndex + 1} / {content.items.length}
        </span>
      </div>

      <div className="mb-6 flex-1">
        <FeatureDemo
          feature={feature}
          demo={content.demos[feature.id] ?? {}}
          labels={content.demoLabels}
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          {content.highlightsLabel}
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {feature.highlights.map((highlight, index) => (
            <motion.li
              key={highlight}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.35, ease }}
              className="flex items-start gap-2 rounded-xl border border-border bg-foreground/5 px-3 py-2.5 text-sm text-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {highlight}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <button type="button" onClick={onPrev} className="control-btn-neutral">
          {content.prevLabel}
        </button>
        <button type="button" onClick={onNext} className="control-btn-accent">
          {content.nextLabel}
        </button>
      </div>
    </motion.div>
  );
}

export function FeaturesExplorer({
  content,
}: {
  content: SiteContent["features"];
}) {
  const reducedMotion = useReducedMotion();
  const grouped = useMemo(
    () => groupFeaturesByCategory(content.items),
    [content.items],
  );

  const [activeCategory, setActiveCategory] = useState<FeatureCategory>("meeting");
  const [activeId, setActiveId] = useState(content.items[0]?.id ?? "");

  const activeFeature =
    content.items.find((item) => item.id === activeId) ?? content.items[0];

  const categoryFeatures = grouped[activeCategory];
  const globalProgress =
    content.items.length > 1
      ? getFeatureIndex(content.items, activeId) / (content.items.length - 1)
      : 0;

  const selectFeature = useCallback((feature: FeatureItem) => {
    setActiveId(feature.id);
    setActiveCategory(feature.category);
  }, []);

  const goPrev = useCallback(() => {
    const prev = getAdjacentFeature(content.items, activeId, "prev");
    if (prev) selectFeature(prev);
  }, [content.items, activeId, selectFeature]);

  const goNext = useCallback(() => {
    const next = getAdjacentFeature(content.items, activeId, "next");
    if (next) selectFeature(next);
  }, [content.items, activeId, selectFeature]);

  useEffect(() => {
    if (reducedMotion) return;

    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reducedMotion, goPrev, goNext]);

  if (!activeFeature) return null;

  return (
    <section id="features" className="section-padding relative">
      <SectionDivider />
      <div className="section-shell">
        <SectionHeading
          label={content.label}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="section-content space-y-6">
          <p className="text-sm text-muted">{content.selectHint}</p>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(globalProgress * 100)}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-dim via-accent to-accent-warm"
              initial={false}
              animate={{ width: `${globalProgress * 100}%` }}
              transition={{ duration: motionDuration.slow, ease }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
          {FEATURE_CATEGORIES.map((category) => {
            const accent = CATEGORY_ACCENTS[category];
            const isActive = activeCategory === category;
            const count = grouped[category].length;

            return (
              <motion.button
                key={category}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => {
                  setActiveCategory(category);
                  const first = grouped[category][0];
                  if (first) setActiveId(first.id);
                }}
                className={cn(
                  "control-btn inline-flex items-center gap-2",
                  isActive
                    ? cn(accent.border, accent.bg, accent.text, accent.glow)
                    : "border-border bg-foreground/5 text-muted hover:border-foreground/20",
                )}
                aria-pressed={isActive}
              >
                {content.categoryLabels[category]}
                <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] tabular-nums">
                  {count}
                </span>
              </motion.button>
            );
          })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-8">
          <div className="elevated-card p-3 md:p-4">
            <div
              className="max-h-[520px] space-y-1 overflow-y-auto pr-1 md:max-h-[600px]"
              data-lenis-prevent
            >
              {categoryFeatures.map((feature) => (
                <FeatureNavItem
                  key={feature.id}
                  feature={feature}
                  categoryLabel={content.categoryLabels[feature.category]}
                  isActive={feature.id === activeId}
                  index={getFeatureIndex(content.items, feature.id)}
                  onSelect={() => selectFeature(feature)}
                />
              ))}
            </div>
          </div>

          <Spotlight size={420} color="rgba(91, 95, 199, 0.06)">
            <div className="elevated-card relative min-h-[480px] overflow-hidden p-5 md:min-h-[560px] md:p-8">
              <BorderBeam className="opacity-40" size={220} duration={14} />
              <AnimatePresence mode="wait">
                <FeatureDetailStage
                  key={activeFeature.id}
                  feature={activeFeature}
                  content={content}
                  onPrev={goPrev}
                  onNext={goNext}
                />
              </AnimatePresence>
            </div>
          </Spotlight>
          </div>
        </div>
      </div>
    </section>
  );
}
