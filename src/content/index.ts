import type { Locale } from "@/lib/i18n";
import { enContent } from "./en";
import { trContent } from "./tr";
import type { SiteContent } from "./types";

const contentMap: Record<Locale, SiteContent> = {
  tr: trContent,
  en: enContent,
};

export function getContent(locale: Locale): SiteContent {
  return contentMap[locale];
}

export { trContent, enContent };
