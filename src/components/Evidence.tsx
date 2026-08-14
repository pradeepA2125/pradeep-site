import { site } from "../content";
import { useReveal } from "../hooks/useReveal";

/**
 * The proof strip that pays for the emotional hero. Metrics stagger in
 * left-to-right on first reveal; under reduced motion they simply appear.
 */
export default function Evidence() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const meta = site.sections.evidence;

  return (
    <div ref={ref} className="border-y border-white/5 bg-dusk/30">
      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.2em] text-ember">
            WP·{meta.waypoint}
          </span>
          <span
            aria-hidden="true"
            className={`h-px flex-1 origin-left bg-gradient-to-r from-ember/50 to-white/10 transition-transform duration-[1100ms] ease-out ${
              revealed ? "scale-x-100" : "scale-x-0"
            }`}
          />
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-indigo-ink uppercase">
            {meta.eyebrow}
          </span>
        </div>
      </div>
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:px-8 lg:grid-cols-4">
        {site.metrics.map((metric, i) => (
          <div
            key={metric.label}
            className={`flex flex-col transition-all duration-700 lg:border-l lg:border-white/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0 ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            <dt className="order-last mt-2 text-sm leading-snug text-ink-2">
              {metric.label}
            </dt>
            <dd className="font-display text-4xl font-bold tracking-tight text-ember tabular-nums sm:text-5xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
