"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  scrollToElement,
  startSmoothScroll,
  stopSmoothScroll,
} from "@/lib/scroll";
import type { Locale } from "@/lib/i18n";
import { getLocalePath } from "@/lib/i18n";
import type { NavItem } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { springConfig } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type NavbarProps = {
  locale: Locale;
  nav: NavItem[];
  brand: string;
  ctaLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
};

function NavItemLink({
  item,
  active,
  onClick,
  layoutId,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
  layoutId?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <a
      href={`#${item.id}`}
      onClick={onClick}
      className="group relative rounded-full px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {active && layoutId && !reducedMotion ? (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          transition={springConfig.snappy}
        />
      ) : active ? (
        <span className="absolute inset-0 rounded-full border border-white/10 bg-white/10" />
      ) : null}
      <span
        className={cn(
          "relative z-10 transition-colors duration-300",
          active ? "text-white" : "text-muted group-hover:text-white",
        )}
      >
        {item.label}
      </span>
    </a>
  );
}

export function Navbar({
  locale,
  nav,
  brand,
  ctaLabel,
  openMenuLabel,
  closeMenuLabel,
}: NavbarProps) {
  const [active, setActive] = useState(nav[0]?.id ?? "");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.1, 0.4, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [nav]);

  useEffect(() => {
    if (menuOpen) {
      stopSmoothScroll();
      return;
    }
    startSmoothScroll();
  }, [menuOpen]);

  const otherLocale = locale === "tr" ? "en" : "tr";
  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        scrolled || menuOpen
          ? "border-b border-white/10 bg-background/75 backdrop-blur-2xl backdrop-saturate-150"
          : "bg-transparent",
      )}
      initial={false}
      animate={{
        y: 0,
        boxShadow: scrolled
          ? "0 12px 40px -20px rgba(0, 0, 0, 0.45)"
          : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-shell flex h-16 items-center justify-between md:h-20">
        <motion.a
          href={`/${locale}/`}
          className="font-display text-lg font-semibold tracking-tight text-white"
          aria-label={brand}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          transition={springConfig.gentle}
        >
          {brand.replace("Sense", "")}
          <span className="text-accent">Sense</span>
        </motion.a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <NavItemLink
              key={item.id}
              item={item}
              active={active === item.id}
              layoutId="desktop-nav-pill"
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.a
            href={getLocalePath(otherLocale)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:border-accent/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            whileHover={reducedMotion ? undefined : { scale: 1.04 }}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            transition={springConfig.gentle}
          >
            {otherLocale}
          </motion.a>

          <Button href="#cta" variant="primary" className="hidden sm:inline-flex">
            {ctaLabel}
          </Button>

          <button
            type="button"
            className="control-btn-neutral inline-flex h-10 w-10 items-center justify-center p-0 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? closeMenuLabel : openMenuLabel}
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-300",
                  menuOpen ? "top-[6px] rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[6px] block h-0.5 w-4 bg-foreground transition-all duration-300",
                  menuOpen ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-300",
                  menuOpen ? "top-[6px] -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="border-t border-white/10 bg-background/95 backdrop-blur-2xl lg:hidden"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="section-shell flex flex-col gap-1 py-4" aria-label="Mobile">
              {nav.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <NavItemLink
                    item={item}
                    active={active === item.id}
                    onClick={closeMenu}
                  />
                </motion.div>
              ))}
              <Button
                variant="primary"
                className="mt-2 w-full sm:hidden"
                onClick={() => {
                  closeMenu();
                  scrollToElement("#cta");
                }}
              >
                {ctaLabel}
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
