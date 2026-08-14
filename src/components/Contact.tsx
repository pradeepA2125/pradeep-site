import { site } from "../content";
import Section from "./Section";

export default function Contact() {
  const { email, links } = site.contact;

  return (
    <div className="relative overflow-hidden">
      <Section id="contact" meta={site.sections.contact}>
        <a
          href={email}
          className="font-display text-[clamp(1.5rem,5.5vw,3rem)] font-bold tracking-tight break-all text-ember underline decoration-ember/40 underline-offset-8 transition-colors hover:decoration-ember"
        >
          {email.replace("mailto:", "")}
        </a>
        <ul className="mt-10 flex flex-wrap gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-block rounded-full border border-white/15 px-5 py-2 font-mono text-sm text-indigo-ink transition-colors hover:border-ember hover:text-ember"
              >
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-20 font-mono text-xs text-indigo-ink/60">
          {site.name} · {site.location}
        </p>
      </Section>

      {/* Closing echo of the hero: a static ridge silhouette under the footer. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 w-full opacity-60"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 L0 18 L9 13 L16 17 L26 10 L37 16 L48 9 L58 15 L70 8 L82 14 L92 10 L100 15 L100 30 Z"
          fill="#2a2140"
          opacity="0.45"
        />
        <path
          d="M0 30 L0 24 L12 19 L24 23 L38 17 L52 22 L66 16 L80 21 L100 18 L100 30 Z"
          fill="#0b0918"
        />
      </svg>
    </div>
  );
}
