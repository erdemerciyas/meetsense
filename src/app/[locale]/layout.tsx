import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import { getContent } from "@/content";
import { isLocale, locales } from "@/lib/i18n";
import { INTRO_HEAD_SCRIPT } from "@/lib/intro";
import "../globals.css";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
});

const mono = Martian_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getContent(locale);
  return {
    metadataBase: new URL("https://meetsense.bgts.ai"),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}/`,
      languages: { tr: "/tr/", en: "/en/" },
    },
    openGraph: { title: meta.title, description: meta.description, locale },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    // The head script marks <html> for the loader before first paint, hence the warning suppression
    <html lang={locale} className={`${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_HEAD_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
