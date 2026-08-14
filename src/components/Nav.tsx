const LINKS = [
  { href: "#building", label: "Building" },
  { href: "#work", label: "Work" },
  { href: "#training", label: "Training" },
  { href: "#riding", label: "Riding" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night/80 backdrop-blur">
      <ul className="mx-auto flex max-w-5xl gap-5 overflow-x-auto px-5 py-3 font-mono text-[0.68rem] tracking-[0.16em] text-indigo-ink uppercase sm:px-8">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              className="whitespace-nowrap transition-colors hover:text-ember"
              href={link.href}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
