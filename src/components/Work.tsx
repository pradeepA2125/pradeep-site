import { site } from "../content";
import Section from "./Section";

export default function Work() {
  return (
    <Section id="work" eyebrow="Where I've done it" title="Work">
      <div className="flex flex-col gap-10">
        {site.roles.map((role) => (
          <article
            key={`${role.org}-${role.startYear}`}
            className="border-l-2 border-ember/30 pl-5"
          >
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-lg text-ink">{role.title}</h3>
              <span className="font-display text-lg text-ember">{role.org}</span>
            </div>
            <p className="mb-3 font-mono text-xs text-indigo-ink">{role.period}</p>
            <ul className="flex flex-col gap-1.5">
              {role.points.map((point) => (
                <li key={point} className="text-ink-2">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <a
        href={site.resumeHref}
        className="mt-10 inline-block rounded border border-ember/50 px-5 py-2.5 font-mono text-sm text-ember transition-colors hover:bg-ember/10"
      >
        Full resume (PDF)
      </a>
    </Section>
  );
}
