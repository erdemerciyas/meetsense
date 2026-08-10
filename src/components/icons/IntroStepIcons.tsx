"use client";

import type { ComponentType } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

type IntroStepId = "join" | "record" | "transcribe" | "analyze";

type IconProps = {
  className?: string;
  uid: string;
};

function JoinIcon({ className, uid }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-join-bg`} x1="12" y1="8" x2="84" y2="88">
          <stop stopColor="#8b8cc7" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5b5fc7" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={`${uid}-join-accent`} x1="24" y1="20" x2="72" y2="76">
          <stop stopColor="#8b8cc7" />
          <stop offset="1" stopColor="#5b5fc7" />
        </linearGradient>
        <radialGradient
          id={`${uid}-join-glow`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(68 28) rotate(90) scale(24)"
        >
          <stop stopColor="#5b5fc7" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b5fc7" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="68" cy="28" r="24" fill={`url(#${uid}-join-glow)`} />
      <rect
        x="18"
        y="16"
        width="52"
        height="56"
        rx="10"
        fill={`url(#${uid}-join-bg)`}
        stroke={`url(#${uid}-join-accent)`}
        strokeWidth="1.5"
        strokeOpacity="0.55"
      />
      <path
        d="M30 30h36M30 40h24M30 50h28"
        stroke="var(--icon-line)"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="26"
        y="58"
        width="14"
        height="10"
        rx="2.5"
        fill="#5b5fc7"
        fillOpacity="0.85"
      />
      <rect
        x="44"
        y="58"
        width="14"
        height="10"
        rx="2.5"
        fill="#8b8cc7"
        fillOpacity="0.35"
        stroke="#8b8cc7"
        strokeOpacity="0.5"
        strokeWidth="1"
      />

      <g transform="translate(58 44)">
        <rect
          x="0"
          y="8"
          width="28"
          height="20"
          rx="6"
          fill="var(--icon-chrome)"
          stroke={`url(#${uid}-join-accent)`}
          strokeWidth="1.5"
        />
        <path
          d="M14 4.5L18.5 8H9.5L14 4.5Z"
          fill="var(--icon-chrome)"
          stroke={`url(#${uid}-join-accent)`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="16" r="2.5" fill="#8b8cc7" />
        <circle cx="18" cy="16" r="2.5" fill="#5b5fc7" />
        <path
          d="M8 22h12"
          stroke="var(--icon-line)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M52 52c8-2 14 2 18 10"
        stroke="#8b8cc7"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="3 3"
        opacity="0.8"
      />
      <circle cx="72" cy="24" r="5" fill="#5b5fc7">
        <animate
          attributeName="opacity"
          values="1;0.45;1"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
      <path
        d="M72 20v-4M72 32v-2M68 24h-3M76 24h3"
        stroke="#8b8cc7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function RecordIcon({ className, uid }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-rec-ring`} x1="16" y1="16" x2="80" y2="80">
          <stop stopColor="#8b8cc7" stopOpacity="0.7" />
          <stop offset="1" stopColor="#4f52b2" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${uid}-rec-wave`} x1="28" y1="44" x2="68" y2="44">
          <stop stopColor="#8b8cc7" />
          <stop offset="0.5" stopColor="#5b5fc7" />
          <stop offset="1" stopColor="#4f52b2" />
        </linearGradient>
        <radialGradient
          id={`${uid}-rec-pulse`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(48 48) rotate(90) scale(34)"
        >
          <stop stopColor="#5b5fc7" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5b5fc7" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="48" cy="48" r="34" fill={`url(#${uid}-rec-pulse)`} />
      <circle
        cx="48"
        cy="48"
        r="30"
        stroke={`url(#${uid}-rec-ring)`}
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.75"
      />
      <circle
        cx="48"
        cy="48"
        r="22"
        stroke="#5b5fc7"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      <rect x="42" y="24" width="12" height="22" rx="6" fill="var(--icon-chrome)" stroke="#5b5fc7" strokeWidth="1.5" />
      <path
        d="M36 46c0 6.627 5.373 12 12 12s12-5.373 12-12"
        stroke="#8b8cc7"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M48 58v8" stroke="#5b5fc7" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M40 66h16" stroke="#5b5fc7" strokeOpacity="0.55" strokeWidth="1.75" strokeLinecap="round" />

      <g stroke={`url(#${uid}-rec-wave)`} strokeWidth="3" strokeLinecap="round">
        <path d="M24 48V42" />
        <path d="M30 48V36" />
        <path d="M66 48V34" />
        <path d="M72 48V40" />
      </g>

      <circle cx="48" cy="34" r="4.5" fill="#ef4444">
        <animate
          attributeName="opacity"
          values="1;0.35;1"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="48" cy="34" r="8" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="1">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="1.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.35;0;0.35"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function TranscribeIcon({ className, uid }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-tx-doc`} x1="20" y1="18" x2="76" y2="78">
          <stop stopColor="#8b8cc7" stopOpacity="0.22" />
          <stop offset="1" stopColor="#5b5fc7" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`${uid}-tx-a`} x1="18" y1="24" x2="38" y2="44">
          <stop stopColor="#8b8cc7" />
          <stop offset="1" stopColor="#5b5fc7" />
        </linearGradient>
        <linearGradient id={`${uid}-tx-b`} x1="58" y1="52" x2="78" y2="72">
          <stop stopColor="#4f52b2" />
          <stop offset="1" stopColor="#5b5fc7" />
        </linearGradient>
      </defs>

      <rect
        x="22"
        y="16"
        width="52"
        height="64"
        rx="10"
        fill={`url(#${uid}-tx-doc)`}
        stroke="#5b5fc7"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M34 32h28M34 42h22M34 52h26M34 62h18"
        stroke="var(--icon-line)"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M34 32h20"
        stroke="#8b8cc7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M34 42h14"
        stroke="#5b5fc7"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      <g>
        <circle cx="28" cy="26" r="10" fill="var(--icon-chrome)" stroke={`url(#${uid}-tx-a)`} strokeWidth="1.5" />
        <text
          x="28"
          y="30"
          textAnchor="middle"
          fill="#8b8cc7"
          fontSize="9"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          A
        </text>
        <path
          d="M18 50c6-8 14-10 20-6"
          stroke={`url(#${uid}-tx-a)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <g>
        <circle cx="68" cy="70" r="10" fill="var(--icon-chrome)" stroke={`url(#${uid}-tx-b)`} strokeWidth="1.5" />
        <text
          x="68"
          y="74"
          textAnchor="middle"
          fill="#5b5fc7"
          fontSize="9"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          B
        </text>
        <path
          d="M78 46c-6 8-14 10-20 6"
          stroke={`url(#${uid}-tx-b)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <g stroke="#8b8cc7" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <path d="M12 58V50" />
        <path d="M16 58V44" />
        <path d="M20 58V52" />
      </g>
      <g stroke="#5b5fc7" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <path d="M76 30V24" />
        <path d="M80 30V18" />
        <path d="M84 30V22" />
      </g>
    </svg>
  );
}

function AnalyzeIcon({ className, uid }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-an-core`} x1="30" y1="22" x2="66" y2="74">
          <stop stopColor="#8b8cc7" />
          <stop offset="1" stopColor="#4f52b2" />
        </linearGradient>
        <linearGradient id={`${uid}-an-panel`} x1="14" y1="54" x2="44" y2="84">
          <stop stopColor="#8b8cc7" stopOpacity="0.18" />
          <stop offset="1" stopColor="#5b5fc7" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${uid}-an-bars`} x1="58" y1="52" x2="84" y2="80">
          <stop stopColor="#8b8cc7" />
          <stop offset="1" stopColor="#5b5fc7" />
        </linearGradient>
      </defs>

      <path
        d="M48 18l4.8 9.7 10.7 1.6-7.8 7.6 1.8 10.7L48 43.5l-9.5 5.1 1.8-10.7-7.8-7.6 10.7-1.6L48 18Z"
        fill={`url(#${uid}-an-core)`}
        fillOpacity="0.9"
      />
      <circle cx="48" cy="34" r="10" fill="var(--icon-chrome)" stroke="#8b8cc7" strokeOpacity="0.45" strokeWidth="1" />
      <path
        d="M48 28v6M45 31h6"
        stroke="#8b8cc7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <rect
        x="14"
        y="54"
        width="30"
        height="28"
        rx="8"
        fill={`url(#${uid}-an-panel)`}
        stroke="#5b5fc7"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M22 64h18M22 70h12"
        stroke="var(--icon-line)"
        strokeOpacity="0.3"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M20 62l3 3 7-7"
        stroke="#8b8cc7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect
        x="54"
        y="50"
        width="30"
        height="32"
        rx="8"
        fill="var(--icon-chrome)"
        stroke="#5b5fc7"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <g fill={`url(#${uid}-an-bars)`}>
        <rect x="62" y="66" width="5" height="10" rx="1.5" />
        <rect x="70" y="60" width="5" height="16" rx="1.5" />
        <rect x="78" y="54" width="5" height="22" rx="1.5" opacity="0.85" />
      </g>
      <path
        d="M60 58c6-4 12-2 16 4"
        stroke="#8b8cc7"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      <circle cx="24" cy="24" r="2" fill="#8b8cc7" opacity="0.8" />
      <circle cx="78" cy="22" r="2" fill="#5b5fc7" opacity="0.7" />
      <circle cx="82" cy="40" r="1.5" fill="#8b8cc7" opacity="0.55" />
    </svg>
  );
}

const STEP_ICONS: Record<IntroStepId, ComponentType<IconProps>> = {
  join: JoinIcon,
  record: RecordIcon,
  transcribe: TranscribeIcon,
  analyze: AnalyzeIcon,
};

export function IntroStepIcon({
  stepId,
  className,
}: {
  stepId: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const Icon = STEP_ICONS[stepId as IntroStepId] ?? JoinIcon;

  return <Icon uid={uid} className={className} />;
}

export function IntroStepIconBadge({
  stepId,
  index,
  className,
  size = "default",
}: {
  stepId: string;
  index: number;
  className?: string;
  size?: "default" | "pinned" | "large";
}) {
  const isLarge = size === "large";
  const isPinned = size === "pinned";

  return (
    <div
      className={cn(
        "intro-icon-badge group/icon relative flex shrink-0 items-center justify-center",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover/icon:opacity-100"
        style={{ borderRadius: isLarge ? "4rem" : isPinned ? "2.25rem" : "1.75rem" }}
        aria-hidden
      />
      <div
        className={cn(
          "relative flex items-center justify-center border border-accent/25 bg-gradient-to-br from-accent/15 via-surface-elevated to-surface-elevated shadow-[0_0_40px_var(--accent-glow)] transition-all duration-500 group-hover/icon:border-accent/45 group-hover/icon:shadow-[0_0_48px_var(--accent-glow)]",
          isLarge
            ? "h-[15rem] w-[15rem] rounded-[4rem] xl:h-[18rem] xl:w-[18rem] xl:rounded-[4.5rem]"
            : isPinned
              ? "h-[5.25rem] w-[5.25rem] rounded-[1.5rem] lg:h-[5.75rem] lg:w-[5.75rem] xl:h-[7rem] xl:w-[7rem] xl:rounded-[1.85rem]"
              : "h-[5.5rem] w-[5.5rem] rounded-[1.75rem] group-hover/icon:-translate-y-0.5 xl:h-[6.5rem] xl:w-[6.5rem] xl:rounded-[2rem]",
        )}
      >
        <IntroStepIcon
          stepId={stepId}
          className={cn(
            "transition-transform duration-500 group-hover/icon:scale-105",
            isLarge
              ? "h-[10.5rem] w-[10.5rem] xl:h-[13rem] xl:w-[13rem]"
              : isPinned
                ? "h-[3.4rem] w-[3.4rem] lg:h-[3.75rem] lg:w-[3.75rem] xl:h-[4.6rem] xl:w-[4.6rem]"
                : "h-[3.75rem] w-[3.75rem] xl:h-[4.5rem] xl:w-[4.5rem]",
          )}
        />
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-2xl border border-accent/35 bg-background/90 font-display font-semibold text-accent shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm",
            isLarge
              ? "-bottom-4 -right-4 h-[4.5rem] w-[4.5rem] text-xl xl:-bottom-5 xl:-right-5 xl:h-20 xl:w-20 xl:text-2xl"
              : isPinned
                ? "-bottom-1.5 -right-1.5 h-7 w-7 text-[10px] lg:h-8 lg:w-8 lg:text-xs xl:h-9 xl:w-9 xl:text-sm"
                : "-bottom-2 -right-2 h-8 w-8 text-xs",
          )}
        >
          0{index + 1}
        </span>
      </div>
    </div>
  );
}
