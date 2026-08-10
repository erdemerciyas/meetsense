"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { FeatureDemoContent, FeatureItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { motionEase } from "@/lib/motion";

const SPEAKER_COLORS = ["#5b5fc7", "#6bb700", "#00bcf2"];

function DemoShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "elevated-card relative min-h-[280px] overflow-hidden p-5 md:min-h-[320px] md:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/8 blur-2xl"
        aria-hidden
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

type DemoProps = {
  demo: FeatureDemoContent;
  labels: { bot: string; question: string; answer: string };
};

function SmartMeetingDemo({ demo, labels }: DemoProps) {
  return (
    <DemoShell>
      <div className="space-y-3">
        {demo.events?.map((event, index) => (
          <motion.div
            key={`${event.time}-${event.title}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12, duration: 0.4, ease: motionEase }}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 hover:-translate-y-0.5",
              event.hasBot
                ? "border-accent/40 bg-accent/10 hover:border-accent/55"
                : "border-border bg-foreground/5 hover:border-foreground/20",
            )}
          >
            <span className="text-xs tabular-nums text-muted">{event.time}</span>
            <span className="flex-1 text-sm text-foreground">{event.title}</span>
            {event.hasBot ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="chip border-accent/30 bg-accent text-on-accent"
              >
                {labels.bot}
              </motion.span>
            ) : null}
          </motion.div>
        ))}
      </div>
    </DemoShell>
  );
}

function AutoJoinDemo({ demo }: DemoProps) {
  return (
    <DemoShell className="flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl border border-accent/40 bg-accent/15 px-8 py-4 font-display text-lg font-semibold text-accent-warm"
      >
        {demo.buttonLabel}
        <motion.span
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-warm"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: motionEase }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-border bg-foreground/5 px-4 py-2 text-xs text-muted"
      >
        {demo.statusLabel}
      </motion.div>
    </DemoShell>
  );
}

function DiarizationDemo({ demo }: DemoProps) {
  return (
    <DemoShell>
      <div className="space-y-3">
        {demo.speakers?.map((speaker, index) => (
          <motion.div
            key={speaker.name}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4, ease: motionEase }}
            className="flex gap-3"
          >
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SPEAKER_COLORS[index % SPEAKER_COLORS.length] }}
            />
            <div>
              <span
                className="text-xs font-medium"
                style={{ color: SPEAKER_COLORS[index % SPEAKER_COLORS.length] }}
              >
                {speaker.name}
              </span>
              <p className="mt-0.5 text-sm text-muted">{speaker.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </DemoShell>
  );
}

function SegmentAudioDemo({ demo }: DemoProps) {
  const lines = demo.lines ?? [];
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    if (lines.length === 0) return;
    const timer = window.setInterval(() => {
      setActiveLine((line) => (line + 1) % lines.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [lines.length]);

  return (
    <DemoShell>
      <div className="space-y-2">
        {lines.map((line, index) => (
          <motion.button
            key={line}
            type="button"
            onClick={() => setActiveLine(index)}
            animate={{
              opacity: activeLine === index ? 1 : 0.45,
              x: activeLine === index ? 4 : 0,
            }}
            transition={{ duration: 0.3, ease: motionEase }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              activeLine === index
                ? "border-accent/40 bg-accent/10 text-foreground"
                : "border-transparent text-muted",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px]",
                activeLine === index ? "bg-accent text-on-accent" : "bg-foreground/10",
              )}
            >
              ▶
            </span>
            {line}
          </motion.button>
        ))}
      </div>
      <motion.div layout className="mt-4 flex items-center gap-2">
        {[0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6].map((h, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-accent"
            animate={{ height: [8, h * 32, 8] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </DemoShell>
  );
}

function AccuracyDemo({ demo }: DemoProps) {
  return (
    <DemoShell>
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#5b5fc7"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 * (1 - 0.94) }}
              transition={{ duration: 1.2, ease: motionEase }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold text-accent">
            94%
          </span>
        </div>
        <div className="flex-1 space-y-2">
          {demo.auditLog?.map((log, i) => (
            <motion.div
              key={`${log.user}-${log.time}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, ease: motionEase }}
              className="rounded-xl border border-border bg-foreground/5 px-3 py-2 text-xs"
            >
              <span className="text-foreground">{log.user}</span>
              <span className="text-muted"> · {log.action}</span>
              <span className="float-right text-muted">{log.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

function VoiceAssistantDemo({ demo, labels }: DemoProps) {
  return (
    <DemoShell className="flex flex-col justify-between">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10"
        aria-hidden="true"
      >
        <span className="text-2xl">🎙</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ease: motionEase }}
        className="rounded-xl border border-accent/20 bg-accent/5 p-4"
      >
        <p className="text-xs text-muted">{labels.question}</p>
        <p className="mt-1 text-sm text-foreground">{demo.question}</p>
        <p className="mt-3 text-xs text-muted">{labels.answer}</p>
        <p className="mt-1 text-sm text-accent-warm">{demo.answer}</p>
      </motion.div>
    </DemoShell>
  );
}

function ChatbotDemo({ demo }: DemoProps) {
  return (
    <DemoShell>
      <div className="space-y-3">
        {demo.messages?.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.25, ease: motionEase }}
            className={cn(
              "max-w-[90%] rounded-2xl px-4 py-3 text-sm",
              msg.role === "user"
                ? "ml-auto border border-border bg-foreground/5 text-foreground"
                : "border border-accent/20 bg-accent/5 text-accent-warm",
            )}
          >
            {msg.text}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex gap-1 px-2"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted" />
          ))}
        </motion.div>
      </div>
    </DemoShell>
  );
}

