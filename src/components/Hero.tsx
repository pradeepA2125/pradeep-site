import { site } from "../content";
import HeroScene from "./HeroScene";

/**
 * The hero is a generative WebGL dusk mountainscape — a mountain road at
 * last light, one headlight working across the nearest ridge. The train
 * photograph, formerly the hero background, becomes a pinned field-note
 * card: the human evidence sitting on top of the landscape instead of
 * fighting the headline for the same layer.
 */
export default function Hero() {
  const { headline, body, photo, noteCaption, cta, scrollHint } = site.hero;

  return (
    <header className="relative flex min-h-[100svh] items-end overflow-hidden">
      <HeroScene />

      {/* Single legibility scrim — the scene is dark already. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-night via-night/70 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8 sm:pb-24">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs tracking-[0.22em] text-ember uppercase">
              {site.tagline} · {site.location}
            </p>
            <h1 className="mb-6 text-[clamp(2.7rem,9.5vw,5.5rem)] leading-[0.95] whitespace-pre-line">
              {headline}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-2">{body}</p>
            <a
              href={cta.href}
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-ember/50 bg-ember/10 px-6 py-3 font-mono text-sm text-ember transition-colors hover:bg-ember hover:text-night"
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
          <figure className="w-40 shrink-0 rotate-2 bg-ink p-2 pb-3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:rotate-0 sm:w-52 md:mb-2">
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
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.3em] text-indigo-ink uppercase">
          {scrollHint}
        </span>
        <span className="scroll-cue-line block h-10 w-px bg-gradient-to-b from-indigo-ink/70 to-transparent" />
      </div>
    </header>
  );
}
