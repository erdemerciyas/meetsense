"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  revealItemVariants,
  revealStagger,
  revealTransition,
} from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "left",
  className,
}: {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  const content = (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
        {label}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </>
  );

  if (reducedMotion) {
    return (
      <div
        className={cn(
          "max-w-3xl",
          align === "center" && "mx-auto text-center",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={revealStagger}
    >
      <motion.p
        variants={revealItemVariants}
        transition={revealTransition}
        className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent"
      >
        {label}
      </motion.p>
      <motion.h2
        variants={revealItemVariants}
        transition={revealTransition}
        className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={revealItemVariants}
          transition={revealTransition}
          className="mt-4 text-base leading-relaxed text-muted md:text-lg"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
