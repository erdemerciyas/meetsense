import { en } from "./en";
import { tr } from "./tr";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "./types";

const content: Record<Locale, SiteContent> = { tr, en };

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}
