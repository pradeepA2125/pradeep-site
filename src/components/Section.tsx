import type { ReactNode } from "react";
import type { SectionMeta } from "../content.types";
import { useReveal } from "../hooks/useReveal";

interface Props {
  id: string;
  meta: SectionMeta;
  children: ReactNode;
  /** Extra classes on the outer section (full-bleed backgrounds etc.). */
  className?: string;
}

/**
 * Journal-page section: a waypoint header — mono index, hairline, eyebrow —
 * over the display title. The waypoint motif is what threads the page into
 * one route instead of a stack of unrelated blocks.
 */
export default function Section({ id, meta, children, className = "" }: Props) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`relative mx-auto w-full max-w-6xl px-5 py-24 transition-all duration-700 sm:px-8 sm:py-28 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      <div className="mb-3 flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-ember">
          WP·{meta.waypoint}
        </span>
        {/* Leg line: draws away from the waypoint index on arrival — each
            header re-plots the route. Reduced motion renders it already
            drawn (revealed starts true, transitions killed globally). */}
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
      {meta.title && (
        <h2 className="mb-10 text-[clamp(2rem,6vw,3.4rem)] leading-none">
          {meta.title}
        </h2>
      )}
      {children}
    </section>
  );
}
