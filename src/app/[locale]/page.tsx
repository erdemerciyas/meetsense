import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { ShowcasePage } from "@/components/ShowcasePage";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  const content = getContent(localeParam);
  const alternateLocale = localeParam === "tr" ? "en" : "tr";

  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.ogDescription,
      locale: localeParam === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `/${localeParam}/`,
      languages: {
        tr: "/tr/",
        en: "/en/",
        "x-default": "/tr/",
        [alternateLocale]: `/${alternateLocale}/`,
      },
    },
  };
}

export default async function LocalePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const content = getContent(localeParam as Locale);
  return <ShowcasePage locale={localeParam as Locale} content={content} />;
}
