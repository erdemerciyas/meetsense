/**
 * The loader sets `data-loading` on <html> before first paint (see the head script in the
 * layout) and clears it when the curtain lifts, announcing `ms:intro-done`. Anything that
 * plays once on arrival waits for this so it isn't spent behind the curtain.
 */
export const INTRO_DONE = "ms:intro-done";

/** Before first paint: skip the intro for repeat visits in a session and for reduced motion. */
export const INTRO_HEAD_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("ms-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-seen","")}else{d.setAttribute("data-loading","")}}catch(e){d.setAttribute("data-seen","")}})()`;

export function introDone() {
  return new Promise<void>((resolve) => {
    if (!document.documentElement.hasAttribute("data-loading")) return resolve();
    addEventListener(INTRO_DONE, () => resolve(), { once: true });
  });
}
