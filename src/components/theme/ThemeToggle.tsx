"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { springConfig } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeToggleProps = {
  lightLabel: string;
  darkLabel: string;
  className?: string;
};

export function ThemeToggle({
  lightLabel,
  darkLabel,
  className,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = theme === "dark";
  const label = isDark ? lightLabel : darkLabel;

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      whileHover={reducedMotion ? undefined : { scale: 1.04 }}
      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      transition={springConfig.gentle}
    >
      <span className="relative block h-4 w-4" aria-hidden>
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0 h-4 w-4"
          initial={false}
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.6 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M12 3v1.5M12 19.5V21M4.5 12H3M21 12h-1.5M6.2 6.2l1.1 1.1M16.7 16.7l1.1 1.1M17.8 6.2l-1.1 1.1M7.3 16.7l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0 h-4 w-4"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.6 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </motion.svg>
      </span>
    </motion.button>
  );
}
