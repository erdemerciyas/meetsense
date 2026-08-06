"use client";

import { FeaturesExplorer } from "@/components/sections/FeaturesExplorer";
import type { SiteContent } from "@/content/types";

export function FeaturesSection({
  content,
}: {
  content: SiteContent["features"];
}) {
  return <FeaturesExplorer content={content} />;
}
