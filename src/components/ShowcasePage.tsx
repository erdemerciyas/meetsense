"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { TeamsShell } from "@/components/layout/TeamsShell";
import { LangSetter } from "@/components/layout/LangSetter";
import { CTASection } from "@/components/sections/CTASection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { LifecycleSection } from "@/components/sections/LifecycleSection";
import { TranscriptSection } from "@/components/sections/TranscriptSection";
import { UseCasesSection } from "@/components/sections/UseCasesSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { VideoShowcaseSection } from "@/components/sections/VideoShowcaseSection";
import type { SiteContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";

type ShowcasePageProps = {
  locale: Locale;
  content: SiteContent;
};

export function ShowcasePage({ locale, content }: ShowcasePageProps) {
  const [activeSection, setActiveSection] = useState(content.nav[0]?.id ?? "intro");

  useEffect(() => {
    const scrollRoot = document.querySelector(".teams-content-area");
    const sections = content.nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      {
        root: scrollRoot,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [content.nav]);

  return (
    <>
      <LangSetter locale={locale} />
      <a href="#main-content" className="skip-link">
        {content.ui.skipToContent}
      </a>
      <TeamsShell
        locale={locale}
        content={content}
        nav={content.nav}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        <main id="main-content">
          <HeroSection content={content.hero} teamsShell={content.teamsShell} />
          <IntroSection content={content.intro} />
          <TranscriptSection content={content.transcript} />
          <LifecycleSection content={content.lifecycle} />
          <FeaturesSection content={content.features} />
          <UseCasesSection content={content.useCases} />
          <VideoShowcaseSection content={content.videoShowcase} locale={locale} />
          <ValueSection content={content.value} />
          <CTASection content={content.cta} />
          <Footer content={content.footer} />
        </main>
      </TeamsShell>
    </>
  );
}
