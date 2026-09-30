"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { INTRO_DONE } from "@/lib/intro";

type Api = Awaited<ReturnType<typeof import("./intro3d").mountIntro>>;

const MIN_MS = 2300; // long enough for the opening shot to land
const MAX_MS = 4500; // never hold the page longer than this

/**
 * The loader: a paper curtain with the 3D mark assembling itself, the wordmark, and an
 * ember progress line. It's in the server HTML so it covers the page from first paint;
 * it lifts once the page has loaded (between MIN_MS and MAX_MS), or on click / Escape.
 * Hidden by CSS for repeat visits and reduced motion; without JS a CSS failsafe lifts it.
 */
export function Intro() {
  const host = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"on" | "live" | "leaving" | "gone">("on");

  useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-loading")) return;

    let api: Api | undefined;
    let alive = true;
    let left = false;
    let timer = 0;
    const leave = () => {
      if (left || !alive) return;
      left = true;
      html.removeAttribute("data-loading");
      try {
        sessionStorage.setItem("ms-intro", "1");
      } catch {}
      setPhase("leaving");
      dispatchEvent(new Event(INTRO_DONE));
      timer = window.setTimeout(() => {
        api?.dispose();
        api = undefined;
        setPhase("gone");
      }, 900);
    };

    const loaded = new Promise<void>((r) => (document.readyState === "complete" ? r() : addEventListener("load", () => r(), { once: true })));
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    Promise.race([Promise.all([loaded, wait(MIN_MS)]), wait(MAX_MS)]).then(leave);

    if (document.createElement("canvas").getContext("webgl2")) {
      import("./intro3d")
        .then(({ mountIntro }) => mountIntro(host.current!))
        .then((made) => {
          if (left || !alive) return made.dispose();
          api = made;
          setPhase("live");
        })
        .catch(() => {});
    }

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && leave();
    addEventListener("keydown", onKey);
    return () => {
      alive = false;
      removeEventListener("keydown", onKey);
      clearTimeout(timer);
      api?.dispose();
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div aria-hidden="true" className="intro fixed inset-0 z-[100] grid cursor-pointer place-content-center justify-items-center bg-paper" data-phase={phase} onClick={() => dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}>
      <div className="relative size-[min(52vmin,22rem)]">
        <div ref={host} className="absolute inset-0" />
        <img src="/brand/meetsense-mark.svg" alt="" className="intro-fallback absolute inset-[24%]" />
      </div>
      <p className="intro-word -mt-4 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-bold tracking-[-0.02em]">MeetSense</p>
      <span className="intro-bar absolute inset-x-0 bottom-0 h-[3px] bg-ember" />
    </div>
  );
}
