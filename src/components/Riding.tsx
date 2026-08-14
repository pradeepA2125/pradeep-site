import { site } from "../content";
import Section from "./Section";

export default function Riding() {
  const { body, routeNote, photo } = site.riding;

  return (
    <Section id="riding" meta={site.sections.riding}>
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        {/*
          The bike shot is a tall portrait; at full column width it towers
          over a short paragraph. Capping height keeps the columns balanced.
        */}
        <figure className="rotate-1 bg-ink p-2 pb-3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:rotate-0 md:order-last">
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
