import { site } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function Interstitial() {
  const { ref, revealed } = useReveal<HTMLElement>();
  const { quote, attribution, photo } = site.interstitial;

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden transition-opacity duration-700 ${
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
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/82" />
      <div className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <p className="font-display text-[clamp(1.6rem,5vw,2.6rem)] leading-tight text-ink">
          {quote}
        </p>
        <p className="mt-5 font-mono text-xs tracking-[0.16em] text-ember uppercase">
          {attribution}
        </p>
      </div>
    </section>
  );
}
