"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { getLocalePath } from "@/lib/i18n";
import type { NavItem, SiteContent } from "@/content/types";
import {
  TeamsActivityIcon,
  TeamsAppsIcon,
  TeamsCalendarIcon,
  TeamsCallsIcon,
  TeamsChatIcon,
  TeamsChevronDownIcon,
  TeamsFilesIcon,
  TeamsMeetSenseIcon,
  TeamsMoreIcon,
  TeamsPanelIcon,
  TeamsSearchIcon,
  TeamsTeamsIcon,
} from "@/components/icons/TeamsIcons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TeamsScrollProvider } from "@/components/layout/TeamsScrollProvider";
import { scrollToSection } from "@/lib/teamsScroll";

type TeamsShellProps = {
  locale: Locale;
  content: SiteContent;
  children: React.ReactNode;
  nav: NavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
};

const railItems = [
  { id: "activity", Icon: TeamsActivityIcon, active: false },
  { id: "chat", Icon: TeamsChatIcon, active: false },
  { id: "teams", Icon: TeamsTeamsIcon, active: false },
  { id: "calendar", Icon: TeamsCalendarIcon, active: false },
  { id: "calls", Icon: TeamsCallsIcon, active: false },
  { id: "files", Icon: TeamsFilesIcon, active: false },
  { id: "apps", Icon: TeamsAppsIcon, active: true },
] as const;

