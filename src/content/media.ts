export const MEETSENSE_DEMO_VIDEO = "/videos/vid1.mp4";
export const MEETSENSE_HERO_VIDEO = "/videos/vid2.mp4";

export type MediaSlot = {
  id: string;
  poster?: string;
  src?: string;
  fallback: "animated-mockup" | "waveform" | "gradient";
  aspectRatio?: string;
  autoPlay?: boolean;
  fullScreen?: boolean;
};

export const mediaSlots: Record<string, MediaSlot> = {
  hero: {
    id: "hero",
    src: MEETSENSE_HERO_VIDEO,
    fallback: "waveform",
    autoPlay: true,
    fullScreen: true,
  },
  introJoin: {
    id: "intro-join",
    src: MEETSENSE_DEMO_VIDEO,
    fallback: "animated-mockup",
    aspectRatio: "4/3",
  },
  introRecord: {
    id: "intro-record",
    src: MEETSENSE_DEMO_VIDEO,
    fallback: "animated-mockup",
    aspectRatio: "4/3",
  },
  introTranscribe: {
    id: "intro-transcribe",
    src: MEETSENSE_DEMO_VIDEO,
    fallback: "animated-mockup",
    aspectRatio: "4/3",
  },
  introAnalyze: {
    id: "intro-analyze",
    src: MEETSENSE_DEMO_VIDEO,
    fallback: "animated-mockup",
    aspectRatio: "4/3",
  },
  showcase: {
    id: "showcase",
    src: MEETSENSE_DEMO_VIDEO,
    fallback: "gradient",
    aspectRatio: "21/9",
  },
  featurePreview: {
    id: "feature-preview",
    src: MEETSENSE_DEMO_VIDEO,
    fallback: "animated-mockup",
    aspectRatio: "16/9",
  },
};

export function getMediaSlot(id: keyof typeof mediaSlots): MediaSlot {
  return mediaSlots[id];
}
