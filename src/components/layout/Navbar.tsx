"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/content/types";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function Navbar({ c }: { c: SiteContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const other = c.ui.langSwitch;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 bg-pass transition-[border-color] duration-200",
        "border-b",
        scrolled || open ? "border-rule" : "border-transparent",
      )}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" aria-label="MeetSense" className="rounded-[1px]">
          <Logo />
        </a>

        <nav aria-label="MeetSense" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {c.nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium text-ink-2 transition-colors duration-150 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`/${other.target}/`}
            hrefLang={other.target}
            lang={other.target}
            aria-label={other.label}
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[0.9375rem] font-semibold text-ink-2 uppercase transition-colors hover:text-ink"
          >
            {other.target}
          </a>
          <a href="#demo" className="btn btn-primary hidden sm:inline-flex">
            {c.nav.demo}
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.ui.menuClose : c.ui.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {open ? <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" /> : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="MeetSense" hidden={!open} className="border-t border-rule lg:hidden">
        <ul className="shell py-3">
          {c.nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-rule text-lg font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-4 pb-2 sm:hidden">
            <a href="#demo" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              {c.nav.demo}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
