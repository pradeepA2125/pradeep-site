import { site } from "../content";
import Section from "./Section";

export default function Building() {
  return (
    <Section id="building" eyebrow="What I build" title="Building">
      <div className="flex flex-col gap-8">
        {site.projects.map((project) => (
          <article
            key={project.name}
            className="rounded border border-white/10 bg-dusk/30 p-6 transition-colors hover:border-ember/40"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl text-ink">{project.name}</h3>
              <span className="font-mono text-xs text-indigo-ink">{project.year}</span>
            </div>
            <p className="mb-4 max-w-2xl text-ink-2">{project.blurb}</p>
            <div className="flex flex-wrap items-center gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-sm border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[0.65rem] text-ember"
                >
                  {tech}
                </span>
              ))}
              {project.href && (
                <a
                  href={project.href}
                  className="ml-auto font-mono text-xs text-indigo-ink underline underline-offset-4 transition-colors hover:text-ember"
                >
                  View source →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
