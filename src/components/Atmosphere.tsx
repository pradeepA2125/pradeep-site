import { useEffect, useRef } from "react";
import { subscribeScroll } from "../lib/scrollDriver";

/**
 * The night journey.
 *
 * The hero's WebGL scene owns the first screen and then stops — leaving the
 * rest of the page a flat dark surface. This layer carries the descent the
 * whole way down: the last of the dusk drains, night deepens and the stars
 * come out over the work, the interstitial sits at the darkest point, and
 * first light returns behind a ridge as the page reaches the contact section.
 *
 * Four fixed gradient layers stacked once, cross-faded by OPACITY ONLY.
 * Animating gradient colours directly would repaint a full viewport every
 * scroll frame; opacity is composited, so this costs the GPU almost nothing
 * and never touches layout.
 *
 * Reduced motion: renders the settled night state and never subscribes.
 */

/** Ramp from 0 to 1 across [a,b], clamped outside it. */
const ramp = (t: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (t - a) / (b - a)));

/** Triangular window: rises across [a,peak], falls across [peak,b]. */
const window3 = (t: number, a: number, peak: number, b: number) =>
  t <= peak ? ramp(t, a, peak) : 1 - ramp(t, peak, b);

export default function Atmosphere() {
  const duskRef = useRef<HTMLDivElement | null>(null);
  const nightRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);
  const dawnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layers = [duskRef, nightRef, starsRef, dawnRef].map((r) => r.current);
    if (layers.some((l) => !l)) return;
    const [dusk, night, stars, dawn] = layers as HTMLDivElement[];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The settled middle of the journey — night, stars out, no dawn.
      dusk.style.opacity = "0";
      night.style.opacity = "1";
      stars.style.opacity = "0.5";
      dawn.style.opacity = "0";
      return;
    }

    return subscribeScroll((scrollY) => {
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      const t = travel > 0 ? Math.min(1, scrollY / travel) : 0;

      // Residual warmth from the hero, gone by the time the work begins.
      dusk.style.opacity = String(1 - ramp(t, 0.04, 0.30));
      // Night deepens through building and work, deepest at the interstitial.
      night.style.opacity = String(window3(t, 0.10, 0.58, 0.99));
      // Stars emerge over the work and fade out as first light arrives.
      stars.style.opacity = String(window3(t, 0.18, 0.56, 0.90));
      // First light breaks only at the very end, behind the contact section.
      dawn.style.opacity = String(ramp(t, 0.74, 0.99));
    });
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* residual dusk — warm along the bottom edge */}
      <div
        ref={duskRef}
        className="absolute inset-0"
        style={{
          opacity: 1,
          background:
            "linear-gradient(to top, #3b2440 0%, #2a1f3a 30%, #1b1630 62%, #141225 100%)",
        }}
      />
      {/* deepening night */}
      <div
        ref={nightRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          background:
            "linear-gradient(to bottom, #0a0913 0%, #070610 45%, #05040c 100%)",
        }}
      />
      {/* stars — a few fixed radial dots, cheap and static */}
      <div
        ref={starsRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          backgroundImage: [
            "radial-gradient(1.7px 1.7px at 12% 18%, rgba(242,237,232,1), transparent 60%)",
            "radial-gradient(1.1px 1.1px at 71% 12%, rgba(242,237,232,0.7), transparent 60%)",
            "radial-gradient(1.6px 1.6px at 38% 31%, rgba(242,237,232,0.8), transparent 60%)",
            "radial-gradient(1.1px 1.1px at 88% 26%, rgba(196,205,235,0.7), transparent 60%)",
            "radial-gradient(1.3px 1.3px at 24% 44%, rgba(242,237,232,0.6), transparent 60%)",
            "radial-gradient(1.2px 1.2px at 57% 52%, rgba(196,205,235,0.7), transparent 60%)",
            "radial-gradient(1.5px 1.5px at 82% 61%, rgba(242,237,232,0.75), transparent 60%)",
            "radial-gradient(1.1px 1.1px at 9% 67%, rgba(196,205,235,0.6), transparent 60%)",
            "radial-gradient(1.3px 1.3px at 46% 74%, rgba(242,237,232,0.6), transparent 60%)",
            "radial-gradient(1.2px 1.2px at 66% 86%, rgba(196,205,235,0.55), transparent 60%)",
          ].join(","),
        }}
      />
      {/* first light, with the far ridge cut out of it */}
      <div ref={dawnRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(232,98,60,0.34) 0%, rgba(122,58,78,0.22) 26%, rgba(42,33,64,0.10) 52%, transparent 78%)",
          }}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-[38vh] w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <path
            d="M0 232 L96 205 L214 246 L332 186 L452 231 L560 197 L690 249 L812 208 L946 252 L1064 214 L1192 258 L1318 222 L1440 262 L1440 400 L0 400 Z"
            fill="#0b0a16"
          />
          <path
            d="M0 300 L128 274 L268 312 L404 268 L556 308 L700 272 L858 316 L1002 280 L1160 320 L1304 286 L1440 322 L1440 400 L0 400 Z"
            fill="#08070f"
          />
        </svg>
      </div>
    </div>
  );
}
