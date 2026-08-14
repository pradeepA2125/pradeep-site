import { useEffect, useRef } from "react";
import { site } from "../content";
import { handleAnchorClick } from "../lib/scrollToAnchor";
import HeroScene from "./HeroScene";
import { subscribeScroll } from "../lib/scrollDriver";

/**
 * The hero is a generative WebGL dusk mountainscape — a mountain road at
 * last light, one headlight working across the nearest ridge. The train
 * photograph, formerly the hero background, becomes a pinned field-note
 * card: the human evidence sitting on top of the landscape instead of
 * fighting the headline for the same layer.
 *
 * The cinematic hold: the header is a 200svh track whose stage is
 * position:sticky — native scroll stays completely intact, the stage
 * simply stays put for one viewport of travel while the camera pulls back
 * in the shader, the copy blurs and lifts away, the field-note print
 * drifts off, and the scrim thins until the landscape holds the frame
 * alone at full night. Then the page moves on. No pinning library, no
 * scroll hijack — sticky plus scrollY normalised over the track.
 *
 * Reduced motion: the track collapses to a single viewport (motion-safe
 * gates the tall height), nothing subscribes, nothing fades.
 */
export default function Hero() {
  const { headline, body, photo, noteCaption, cta, scrollHint } = site.hero;

  const trackRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    const card = cardRef.current;
    const scrim = scrimRef.current;
    const cue = cueRef.current;
    if (!track || !copy || !card || !scrim || !cue) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
    let lastP = -1;

    return subscribeScroll((scrollY) => {
      // The hold span: how far the page travels while the stage sticks.
      // One clientHeight read against a clean layout (all writes below are
      // transform/opacity/filter — nothing dirties it mid-frame).
      const hold = Math.max(track.clientHeight - window.innerHeight, 1);
      const p = clamp01(scrollY / hold);
      if (p === lastP) return;
      lastP = p;

      // Copy goes first — up and out of focus, like eyes leaving the page
      // for the horizon. Small blur (≤5px) on a small text layer only.
      const copyP = clamp01(p / 0.45);
      copy.style.opacity = String(1 - copyP);
      copy.style.transform = `translate3d(0, ${(-30 * copyP).toFixed(1)}px, 0)`;
      copy.style.filter = copyP > 0.001 ? `blur(${(5 * copyP).toFixed(2)}px)` : "";
      // An invisible CTA must not stay click/tab-reachable.
      copy.style.visibility = copyP >= 1 ? "hidden" : "";

      // The print unpins a beat later and drifts the other way.
      const cardP = clamp01((p - 0.12) / 0.5);
      if (cardP > 0) {
        card.style.transition = "none"; // per-frame writes; kill the hover tween
        card.style.opacity = String(1 - cardP);
        card.style.transform = `translate3d(0, ${(26 * cardP).toFixed(1)}px, 0) rotate(2deg)`;
        card.style.visibility = cardP >= 1 ? "hidden" : "";
      } else {
        // hand the element back to its classes (resting tilt, hover tween)
        card.style.transition = "";
        card.style.opacity = "";
        card.style.transform = "";
        card.style.visibility = "";
      }

      // Legibility scrim thins once the text it protected is gone.
      scrim.style.opacity = String(1 - clamp01((p - 0.35) / 0.45));

      // The cue asked for this scroll; it has been answered.
      cue.style.opacity = String(1 - clamp01(p / 0.4));
    });
  }, []);

  return (
    <header
      id="top"
      ref={trackRef}
      data-hero-track
      className="relative motion-safe:h-[200svh]"
    >
      <div className="sticky top-0 flex min-h-[100svh] items-end overflow-hidden">
        <HeroScene />

        {/* Single legibility scrim — the scene is dark already. */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-night via-night/70 to-transparent sm:h-[55%]"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8 sm:pb-24">
          <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
            <div ref={copyRef} className="max-w-2xl">
              <p className="mb-4 font-mono text-xs tracking-[0.22em] text-ember uppercase">
                {site.tagline} · {site.location}
              </p>
              <h1 className="mb-6 text-[clamp(2.7rem,9.5vw,5.5rem)] leading-[0.95] whitespace-pre-line">
                {headline}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-ink-2">{body}</p>
              <a
                href={cta.href}
                onClick={(e) => handleAnchorClick(e, cta.href)}
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-ember/60 bg-night/70 px-6 py-3 font-mono text-sm text-ember backdrop-blur-sm transition-colors hover:bg-ember hover:text-night"
              >
                {cta.label}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            </div>

            {/* Field-note card — slightly rotated print, mono caption. */}
            <figure
              ref={cardRef}
              className="w-40 shrink-0 rotate-2 bg-ink p-2 pb-3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:rotate-0 sm:w-52 md:mb-2"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                fetchPriority="high"
                className="aspect-[3/4] w-full object-cover object-[28%_center]"
              />
              <figcaption className="mt-2 px-1 font-mono text-[0.58rem] leading-snug text-night/70">
                {noteCaption}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Scroll cue — decorative, motion killed by the global reduced-motion rule. */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        >
          <span className="font-mono text-[0.6rem] tracking-[0.3em] text-indigo-ink uppercase">
            {scrollHint}
          </span>
          <span className="scroll-cue-line block h-10 w-px bg-gradient-to-b from-indigo-ink/70 to-transparent" />
        </div>
      </div>
    </header>
  );
}