export function TeamsShell({
  locale,
  content,
  children,
  nav,
  activeSection,
  onSectionChange,
}: TeamsShellProps) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const shell = content.teamsShell;
  const otherLocale = locale === "tr" ? "en" : "tr";

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileNavOpen]);

  return (
    <div className="teams-shell flex h-[100dvh] flex-col overflow-hidden bg-teams-bg">
      {/* Title bar */}
      <header className="teams-title-bar flex h-12 shrink-0 items-center gap-3 border-b border-teams-border px-3 md:px-4">
        <div className="flex items-center gap-2">
          <span className="hidden h-3 w-3 rounded-full bg-[#ff5f57] sm:inline-block" aria-hidden />
          <span className="hidden h-3 w-3 rounded-full bg-[#febc2e] sm:inline-block" aria-hidden />
          <span className="hidden h-3 w-3 rounded-full bg-[#28c840] sm:inline-block" aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <TeamsMeetSenseIcon className="h-6 w-6 shrink-0" />
            <span className="truncate text-sm font-semibold text-teams-text">
              Microsoft Teams
            </span>
            <span className="hidden text-teams-muted sm:inline">|</span>
            <span className="hidden truncate text-sm text-teams-text-secondary sm:inline">
              {shell.meetingTitle}
            </span>
          </div>

          <div className="teams-search mx-auto hidden max-w-md flex-1 items-center gap-2 rounded-md border border-teams-border bg-teams-surface px-3 py-1.5 md:flex">
            <TeamsSearchIcon className="text-teams-muted" />
            <span className="text-sm text-teams-muted">{shell.searchPlaceholder}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={getLocalePath(otherLocale)}
            className="teams-icon-btn hidden text-xs font-medium uppercase sm:inline-flex"
            aria-label={shell.switchLanguage}
          >
            {otherLocale}
          </a>
          <button
            type="button"
            className="teams-icon-btn"
            onClick={() => setPanelOpen((v) => !v)}
            aria-label={panelOpen ? shell.hidePanel : shell.showPanel}
            aria-pressed={panelOpen}
          >
            <TeamsPanelIcon />
          </button>
          <button type="button" className="teams-icon-btn" aria-label={shell.moreOptions}>
            <TeamsMoreIcon />
          </button>
          <div
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-teams-accent text-xs font-semibold text-white"
            aria-hidden
          >
            {shell.userInitials}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left rail */}
        <nav
          className="teams-rail hidden w-[68px] shrink-0 flex-col items-center gap-1 border-r border-teams-border bg-teams-rail py-3 md:flex"
          aria-label={shell.appNavigation}
        >
          {railItems.map(({ id, Icon, active }) => (
            <button
              key={id}
              type="button"
              className={cn(
                "teams-rail-btn",
                active && "teams-rail-btn--active",
              )}
              aria-label={shell.railLabels[id]}
              aria-current={active ? "page" : undefined}
            >
              <Icon />
              {active ? (
                <span className="absolute -right-px top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-l bg-teams-accent" />
              ) : null}
            </button>
          ))}
        </nav>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Channel / app header */}
          <div className="teams-channel-header shrink-0 border-b border-teams-border bg-teams-canvas">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <TeamsTeamsIcon className="shrink-0 text-teams-accent" />
                <button
                  type="button"
                  className="flex min-w-0 items-center gap-1 rounded px-1 py-0.5 text-sm font-semibold text-teams-text hover:bg-teams-surface-hover"
                >
                  <span className="truncate">{shell.teamName}</span>
                  <TeamsChevronDownIcon className="shrink-0 text-teams-muted" />
                </button>
                <span className="text-teams-muted">/</span>
                <span className="truncate text-sm text-teams-text-secondary">
                  {shell.channelName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="teams-live-badge hidden sm:inline-flex">
                  <span className="teams-live-dot" />
                  {shell.liveMeeting}
                </span>
                <button
                  type="button"
                  className="teams-icon-btn md:hidden"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label={content.ui.openMenu}
                >
                  <TeamsMoreIcon />
                </button>
              </div>
            </div>

            {/* App tabs */}
            <div className="teams-tabs flex items-end gap-0 overflow-x-auto px-2 scrollbar-none">
              <div className="teams-tab teams-tab--active shrink-0">
                <TeamsMeetSenseIcon className="h-4 w-4" />
                <span>{shell.appName}</span>
              </div>
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onSectionChange(item.id);
                    scrollToSection(`#${item.id}`);
                  }}
                  className={cn(
                    "teams-tab shrink-0",
                    activeSection === item.id && "teams-tab--section-active",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="teams-content-area min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <TeamsScrollProvider>{children}</TeamsScrollProvider>
          </div>
        </div>

        {/* Right panel — meeting participants */}
        <AnimatePresence initial={false}>
          {panelOpen ? (
            <motion.aside
              className="teams-panel hidden w-[280px] shrink-0 flex-col border-l border-teams-border bg-teams-panel lg:flex"
              initial={reducedMotion ? false : { width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={reducedMotion ? undefined : { width: 0, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
            >
              <div className="border-b border-teams-border px-4 py-3">
                <h2 className="text-sm font-semibold text-teams-text">
                  {shell.participantsTitle}
                </h2>
                <p className="mt-0.5 text-xs text-teams-muted">
                  {shell.participantsCount.replace(
                    "{count}",
                    String(shell.participants.length),
                  )}
                </p>
              </div>

              <ul className="flex-1 overflow-y-auto p-2">
                {shell.participants.map((participant) => (
                  <li
                    key={participant.id}
                    className={cn(
                      "teams-participant",
                      participant.isBot && "teams-participant--bot",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                        participant.isBot
                          ? "bg-teams-accent"
                          : "bg-teams-surface-hover",
                      )}
                    >
                      {participant.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-teams-text">
                        {participant.name}
                        {participant.isBot ? (
                          <span className="ml-1.5 rounded bg-teams-accent/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teams-accent-light">
                            {shell.botBadge}
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-teams-muted">
                        {participant.status}
                      </p>
                    </div>
                    {participant.isSpeaking ? (
                      <span className="teams-speaking-indicator" aria-label={shell.speaking} />
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="border-t border-teams-border p-3">
                <p className="text-xs font-medium text-teams-text-secondary">
                  {shell.integrationNote}
                </p>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.nav
              className="teams-mobile-drawer fixed inset-y-0 right-0 z-50 flex w-[min(100%,320px)] flex-col bg-teams-panel md:hidden"
              initial={reducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reducedMotion ? undefined : { x: "100%" }}
              transition={{ duration: 0.25 }}
              aria-label={shell.appNavigation}
            >
              <div className="flex items-center justify-between border-b border-teams-border px-4 py-3">
                <span className="text-sm font-semibold">{shell.appName}</span>
                <button
                  type="button"
                  className="teams-icon-btn"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label={content.ui.closeMenu}
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {nav.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onSectionChange(item.id);
                      scrollToSection(`#${item.id}`);
                      setMobileNavOpen(false);
                    }}
                    className={cn(
                      "teams-mobile-nav-item",
                      activeSection === item.id && "teams-mobile-nav-item--active",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
