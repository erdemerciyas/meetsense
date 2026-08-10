"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/cn";
import { springConfig } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  magnetic?: boolean;
  children: React.ReactNode;
};

type Ripple = { id: number; x: number; y: number };

function ButtonInner({
  children,
  className,
  variant = "primary",
  magnetic = true,
  onClick,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig.gentle);
  const springY = useSpring(y, springConfig.gentle);

  const onMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion || !magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX * 0.18);
    y.set(offsetY * 0.18);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!reducedMotion && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const ripple: Ripple = {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== ripple.id));
      }, 600);
    }
    onClick?.(event);
  };

  const styles = cn(
    "relative inline-flex w-full items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto",
    variant === "primary" &&
      "bg-accent text-on-accent hover:bg-accent-warm hover:shadow-[0_0_30px_var(--accent-glow)]",
    variant === "secondary" &&
      "border border-foreground/15 bg-foreground/5 text-foreground hover:border-accent/40 hover:bg-foreground/10",
    variant === "ghost" && "text-muted hover:text-foreground",
    className,
  );

  const button = (
    <motion.button
      ref={ref}
      className={styles}
      type="button"
      style={reducedMotion || !magnetic ? undefined : { x: springX, y: springY }}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {!reducedMotion
        ? ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="pointer-events-none absolute rounded-full bg-foreground/30 animate-ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 8,
                height: 8,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))
        : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );

  if (variant === "primary") {
    return (
      <span
        className={cn(
          "inline-flex w-full rounded-full bg-gradient-to-r from-accent via-accent-warm to-accent p-[1px] sm:w-auto",
          className?.includes("w-full") && "w-full",
        )}
      >
        {button}
      </span>
    );
  }

  return button;
}

export function Button({
  children,
  className,
  variant = "primary",
  href,
  magnetic,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <a href={href} className={cn("inline-flex", className)}>
        <ButtonInner variant={variant} magnetic={magnetic} {...props}>
          {children}
        </ButtonInner>
      </a>
    );
  }

  return (
    <ButtonInner
      variant={variant}
      magnetic={magnetic}
      className={className}
      {...props}
    >
      {children}
    </ButtonInner>
  );
}
