import { useEffect, useRef, useState } from "react";
import { site } from "../content";
import { useFocusArrival } from "../hooks/useFocusArrival";
import Section from "./Section";
import { subscribeScroll } from "../lib/scrollDriver";

/**
 * The route so far: roles hang off a vertical line with waypoint dots,
 * newest at the top — a timeline drawn like a climbing route.
 *
 * The ember line is scroll-linked: it draws down the timeline as you
 * descend, its tip tracking ~70% viewport height, and each waypoint dot
 * ignites as the line reaches it. Under reduced motion the route renders
 * fully drawn and every dot lit — the finished map, no animation.
 */
export default function Work() {
  const routeRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const [litCount, setLitCount] = useState(0);
  const [activeStop, setActiveStop] = useState(-1);
  const { ref: focusRef, focused } = useFocusArrival<HTMLDivElement>();

  useEffect(() => {
    const container = routeRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "scaleY(1)";
      setLitCount(site.roles.length);
      setActiveStop(site.roles.length - 1);
      return;
    }

    const stops = Array.from(
      container.querySelectorAll<HTMLElement>("[data-route-stop]"),
    );

    return subscribeScroll(() => {
      // One rect read per frame; every write below is transform/state only,
      // so layout stays clean across the whole scroll frame.
      const rect = container.getBoundingClientRect();
      const tip = window.innerHeight * 0.7 - rect.top; // px into the route
      const progress = Math.min(Math.max(tip / rect.height, 0), 1);
      line.style.transform = `scaleY(${progress})`;

      let lit = 0;
      for (const stop of stops) {
        // offsetParent is the (relative) container, so offsetTop is route-local
        if (stop.offsetTop + 12 <= tip) lit += 1;
      }
      // Functional update bails out when unchanged — at most 3 re-renders
      // across the entire scroll through this section.
      setLitCount((prev) => (prev === lit ? prev : lit));
      setActiveStop((prev) => (prev === lit - 1 ? prev : lit - 1));
    });
  }, []);

  return (
    <Section id="work" meta={site.sections.work}>
      <div ref={focusRef}>
        <div
          ref={routeRef}
          className="relative flex flex-col gap-12 border-l border-white/10 pl-7 sm:pl-10"
        >
        {/* the travelled part of the route, drawn over the faint full line */}
        <span
          ref={lineRef}
          aria-hidden="true"
          className="absolute top-0 -left-px h-full w-px origin-top bg-gradient-to-b from-ember/80 via-ember/60 to-ember/30"
          style={{ transform: "scaleY(0)" }}
        />
          {site.roles.map((role, i) => {
            const active = focused && (activeStop === i || (activeStop < 0 && i === 0));
            return (
              <article
                key={`${role.org}-${role.startYear}`}
                data-route-stop
                className={`relative rounded-r-md py-1 pr-4 transition-[background-color,box-shadow,opacity,transform] duration-700 ${
                  active
                    ? "focus-arrival translate-x-1 bg-ember/5 shadow-[inset_2px_0_0_rgba(232,98,60,0.80),0_14px_32px_-26px_rgba(232,98,60,0.70)]"
                    : "opacity-80"
                }`}
              >
            {/* waypoint dot — ignites as the route line reaches it */}
            <span
              aria-hidden="true"
              className={`absolute top-2 -left-7 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 bg-night transition-[border-color,box-shadow] duration-500 sm:-left-10 ${
                i < litCount
                  ? "border-ember shadow-[0_0_10px_rgba(232,98,60,0.55)]"
                  : "border-white/25"
              }`}
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
            );
          })}
        </div>
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
