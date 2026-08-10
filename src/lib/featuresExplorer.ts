import type { FeatureCategory, FeatureItem } from "@/content/types";

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  "meeting",
  "transcription",
  "assistant",
  "analytics",
];

export const CATEGORY_ACCENTS: Record<
  FeatureCategory,
  { border: string; bg: string; text: string; glow: string }
> = {
  meeting: {
    border: "border-accent-warm/40",
    bg: "bg-accent-warm/10",
    text: "text-accent-warm",
    glow: "shadow-[0_0_32px_var(--accent-glow)]",
  },
  transcription: {
    border: "border-accent/40",
    bg: "bg-accent/10",
    text: "text-accent",
    glow: "shadow-[0_0_32px_var(--accent-glow)]",
  },
  assistant: {
    border: "border-accent-dim/40",
    bg: "bg-accent-dim/10",
    text: "text-accent-warm",
    glow: "shadow-[0_0_32px_var(--accent-glow)]",
  },
  analytics: {
    border: "border-muted/50",
    bg: "bg-muted/10",
    text: "text-foreground/85",
    glow: "shadow-[0_0_28px_color-mix(in_srgb,var(--muted)_30%,transparent)]",
  },
};

export function groupFeaturesByCategory(
  items: FeatureItem[],
): Record<FeatureCategory, FeatureItem[]> {
  const groups = Object.fromEntries(
    FEATURE_CATEGORIES.map((category) => [category, [] as FeatureItem[]]),
  ) as Record<FeatureCategory, FeatureItem[]>;

  for (const item of items) {
    groups[item.category].push(item);
  }

  return groups;
}

export function getFeatureIndex(items: FeatureItem[], id: string): number {
  return items.findIndex((item) => item.id === id);
}

export function getAdjacentFeature(
  items: FeatureItem[],
  currentId: string,
  direction: "prev" | "next",
): FeatureItem | null {
  const index = getFeatureIndex(items, currentId);
  if (index < 0) return items[0] ?? null;

  const nextIndex =
    direction === "next"
      ? (index + 1) % items.length
      : (index - 1 + items.length) % items.length;

  return items[nextIndex] ?? null;
}

export const FEATURE_ICONS: Record<string, string> = {
  "smart-meeting": "📅",
  "auto-join": "🤖",
  diarization: "👥",
  "segment-audio": "▶",
  accuracy: "✓",
  "voice-assistant": "🎙",
  chatbot: "💬",
  templates: "📋",
  insights: "📊",
};
