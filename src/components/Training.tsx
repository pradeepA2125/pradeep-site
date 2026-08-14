import { site } from "../content";
import Section from "./Section";
import { useReveal } from "../hooks/useReveal";

/** Heaviest lift sets the scale so the bars read as relative load. */
const maxKg = Math.max(
  ...site.training.lifts.map((l) => Number.parseInt(l.value, 10) || 0),
);

export default function Training() {
  const { body, lifts, photo } = site.training;
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <Section id="training" meta={site.sections.training}>
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-ink-2">{body}</p>
          <div ref={ref} className="flex flex-col gap-4">
            {lifts.map((lift, i) => {
              const kg = Number.parseInt(lift.value, 10) || 0;
              return (
                <div key={lift.name}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="font-mono text-[0.68rem] tracking-[0.16em] text-indigo-ink uppercase">
                      {lift.name}
                    </span>
                    <span className="font-display text-lg font-bold text-ink tabular-nums">
                      {lift.value}
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-white/8"
                    role="img"
                    aria-label={`${lift.name}: ${lift.value}`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose to-ember transition-transform duration-1000 ease-out"
                      style={{
                        transform: revealed ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        width: `${(kg / maxKg) * 100}%`,
                        transitionDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <figure className="-rotate-1 bg-ink p-2 pb-3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:rotate-0">
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </figure>
      </div>
    </Section>
  );
}
