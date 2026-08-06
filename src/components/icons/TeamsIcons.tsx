import { cn } from "@/lib/cn";

type IconProps = { className?: string };

export function TeamsActivityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export function TeamsChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v9A2.5 2.5 0 0 1 17.5 16H9.6l-3.7 2.8c-.5.4-1.2 0-.6-.8L7 16H6.5A2.5 2.5 0 0 1 4 13.5v-9Z" />
    </svg>
  );
}

export function TeamsTeamsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M17.5 4A3.5 3.5 0 0 1 21 7.5V11h-3.5A3.5 3.5 0 0 1 14 7.5 3.5 3.5 0 0 1 17.5 4ZM11 7.5A4.5 4.5 0 1 0 2 7.5 4.5 4.5 0 0 0 11 7.5ZM3 13.5A2.5 2.5 0 0 0 .5 16v2.8c0 .6.7 1 .9.3L3.4 17H8.5A2.5 2.5 0 0 0 11 14.5 2.5 2.5 0 0 0 8.5 12H3.5A2.5 2.5 0 0 0 3 13.5ZM14 12.5A2.5 2.5 0 0 0 11.5 15v2.8c0 .6.7 1 .9.3l1.9-2.1H19.5A2.5 2.5 0 0 0 22 12.5 2.5 2.5 0 0 0 19.5 10h-5A2.5 2.5 0 0 0 14 12.5Z" />
    </svg>
  );
}

export function TeamsCalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M17 3a1 1 0 0 1 1 1v1h1.75A2.25 2.25 0 0 1 22 7.25v11.5A2.25 2.25 0 0 1 19.75 21H4.25A2.25 2.25 0 0 1 2 18.75V7.25A2.25 2.25 0 0 1 4.25 5H6V4a1 1 0 1 1 2 0v1h8V4a1 1 0 0 1 1-1ZM4.25 7.5a.75.75 0 0 0-.75.75v2.25h17V8.25a.75.75 0 0 0-.75-.75H4.25Zm-.75 5.75v5.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75v-5.5H3.5Z" />
    </svg>
  );
}

export function TeamsCallsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M7.5 4.25a2.25 2.25 0 0 0-2.25 2.25v11A2.25 2.25 0 0 0 7.5 19.75h9A2.25 2.25 0 0 0 18.75 17.5v-11A2.25 2.25 0 0 0 16.5 4.25h-9ZM8 7.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export function TeamsFilesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M8 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9.5L13.5 3H8Zm5 1.5V9a1 1 0 0 0 1 1h4.5L13 4.5ZM8 6.5h3.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5Zm0 4h8a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 8 10.5Zm0 4h5.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

export function TeamsAppsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)}>
      <path d="M5 3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm10 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4ZM5 13a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5Zm10 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4Z" />
    </svg>
  );
}

export function TeamsSearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)}>
      <path d="M10.5 3a7.5 7.5 0 1 0 4.73 13.36l4.07 4.07a1 1 0 0 0 1.42-1.42l-4.07-4.07A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z" />
    </svg>
  );
}

export function TeamsMoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)}>
      <path d="M5.75 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm7.75 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm7.75 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z" />
    </svg>
  );
}

export function TeamsMeetSenseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-5 w-5", className)}>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#5b5fc7" />
      <path
        d="M8 14.5V9.5l4.5 2.5L8 14.5Z"
        fill="white"
      />
      <circle cx="17" cy="7" r="2.5" fill="#6bb700" stroke="#252423" strokeWidth="1" />
    </svg>
  );
}

export function TeamsBotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)}>
      <path d="M12 2a2 2 0 0 1 2 2v1h1.5A3.5 3.5 0 0 1 19 8.5V14a3.5 3.5 0 0 1-3.5 3.5H8.5A3.5 3.5 0 0 1 5 14V8.5A3.5 3.5 0 0 1 8.5 5H10V4a2 2 0 0 1 2-2Zm-3.5 5A1.5 1.5 0 0 0 7 8.5V14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 19 14V8.5A1.5 1.5 0 0 0 17.5 7h-9ZM9 17.5a1 1 0 0 0-1 1v.5h8v-.5a1 1 0 0 0-1-1H9Z" />
    </svg>
  );
}

export function TeamsChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-3.5 w-3.5", className)}>
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
    </svg>
  );
}

export function TeamsPanelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)}>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-15ZM6 6v12h5.5V6H6Zm7.5 0V18H18V6h-4.5Z" />
    </svg>
  );
}
