import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

interface Props {
  id: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
}

export default function Section({ id, title, eyebrow, children }: Props) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`mx-auto w-full max-w-5xl px-5 py-20 transition-all duration-700 sm:px-8 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {eyebrow && (
        <p className="mb-2 font-mono text-xs tracking-[0.18em] text-ember uppercase">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="mb-8 text-3xl sm:text-4xl">{title}</h2>}
      {children}
    </section>
  );
}
