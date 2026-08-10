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
        "inline-flex items-center rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors duration-200 hover:border-accent/40 hover:bg-accent/10",
        className,
      )}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.span>
  );
}
