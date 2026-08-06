/** Shared motion tokens — use across Framer Motion and GSAP where possible */
export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionDuration = {
  fast: 0.3,
  normal: 0.45,
  slow: 0.6,
} as const;

export const springConfig = {
  gentle: { type: "spring" as const, stiffness: 300, damping: 30 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 32 },
  bouncy: { type: "spring" as const, stiffness: 260, damping: 20 },
};

export const revealVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const revealStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const revealItemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: motionDuration.slow, ease: motionEase },
  },
};

export const revealTransition = {
  duration: motionDuration.slow,
  ease: motionEase,
};
