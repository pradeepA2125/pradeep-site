import { site } from "../content";
import Section from "./Section";
import { useReveal } from "../hooks/useReveal";

export default function Riding() {
  const { body, routeNote, photo } = site.riding;
  // Same settle as the Training print — the two field notes pin alike.
  const figureReveal = useReveal<HTMLElement>();

  return (
    <Section id="riding" meta={site.sections.riding}>
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        {/*
          The bike shot is a tall portrait; at full column width it towers
          over a short paragraph. Capping height keeps the columns balanced.
        */}
        <figure
          ref={figureReveal.ref}
          className={`bg-ink p-2 pb-3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:rotate-0 md:order-last ${
            figureReveal.revealed
              ? "rotate-1 translate-y-0 opacity-100"
              : "rotate-4 translate-y-6 opacity-0"
          }`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="max-h-[24rem] w-full object-cover object-[center_72%] md:max-h-[28rem]"
          />
        </figure>
        <div>
          <p className="max-w-xl text-lg leading-relaxed text-ink-2">{body}</p>
          <p className="mt-6 font-mono text-xs tracking-[0.18em] text-ember uppercase">
            {routeNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
