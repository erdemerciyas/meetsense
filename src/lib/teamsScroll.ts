import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TEAMS_SCROLLER_SELECTOR = ".teams-content-area";

export function getTeamsScroller(): HTMLElement | null {
  return document.querySelector<HTMLElement>(TEAMS_SCROLLER_SELECTOR);
}

export function initTeamsScroll(): () => void {
  const scroller = getTeamsScroller();
  if (!scroller) return () => {};

  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        scroller.scrollTop = value;
      }
      return scroller.scrollTop;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: scroller.clientWidth,
        height: scroller.clientHeight,
      };
    },
    pinType: "transform",
  });

  const onScroll = () => ScrollTrigger.update();
  scroller.addEventListener("scroll", onScroll, { passive: true });

  const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
  resizeObserver.observe(scroller);

  const onWindowResize = () => ScrollTrigger.refresh();
  window.addEventListener("resize", onWindowResize);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  return () => {
    scroller.removeEventListener("scroll", onScroll);
    resizeObserver.disconnect();
    window.removeEventListener("resize", onWindowResize);
    ScrollTrigger.scrollerProxy(scroller, {});
  };
}

export function scrollToSection(
  target: string | HTMLElement,
  offset = 0,
) {
  const scroller = getTeamsScroller();
  const element =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (!element) return;

  if (scroller) {
    const scrollerRect = scroller.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const top =
      scroller.scrollTop + (elementRect.top - scrollerRect.top) + offset;
    scroller.scrollTo({ top, behavior: "smooth" });
    return;
  }

  element.scrollIntoView({ behavior: "smooth" });
}
