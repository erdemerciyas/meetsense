/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img src="/brand/meetsense-mark.svg" alt="" width={28} height={28} className="size-7 -translate-y-px" />
      <span className="text-[1.3125rem] font-bold tracking-[-0.02em]">MeetSense</span>
    </span>
  );
}
