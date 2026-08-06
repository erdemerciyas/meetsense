import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/teamsScroll";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

const NAV_OFFSET = 0;

export function getLenis() {
  return lenisInstance;
}

export function scrollToElement(
  target: string | HTMLElement,
  options?: { offset?: number },
) {
  const offset = options?.offset ?? NAV_OFFSET;
  const teamsScroller = document.querySelector(".teams-content-area");

  if (teamsScroller) {
    scrollToSection(target, offset);
    return;
  }

  const lenis = lenisInstance;
  if (!lenis) {
    const element =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    element?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  lenis.scrollTo(target, { offset });
}

export function stopSmoothScroll() {
  lenisInstance?.stop();
}

export function startSmoothScroll() {
  lenisInstance?.start();
}

export function initSmoothScroll(): () => void {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    touchMultiplier: 1.2,
    anchors: { offset: NAV_OFFSET },
  });

  lenisInstance = lenis;
  const root = document.documentElement;

  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(root, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  const onRefresh = () => {
    lenis.resize();
  };

  ScrollTrigger.addEventListener("refresh", onRefresh);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  return () => {
    window.removeEventListener("load", onLoad);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    gsap.ticker.remove(ticker);
    ScrollTrigger.scrollerProxy(root, {});
    lenis.destroy();
    lenisInstance = null;
  };
}
