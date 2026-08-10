"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { CTASection } from "@/components/sections/CTASection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { LifecycleSection } from "@/components/sections/LifecycleSection";
import { TranscriptSection } from "@/components/sections/TranscriptSection";
import { UseCasesSection } from "@/components/sections/UseCasesSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { VideoShowcaseSection } from "@/components/sections/VideoShowcaseSection";
import { LangSetter } from "@/components/layout/LangSetter";
import type { SiteContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";

type ShowcasePageProps = {
  locale: Locale;
  content: SiteContent;
};

export function ShowcasePage({ locale, content }: ShowcasePageProps) {
  return (
    <SmoothScrollProvider>
      <LangSetter locale={locale} />
      <a href="#main-content" className="skip-link">
        {content.ui.skipToContent}
      </a>
      <Navbar
        locale={locale}
        nav={content.nav}
        brand={content.footer.brand}
        ctaLabel={content.hero.ctaPrimary}
        openMenuLabel={content.ui.openMenu}
        closeMenuLabel={content.ui.closeMenu}
        themeToLightLabel={content.ui.themeToLight}
        themeToDarkLabel={content.ui.themeToDark}
      />
      <main id="main-content">
        <HeroSection content={content.hero} />
        <IntroSection content={content.intro} />
        <TranscriptSection content={content.transcript} />
        <LifecycleSection content={content.lifecycle} />
        <FeaturesSection content={content.features} />
        <UseCasesSection content={content.useCases} />
        <VideoShowcaseSection content={content.videoShowcase} locale={locale} />
        <ValueSection content={content.value} />
        <CTASection content={content.cta} />
      </main>
      <Footer content={content.footer} />
    </SmoothScrollProvider>
  );
}
