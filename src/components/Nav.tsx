import { site } from "../content";
import { handleAnchorClick } from "../lib/scrollToAnchor";

// Derived, not copy: the monogram always tracks the name in content.ts.
const monogram = site.name
  .split(" ")
  .map((w) => w[0])
  .join("");

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:gap-6 sm:px-8">
        <a
          href="#top"
          aria-label={site.name}
          className="font-display text-sm font-bold tracking-tight text-ink transition-colors hover:text-ember"
        >
          {monogram}
          <span aria-hidden="true" className="text-ember">
            .
          </span>
        </a>
        <ul className="flex gap-3.5 overflow-x-auto font-mono text-[0.66rem] tracking-[0.1em] text-indigo-ink uppercase sm:gap-5 sm:tracking-[0.16em]">
          {site.ui.navLinks.map((link) => (
            <li key={link.href}>
              <a
                className="whitespace-nowrap transition-colors hover:text-ember"
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
