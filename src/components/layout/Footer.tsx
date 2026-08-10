"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/content/types";
import { motionDuration, motionEase, revealItemVariants, revealStagger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Footer({ content }: { content: SiteContent["footer"] }) {
  const reducedMotion = useReducedMotion();
  const year = new Date().getFullYear();

  if (reducedMotion) {
    return (
      <footer className="relative border-t border-border bg-background py-10">
        <div className="section-divider absolute inset-x-0 top-0" aria-hidden />
        <div className="section-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-foreground">
              {content.brand}
            </p>
            <p className="mt-1 text-sm text-muted">{content.tagline}</p>
          </div>
          <p className="text-sm text-muted/70">
            © {year} {content.brand}. {content.rights}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative border-t border-border bg-background py-12 md:py-14">
      <div className="section-divider absolute inset-x-0 top-0" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[min(100%,480px)] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <motion.div
        className="section-shell relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={revealStagger}
      >
        <motion.div variants={revealItemVariants} transition={{ duration: motionDuration.normal, ease: motionEase }}>
          <p className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {content.brand.replace("Sense", "")}
            <span className="text-gradient">Sense</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {content.tagline}
          </p>
        </motion.div>

        <motion.p
          variants={revealItemVariants}
          transition={{ duration: motionDuration.normal, ease: motionEase, delay: 0.1 }}
          className="text-sm text-muted/70"
        >
          © {year} {content.brand}. {content.rights}
        </motion.p>
      </motion.div>
    </footer>
  );
}
