import { site } from "../content";
import Section from "./Section";

/**
 * The route so far: roles hang off a vertical line with waypoint dots,
 * newest at the top — a timeline drawn like a climbing route.
 */
export default function Work() {
  return (
    <Section id="work" meta={site.sections.work}>
      <div className="relative flex flex-col gap-12 border-l border-white/10 pl-7 sm:pl-10">
        {site.roles.map((role) => (
          <article key={`${role.org}-${role.startYear}`} className="relative">
            {/* waypoint dot on the route line */}
            <span
              aria-hidden="true"
              className="absolute top-2 -left-7 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-ember bg-night sm:-left-10"
            />
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-xl text-ink">{role.title}</h3>
              <span className="font-display text-xl font-bold text-ember">
                {role.org}
              </span>
            </div>
            <p className="mb-3 font-mono text-xs tracking-[0.12em] text-indigo-ink">
              {role.period}
            </p>
            <ul className="flex max-w-3xl flex-col gap-2">
              {role.points.map((point) => (
                <li key={point} className="leading-relaxed text-ink-2">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <a
        href={site.resumeHref}
        className="mt-12 inline-block rounded-full border border-ember/50 px-6 py-3 font-mono text-sm text-ember transition-colors hover:bg-ember hover:text-night"
      >
        {site.ui.resumeLabel}
      </a>
    </Section>
  );
}
