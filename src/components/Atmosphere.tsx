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
 * Fixed gradient layers cross-fade by OPACITY ONLY. The celestial beat is an
 * eclipse forming in one corner of the sky, rather than an object tracking
 * across the reading column for the whole page.
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

const ECLIPSE_IN = 0.27;
const ECLIPSE_FULL = 0.51;
const ECLIPSE_OUT = 0.77;

export default function Atmosphere() {
  const duskRef = useRef<HTMLDivElement | null>(null);
  const nightRef = useRef<HTMLDivElement | null>(null);
  const distantStarsRef = useRef<HTMLDivElement | null>(null);
  const nearStarsRef = useRef<HTMLDivElement | null>(null);
  const starTrailsRef = useRef<HTMLDivElement | null>(null);
  const eclipseRef = useRef<HTMLDivElement | null>(null);
  const occluderRef = useRef<HTMLDivElement | null>(null);
  const coronaRef = useRef<HTMLDivElement | null>(null);
  const meteorRef = useRef<HTMLDivElement | null>(null);
  const dawnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layers = [
      duskRef,
      nightRef,
      distantStarsRef,
      nearStarsRef,
      starTrailsRef,
      eclipseRef,
      occluderRef,
      coronaRef,
      meteorRef,
      dawnRef,
    ].map(
      (r) => r.current,
    );
    if (layers.some((l) => !l)) return;
    const [dusk, night, distantStars, nearStars, starTrails, eclipse, occluder, corona, meteor, dawn] = layers as HTMLDivElement[];

    /** A short, cinematic eclipse beat that stays away from the copy. */
    const placeEclipse = (t: number) => {
      const presence = plateau(t, ECLIPSE_IN, ECLIPSE_IN + 0.08, ECLIPSE_OUT - 0.10, ECLIPSE_OUT);
      const phase = ramp(t, ECLIPSE_IN + 0.04, ECLIPSE_FULL);
      const totality = window3(t, 0.43, 0.56, 0.69);
      const meteorBeat = window3(t, 0.50, 0.56, 0.64);

      // The body barely moves: the world changes beneath it, instead of a
      // decorative sticker travelling across the viewport.
      eclipse.style.opacity = String(presence * 0.92);
      eclipse.style.transform = `translate3d(${76 + phase * 1.5}vw, ${12 - phase * 2}vh, 0) scale(${0.78 + presence * 0.22})`;
      occluder.style.transform = `translate3d(${(-72 + phase * 75).toFixed(2)}%, ${(-5 + phase * 4).toFixed(2)}%, 0)`;
      corona.style.opacity = String(totality * 0.92);
      corona.style.transform = `scale(${0.86 + totality * 0.24}) rotate(${phase * 42}deg)`;

      // One brief meteor sweep gives totality a payoff without creating a
      // second full-page travelling object.
      meteor.style.opacity = String(Math.pow(Math.max(0, meteorBeat), 0.65) * 0.82);
      meteor.style.transform = `translate3d(${105 - meteorBeat * 115}vw, ${-6 + meteorBeat * 50}vh, 0) rotate(145deg)`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The settled middle of the journey: a quiet total eclipse, no sweep.
      dusk.style.opacity = "0";
      night.style.opacity = "1";
      distantStars.style.opacity = "0.5";
      distantStars.style.transform = "translate3d(0, 7vh, 0)";
      nearStars.style.opacity = "0.32";
      nearStars.style.transform = "translate3d(-8vw, 18vh, 0)";
      starTrails.style.opacity = "0";
      dawn.style.opacity = "0";
      placeEclipse(ECLIPSE_FULL);
      meteor.style.opacity = "0";
      return;
    }

    return subscribeScroll((scrollY) => {
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      const t = travel > 0 ? Math.min(1, scrollY / travel) : 0;

      // Residual warmth from the hero, gone by the time the work begins.
      dusk.style.opacity = String(1 - ramp(t, 0.04, 0.30));
      // Night deepens through building and work, deepest at the interstitial.
      night.style.opacity = String(window3(t, 0.10, 0.58, 0.99));
      // The far layer moves slowly enough to feel like true sky distance.
      const nightSky = window3(t, 0.18, 0.56, 0.90);
      distantStars.style.opacity = String(nightSky * 0.88);
      distantStars.style.transform = `translate3d(${t * -3.2}vw, ${t * 15}vh, 0)`;

      // A second, sparse layer moves much faster. The difference in speed
      // creates a hyperlapse-like parallax without turning the sky into a
      // distracting warp tunnel.
      nearStars.style.opacity = String(nightSky * 0.42);
      nearStars.style.transform = `translate3d(${t * -18}vw, ${t * 42}vh, 0)`;
      const totality = window3(t, 0.44, 0.56, 0.68);
      starTrails.style.opacity = String(totality * 0.34);
      starTrails.style.transform = `translate3d(${t * -21}vw, ${t * 48}vh, 0)`;
      // The sky reaches totality at the darkest point of the page.
      placeEclipse(t);
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
      {/* Far stars: a slow layer, like an enormous sky beyond the page. */}
      <div
        ref={distantStarsRef}
        className="absolute -inset-y-[22%] inset-x-0"
        style={{
          opacity: 0,
          willChange: "transform, opacity",
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
      {/* Near stars: fewer and brighter, so their faster scroll reads as depth. */}
      <div
        ref={nearStarsRef}
        className="absolute -inset-y-[55%] -inset-x-[16%]"
        style={{
          opacity: 0,
          willChange: "transform, opacity",
          backgroundImage: [
            "radial-gradient(2.2px 2.2px at 15% 13%, rgba(224,233,255,0.85), transparent 58%)",
            "radial-gradient(1.8px 1.8px at 61% 25%, rgba(255,239,213,0.78), transparent 58%)",
            "radial-gradient(2px 2px at 89% 38%, rgba(211,224,255,0.72), transparent 58%)",
            "radial-gradient(1.8px 1.8px at 34% 56%, rgba(255,239,213,0.72), transparent 58%)",
            "radial-gradient(2.2px 2.2px at 72% 73%, rgba(224,233,255,0.78), transparent 58%)",
            "radial-gradient(1.7px 1.7px at 7% 84%, rgba(211,224,255,0.70), transparent 58%)",
          ].join(","),
        }}
      />
      {/* The closer stars acquire tiny trails only during totality. */}
      <div
        ref={starTrailsRef}
        className="absolute -inset-y-[55%] -inset-x-[16%]"
        style={{
          opacity: 0,
          willChange: "transform, opacity",
          backgroundImage: [
            "linear-gradient(145deg, transparent 46%, rgba(212,225,255,0.72) 49%, transparent 54%)",
            "linear-gradient(145deg, transparent 67%, rgba(255,233,207,0.62) 70%, transparent 75%)",
            "linear-gradient(145deg, transparent 79%, rgba(212,225,255,0.58) 82%, transparent 87%)",
          ].join(","),
          backgroundSize: "120px 80px, 170px 110px, 210px 140px",
          backgroundPosition: "10% 14%, 72% 36%, 32% 72%",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* A fixed celestial event, deliberately outside the reading column. */}
      <div
        ref={eclipseRef}
        className="absolute top-0 left-0 h-40 w-40 sm:h-52 sm:w-52"
        style={{
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        {/* The corona reads before the disk: a more memorable silhouette than a flat moon. */}
        <div
          ref={coronaRef}
          className="absolute -inset-10 rounded-full"
          style={{
            opacity: 0,
            willChange: "transform, opacity",
            background:
              "repeating-conic-gradient(from 18deg, rgba(176,192,255,0) 0deg 8deg, rgba(176,192,255,0.20) 10deg 13deg, rgba(245,220,180,0.06) 16deg 21deg, transparent 25deg 33deg)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute inset-3 overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(circle at 33% 28%, #fcf4db 0%, #d8d5ca 35%, #8d92a1 61%, #4f536d 78%, #232538 100%)",
            boxShadow: "0 0 36px 10px rgba(194,209,255,0.20), 0 0 100px 30px rgba(91,102,182,0.12)",
          }}
        >
          <div
            ref={occluderRef}
            className="absolute -inset-[5%] rounded-full"
            style={{
              willChange: "transform",
              background: "radial-gradient(circle at 42% 42%, #090914 0%, #060610 62%, #171a30 100%)",
              boxShadow: "-10px 0 24px rgba(147,168,255,0.16)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 66% 34%, rgba(31,34,53,0.32) 0 5%, transparent 6%), radial-gradient(circle at 77% 45%, rgba(31,34,53,0.18) 0 3%, transparent 4%), radial-gradient(circle at 30% 68%, rgba(31,34,53,0.30) 0 6%, transparent 7%), radial-gradient(circle at 44% 22%, rgba(31,34,53,0.16) 0 2.5%, transparent 3.5%)",
              mixBlendMode: "multiply",
            }}
          />
        </div>
      </div>

      {/* A tiny meteor shower arrives only at totality. */}
      <div
        ref={meteorRef}
        className="absolute top-0 left-0 h-px w-40 origin-left"
        style={{
          opacity: 0,
          willChange: "transform, opacity",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(157,184,255,0.05) 20%, rgba(233,239,255,0.92) 88%, rgba(255,247,214,1) 100%)",
          boxShadow: "0 0 8px rgba(192,210,255,0.80)",
        }}
      >
        <span className="absolute right-8 top-5 h-px w-20 bg-gradient-to-r from-transparent to-[#c6d5ff]/70" />
        <span className="absolute right-16 top-10 h-px w-12 bg-gradient-to-r from-transparent to-[#f4d7af]/65" />
      </div>

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
