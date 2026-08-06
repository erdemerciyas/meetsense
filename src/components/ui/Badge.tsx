"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      className={cn(
        "inline-flex items-center rounded border border-teams-border bg-teams-surface px-2.5 py-1 text-xs font-medium text-teams-text-secondary transition-colors duration-200 hover:border-teams-accent/40 hover:bg-teams-accent/10",
        className,
      )}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.span>
  );
}
