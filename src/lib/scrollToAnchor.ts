/**
 * Click-to-scroll that lets the journey play.
 *
 * Native anchor scrolling (and CSS scroll-behavior: smooth) runs a fixed
 * ~400ms no matter how far it travels. From the hero that crosses a 200svh
 * track plus a section in a blur: the scene's descent flies past and the
 * reveal animations fire mid-flight, finishing before you arrive. So the
 * page's own choreography is skipped by the very control inviting you to
 * see it.
 *
 * This paces the travel by distance instead, so a long jump takes long
 * enough to watch and a short one stays snappy.
 *
 * This is NOT scroll-jacking: it runs only on an explicit click, and any
 * wheel, touch, or key input cancels it instantly and hands control back.
 * The user is never held in a scroll they didn't ask for.
 */

/**
 * Pixels per second of travel. Tuned by measuring the hero -> building jump:
 * native anchor scrolling covered it in ~400ms (a blur), 1900px/s gave 916ms
 * (still brisk), 1150px/s gives ~1.7s — long enough for the scene's descent
 * and the section reveals to actually read.
 */
const SPEED = 1150;
const MIN_MS = 420;
const MAX_MS = 2600;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function scrollToAnchor(hash: string): boolean {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(id);
  if (!target) return false;

  const startY = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const endY = Math.min(Math.max(target.offsetTop, 0), Math.max(maxY, 0));
  const distance = endY - startY;
  if (Math.abs(distance) < 2) return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: endY, behavior: "instant" as ScrollBehavior });
    return true;
  }

  const duration = Math.min(
    MAX_MS,
    Math.max(MIN_MS, (Math.abs(distance) / SPEED) * 1000),
  );

  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  // Any real user input wins immediately.
  const opts = { passive: true, once: true } as const;
  window.addEventListener("wheel", cancel, opts);
  window.addEventListener("touchstart", cancel, opts);
  window.addEventListener("keydown", cancel, opts);

  const started = performance.now();

  const step = (now: number) => {
    if (cancelled) return cleanup();
    const t = Math.min(1, (now - started) / duration);
    window.scrollTo({
      top: startY + distance * easeInOutCubic(t),
      behavior: "instant" as ScrollBehavior,
    });
    if (t < 1) requestAnimationFrame(step);
    else cleanup();
  };

  const cleanup = () => {
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
  };

  requestAnimationFrame(step);
  return true;
}

/**
 * Click handler for same-page anchors. Keeps the address bar in step so the
 * link is still shareable and the back button still works.
 */
export function handleAnchorClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (!href.startsWith("#")) return;
  // Let modified clicks (new tab/window) behave normally.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (scrollToAnchor(href)) {
    event.preventDefault();
    history.pushState(null, "", href);
  }
}
