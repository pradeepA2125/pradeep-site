import { useEffect, useRef } from "react";
import { site } from "../content";
import { useReveal } from "../hooks/useReveal";
import { subscribeScroll } from "../lib/scrollDriver";

/**
 * The pivot from proof to person — full-bleed photograph, the thesis in his
 * own words. Deliberately not a nav destination and not a waypoint: it is
 * the pause between them.
 *
 * The photograph sits deeper than the page: scroll-linked translateY (the
 * image is scaled 13% for headroom and drifts against the scroll) gives the
 * pause real depth without touching layout. The subscription only exists
 * while the section is near the viewport, and never under reduced motion —
 * there the image is simply static and fully covering.
 */
export default function Interstitial() {
  const { ref, revealed } = useReveal<HTMLElement>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { quote, attribution, photo } = site.interstitial;

  useEffect(() => {
    const section = ref.current;
    const img = imgRef.current;
    if (!section || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const onFrame = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the section enters from below → 1 as it leaves above
      const p = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      // ±6% of section height; scale(1.13) leaves 6.5% headroom either side
      const ty = (p - 0.5) * rect.height * 0.12;
      img.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(1.13)`;
    };

    let unsubscribe: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          unsubscribe ??= subscribeScroll(onFrame);
        } else {
          unsubscribe?.();
          unsubscribe = undefined;
        }
      },
      { rootMargin: "80px" },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      unsubscribe?.();
    };
  }, [ref]);

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden transition-opacity duration-1000 ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        ref={imgRef}
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/84" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-night to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-night to-transparent"
      />
      <div className="mx-auto max-w-4xl px-5 py-32 text-center sm:px-8 sm:py-40">
        <p className="font-display text-[clamp(1.7rem,5.5vw,3.2rem)] leading-[1.15] font-bold tracking-tight text-ink">
          {quote}
        </p>
        <p className="mt-6 font-mono text-xs tracking-[0.2em] text-ember uppercase">
          {attribution}
        </p>
      </div>
    </section>
  );
}
