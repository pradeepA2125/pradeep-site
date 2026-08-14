import { useEffect, useState } from "react";
import { site } from "../content";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setOffset(Math.min(window.scrollY * 0.25, 140));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { headline, body, photo } = site.hero;

  return (
    <header className="relative flex min-h-[92svh] items-end overflow-hidden">
      {/*
        The crop is tuned per breakpoint because the container aspect flips.
        On a phone the image is taller than the box, so the full height shows
        and only x matters — biased left, where his face sits. On a wide
        desktop hero the box is short and letterbox-wide, so y decides which
        horizontal band is visible; pushed past centre so his face lands above
        the headline instead of behind it.
      */}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[28%_center] md:object-[34%_72%]"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.12)` }}
      />
      {/*
        Two overlays only. Three stacked gradients compound to near-black and
        swallow the photograph — the scrim exists to make the copy legible, not
        to hide the image.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-night/45 via-transparent to-night/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-night via-night/85 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8 sm:pb-20">
        <p className="mb-3 font-mono text-xs tracking-[0.18em] text-ember uppercase">
          {site.tagline} · {site.location}
        </p>
        <h1 className="mb-5 text-[clamp(2.4rem,9vw,4.5rem)] leading-[0.98] whitespace-pre-line">
          {headline}
        </h1>
        <p className="max-w-xl text-lg text-ink-2">{body}</p>
      </div>
    </header>
  );
}
