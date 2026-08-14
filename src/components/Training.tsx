import { site } from "../content";
import Section from "./Section";

export default function Training() {
  const { heading, body, lifts, photo } = site.training;

  return (
    <Section id="training" eyebrow="Off the keyboard" title={heading}>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-6 text-ink-2">{body}</p>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2">
            {lifts.map((lift) => (
              <div key={lift.name} className="rounded border border-white/10 bg-dusk/30 p-3">
                <dt className="font-mono text-[0.65rem] tracking-[0.14em] text-indigo-ink uppercase">
                  {lift.name}
                </dt>
                <dd className="font-display text-xl tabular-nums text-ink">{lift.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="w-full rounded object-cover"
        />
      </div>
    </Section>
  );
}