function TemplatesDemo({ demo }: DemoProps) {
  const templates = demo.templates ?? [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (templates.length === 0) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % templates.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [templates.length]);

  return (
    <DemoShell>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template, index) => (
          <motion.div
            key={template}
            animate={{
              scale: active === index ? 1.02 : 1,
              opacity: active === index ? 1 : 0.5,
            }}
            transition={{ duration: 0.35, ease: motionEase }}
            className={cn(
              "rounded-xl border p-4 text-center",
              active === index
                ? "border-accent/40 bg-accent/10"
                : "border-border bg-foreground/5",
            )}
          >
            <span className="font-display text-sm font-semibold text-foreground">
              {template}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: motionEase }}
        className="mt-4 space-y-2"
      >
        {demo.templateSections?.map((section, i) => (
          <div
            key={section}
            className="h-2 rounded-full bg-foreground/10"
            style={{ width: `${70 + i * 10}%` }}
          />
        ))}
      </motion.div>
    </DemoShell>
  );
}

function InsightsDemo({ demo }: DemoProps) {
  const bars = [40, 65, 45, 80, 55, 90, 70];

  return (
    <DemoShell>
      <div className="flex h-[200px] items-end gap-2 pb-2">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-t-md bg-gradient-to-t from-accent-dim to-accent"
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: index * 0.08, duration: 0.6, ease: motionEase }}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] text-muted">
        {demo.weekDays?.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </DemoShell>
  );
}

const DEMO_MAP: Record<
  string,
  React.ComponentType<DemoProps>
> = {
  "smart-meeting": SmartMeetingDemo,
  "auto-join": AutoJoinDemo,
  diarization: DiarizationDemo,
  "segment-audio": SegmentAudioDemo,
  accuracy: AccuracyDemo,
  "voice-assistant": VoiceAssistantDemo,
  chatbot: ChatbotDemo,
  templates: TemplatesDemo,
  insights: InsightsDemo,
};

export function FeatureDemo({
  feature,
  demo,
  labels,
}: {
  feature: FeatureItem;
  demo: FeatureDemoContent;
  labels: { bot: string; question: string; answer: string };
}) {
  const Demo = DEMO_MAP[feature.id];
  if (!Demo) return null;

  return (
    <motion.div
      key={feature.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: motionEase }}
      className="h-full"
    >
      <Demo demo={demo} labels={labels} />
    </motion.div>
  );
}
