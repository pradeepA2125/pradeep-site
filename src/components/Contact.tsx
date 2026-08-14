import { site } from "../content";
import Section from "./Section";

export default function Contact() {
  const { heading, email, links } = site.contact;

  return (
    <Section id="contact" title={heading}>
      <a
        href={email}
        className="font-display text-[clamp(1.4rem,5vw,2.2rem)] text-ember underline underline-offset-8 transition-opacity hover:opacity-80"
      >
        {email.replace("mailto:", "")}
      </a>
      <ul className="mt-8 flex flex-wrap gap-5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="font-mono text-sm text-indigo-ink underline underline-offset-4 transition-colors hover:text-ember"
            >
              {link.label} →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-16 font-mono text-xs text-indigo-ink/60">
        {site.name} · {site.location}
      </p>
    </Section>
  );
}
