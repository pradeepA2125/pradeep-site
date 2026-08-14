/**
 * The one scroll listener on the page.
 *
 * Every scroll-linked effect (the WebGL descent, the Work route line, the
 * interstitial depth) subscribes here instead of adding its own listener.
 * One passive `scroll` + `resize` handler schedules a single rAF; subscribers
 * run inside that frame. Nothing polls: no scroll events, no work — so a
 * hidden tab or an idle reader costs zero.
 *
 * Subscribers may read layout (getBoundingClientRect) and must write only
 * compositor-safe properties (transform/opacity/uniforms). Since transform
 * writes never invalidate layout, interleaved subscriber reads stay cheap.
 */

type ScrollSubscriber = (scrollY: number) => void;

const subscribers = new Set<ScrollSubscriber>();
let rafId = 0;
let isListening = false;

const runFrame = () => {
  rafId = 0;
  const y = window.scrollY;
  for (const fn of subscribers) fn(y);
};

const schedule = () => {
  if (!rafId) rafId = requestAnimationFrame(runFrame);
};

/**
 * Registers a scroll-frame callback and returns its unsubscribe.
 * The callback also fires once immediately after subscribing (via rAF), so
 * effects land in the right state on mount and after scroll restoration.
 */
export function subscribeScroll(fn: ScrollSubscriber): () => void {
  subscribers.add(fn);
  if (!isListening) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    isListening = true;
  }
  schedule();

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && isListening) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      isListening = false;
    }
  };
}
