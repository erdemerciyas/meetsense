import type { Locale } from "@/lib/i18n";

export type NavItem = {
  id: string;
  label: string;
};

export type StepItem = {
  id: string;
  title: string;
  description: string;
  highlights?: string[];
};

export type FeatureDemoContent = {
  events?: { time: string; title: string; hasBot?: boolean }[];
  buttonLabel?: string;
  statusLabel?: string;
  speakers?: { name: string; text: string }[];
  lines?: string[];
  auditLog?: { user: string; action: string; time: string }[];
  questionLabel?: string;
  answerLabel?: string;
  question?: string;
  answer?: string;
  messages?: { role: "user" | "bot"; text: string }[];
  templates?: string[];
  templateSections?: string[];
  weekDays?: string[];
};

export type FeatureCategory = "meeting" | "transcription" | "assistant" | "analytics";

export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
  category: FeatureCategory;
};

export type UseCaseItem = {
  id: string;
  title: string;
  problem: string;
  flow: string;
  result: string;
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
};

export type LifecycleNode = {
  id: string;
  title: string;
  description: string;
  group: "trigger" | "core" | "output" | "integration";
};

export type TranscriptLine = {
  speaker: string;
  speakerColor: string;
  text: string;
  highlight?: boolean;
  highlightLabel?: string;
};

export type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    badges: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  intro: {
    label: string;
    title: string;
    subtitle: string;
    steps: StepItem[];
  };
  transcript: {
    label: string;
    title: string;
    subtitle: string;
    lines: TranscriptLine[];
    actionTitle: string;
    actionItems: string[];
  };
  lifecycle: {
    label: string;
    title: string;
    subtitle: string;
    phases: string[];
    groupLabels: Record<LifecycleNode["group"], string>;
    nodes: LifecycleNode[];
    flowHint: string;
    playLabel: string;
    pauseLabel: string;
    stepLabel: string;
  };
  features: {
    label: string;
    title: string;
    subtitle: string;
    selectHint: string;
    highlightsLabel: string;
    prevLabel: string;
    nextLabel: string;
    categoryLabels: Record<FeatureCategory, string>;
    demoLabels: {
      bot: string;
      question: string;
      answer: string;
    };
    demos: Record<string, FeatureDemoContent>;
    items: FeatureItem[];
  };
  useCases: {
    label: string;
    title: string;
    subtitle: string;
    caseLabels: {
      problem: string;
      flow: string;
      result: string;
    };
    items: UseCaseItem[];
  };
  videoShowcase: {
    label: string;
    title: string;
    subtitle: string;
    stats: StatItem[];
  };
  value: {
    label: string;
    title: string;
    subtitle: string;
    items: ValueItem[];
  };
  ui: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    themeToLight: string;
    themeToDark: string;
  };
  cta: {
    title: string;
    subtitle: string;
    label: string;
    primary: string;
    secondary: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    submit: string;
    successMessage: string;
    footerNote: string;
  };
  footer: {
    brand: string;
    tagline: string;
    rights: string;
  };
};

export type ContentMap = Record<Locale, SiteContent>;
