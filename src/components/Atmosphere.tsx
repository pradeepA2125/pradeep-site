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

/** Trapezoid: fades up across [a,b], holds at 1, fades down across [c,d]. */
const plateau = (t: number, a: number, b: number, c: number, d: number) =>
  t < b ? ramp(t, a, b) : t <= c ? 1 : 1 - ramp(t, c, d);

/** Triangular window: rises across [a,peak], falls across [peak,b]. */
const window3 = (t: number, a: number, peak: number, b: number) =>
  t <= peak ? ramp(t, a, peak) : 1 - ramp(t, peak, b);

/**
 * The moon's traverse. It clears the ridge on the right as night settles,
 * arcs overhead at the darkest point of the page, and has set on the left
 * before first light — so the sky is never lit by both at once.
 */
const MOON_RISE = 0.13;
const MOON_PEAK = 0.52;
const MOON_SET = 0.87;

export default function Atmosphere() {
  const duskRef = useRef<HTMLDivElement | null>(null);
  const nightRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const dawnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layers = [duskRef, nightRef, starsRef, moonRef, dawnRef].map(
      (r) => r.current,
    );
    if (layers.some((l) => !l)) return;
    const [dusk, night, stars, moon, dawn] = layers as HTMLDivElement[];

    /** Right horizon -> overhead -> left horizon, as a parabola over the sky. */
    const placeMoon = (t: number) => {
      const arc = Math.min(
        1,
        Math.max(0, (t - MOON_RISE) / (MOON_SET - MOON_RISE)),
      );
      const x = 84 - arc * 72;
      const y = 84 - Math.sin(arc * Math.PI) * 70;
      moon.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;
      // A moon is bright for its whole crossing — it only dims at the
      // horizons. A triangular fade left it near-invisible for most of the
      // traverse (0.18 rising, 0.14 setting), so it read as a glow rather
      // than an object you can follow.
      moon.style.opacity = String(
        plateau(t, MOON_RISE, MOON_RISE + 0.07, MOON_SET - 0.12, MOON_SET),
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The settled middle of the journey — night, stars out, moon overhead.
      dusk.style.opacity = "0";
      night.style.opacity = "1";
      stars.style.opacity = "0.5";
      dawn.style.opacity = "0";
      placeMoon(MOON_PEAK);
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
      // The moon crosses while the page is at its darkest.
      placeMoon(t);
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
      {/* the moon — the one thing that actually moves across the sky */}
      <div
        ref={moonRef}
        className="absolute top-0 left-0 h-28 w-28"
        style={{
          opacity: 0,
          marginLeft: "-3.5rem",
          marginTop: "-3.5rem",
          willChange: "transform",
          background:
            "radial-gradient(circle at 38% 33%, #fffdf7 0%, #f1ead9 44%, #d3ccbc 66%, rgba(190,184,170,0.25) 72%, transparent 74%)",
          boxShadow:
            "0 0 70px 26px rgba(228,222,206,0.16), 0 0 160px 70px rgba(160,168,214,0.10)",
          borderRadius: "9999px",
        }}
      />

      {/* first light, with the far ridge cut out of it */}
      <div ref={dawnRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            background: [
              // the low sun's core, right on the ridge line
              "radial-gradient(120% 62% at 50% 96%, rgba(255,150,86,0.62) 0%, rgba(232,98,60,0.30) 34%, transparent 68%)",
              // the sky lifting off the horizon
              "linear-gradient(to top, rgba(232,98,60,0.55) 0%, rgba(150,66,84,0.40) 22%, rgba(58,42,86,0.22) 48%, transparent 76%)",
            ].join(","),
          }}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-[38vh] w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <path
            d="M0 232 L96 205 L214 246 L332 186 L452 231 L560 197 L690 249 L812 208 L946 252 L1064 214 L1192 258 L1318 222 L1440 262 L1440 400 L0 400 Z"
            fill="#07060e"
          />
          <path
            d="M0 300 L128 274 L268 312 L404 268 L556 308 L700 272 L858 316 L1002 280 L1160 320 L1304 286 L1440 322 L1440 400 L0 400 Z"
            fill="#040309"
          />
        </svg>
      </div>
    </div>
  );
}
