import { site } from "../content";
import { useReveal } from "../hooks/useReveal";

/**
 * The pivot from proof to person — full-bleed photograph, the thesis in his
 * own words. Deliberately not a nav destination and not a waypoint: it is
 * the pause between them.
 */
export default function Interstitial() {
  const { ref, revealed } = useReveal<HTMLElement>();
  const { quote, attribution, photo } = site.interstitial;

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden transition-opacity duration-1000 ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[2.5s] ease-out ${
          revealed ? "scale-100" : "scale-110"
        }`}
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
