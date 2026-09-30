import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Life } from "@/components/sections/Life";
import { Templates } from "@/components/sections/Templates";
import { Enterprise } from "@/components/sections/Enterprise";
import { Demo } from "@/components/sections/Demo";
import { PointerLean } from "@/components/ui/PointerLean";
import { Intro } from "@/components/ui/Intro";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getContent(locale);

  return (
    <>
      <Intro />
      <a
        href="#main"
        className="sr-only z-50 bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {c.ui.skip}
      </a>
      <div id="scroll-sentinel" aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-2 w-px" />
      <PointerLean />
      <Navbar c={c} />
      <main id="main" className="overflow-x-clip">
        <Hero c={c} />
        <Life c={c} />
        <Templates c={c} />
        <Enterprise c={c} />
        <Demo c={c} />
      </main>
      <Footer c={c} />
    </>
  );
}
