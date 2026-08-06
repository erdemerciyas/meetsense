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
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teams-accent-light">
        {label}
      </p>
      <h2 className="text-2xl font-semibold leading-tight tracking-tight text-teams-text md:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-relaxed text-teams-text-secondary md:text-base">
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
        className="mb-2 text-xs font-semibold uppercase tracking-wider text-teams-accent-light"
      >
        {label}
      </motion.p>
      <motion.h2
        variants={revealItemVariants}
        transition={revealTransition}
        className="text-2xl font-semibold leading-tight tracking-tight text-teams-text md:text-3xl lg:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={revealItemVariants}
          transition={revealTransition}
          className="mt-3 text-sm leading-relaxed text-teams-text-secondary md:text-base"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
