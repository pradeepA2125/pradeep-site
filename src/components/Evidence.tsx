import { site } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function Evidence() {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`border-y border-white/5 bg-dusk/40 transition-opacity duration-700 ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-12 sm:px-8 lg:grid-cols-4">
        {site.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="font-display text-3xl tabular-nums text-ember sm:text-4xl">
              {metric.value}
            </dt>
            <dd className="mt-1 text-sm leading-snug text-ink-2">{metric.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
