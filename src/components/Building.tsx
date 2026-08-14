import { site } from "../content";
import { useFocusArrival } from "../hooks/useFocusArrival";
import Section from "./Section";

/**
 * The first project is the flagship and gets the big card — an ember-washed
 * feature panel. The rest sit in a two-up grid below it.
 */
export default function Building() {
  const [flagship, ...rest] = site.projects;
  const { ref: flagshipRef, focused } = useFocusArrival<HTMLElement>();

  return (
    <Section id="building" meta={site.sections.building}>
      <article
        ref={flagshipRef}
        className={`group relative overflow-hidden rounded-lg border bg-gradient-to-br from-dusk/60 via-night to-night p-7 transition-[border-color,box-shadow,transform] duration-700 hover:border-ember/50 sm:p-10 ${
          focused
            ? "focus-arrival border-ember/70 shadow-[0_20px_80px_-34px_rgba(232,98,60,0.68)]"
            : "border-ember/25"
        }`}
      >
        {/* quiet ember glow pooling in the corner, brightening on hover */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-ember/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 ${
            focused ? "opacity-100" : "sm:opacity-60"
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute top-0 left-8 h-px w-20 bg-gradient-to-r from-transparent via-ember to-transparent transition-opacity duration-700 ${
            focused ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {flagship.name}
            </h3>
            <span className="font-mono text-xs text-indigo-ink">{flagship.year}</span>
          </div>
          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            {flagship.blurb}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {flagship.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-sm border border-ember/30 bg-ember/10 px-2.5 py-1 font-mono text-[0.68rem] text-ember"
              >
                {tech}
              </span>
            ))}
            {flagship.href && (
              <a
                href={flagship.href}
                className="ml-auto font-mono text-sm text-ember underline underline-offset-4 transition-opacity hover:opacity-75"
              >
                {site.ui.viewSource}
              </a>
            )}
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((project) => (
          <article
            key={project.name}
            className="rounded-lg border border-white/10 bg-dusk/25 p-6 transition-colors duration-300 hover:border-ember/40"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl text-ink">{project.name}</h3>
              <span className="font-mono text-xs text-indigo-ink">{project.year}</span>
            </div>
            <p className="mb-5 text-ink-2">{project.blurb}</p>
            <div className="flex flex-wrap items-center gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-sm border border-white/15 px-2 py-0.5 font-mono text-[0.65rem] text-indigo-ink"
                >
                  {tech}
                </span>
              ))}
              {project.href && (
                <a
                  href={project.href}
                  className="ml-auto font-mono text-xs text-indigo-ink underline underline-offset-4 transition-colors hover:text-ember"
                >
                  {site.ui.viewSource}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
