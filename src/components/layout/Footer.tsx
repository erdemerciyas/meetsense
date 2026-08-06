"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/content/types";
import { motionDuration, motionEase, revealItemVariants, revealStagger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TeamsMeetSenseIcon } from "@/components/icons/TeamsIcons";

export function Footer({ content }: { content: SiteContent["footer"] }) {
  const reducedMotion = useReducedMotion();
  const year = new Date().getFullYear();

  if (reducedMotion) {
    return (
      <footer className="border-t border-teams-border bg-teams-bg py-8">
        <div className="section-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <TeamsMeetSenseIcon className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold text-teams-text">
                {content.brand}
              </p>
              <p className="text-xs text-teams-muted">{content.tagline}</p>
            </div>
          </div>
          <p className="text-xs text-teams-muted">
            © {year} {content.brand}. {content.rights}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-teams-border bg-teams-bg py-10">
      <motion.div
        className="section-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={revealStagger}
      >
        <motion.div
          variants={revealItemVariants}
          transition={{ duration: motionDuration.normal, ease: motionEase }}
          className="flex items-center gap-3"
        >
          <TeamsMeetSenseIcon className="h-6 w-6" />
          <div>
            <p className="text-lg font-semibold text-teams-text">
              {content.brand}
            </p>
            <p className="mt-0.5 text-sm text-teams-muted">{content.tagline}</p>
          </div>
        </motion.div>

        <motion.p
          variants={revealItemVariants}
          transition={{ duration: motionDuration.normal, ease: motionEase, delay: 0.1 }}
          className="text-xs text-teams-muted"
        >
          © {year} {content.brand}. {content.rights}
        </motion.p>
      </motion.div>
    </footer>
  );
}
