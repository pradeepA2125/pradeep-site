import { useEffect, useState } from "react";

/**
 * Count-up for the evidence metrics.
 *
 * content.ts stays the single source of truth: the hook receives the final
 * display string ("5,000+", "$534K", "6 yrs"), animates only the digits,
 * and always lands on the exact original string. Parsing/formatting are
 * exported pure so the round-trip is unit-tested against the real metrics.
 */

export interface ParsedMetricValue {
  prefix: string;
  target: number;
  suffix: string;
  /** Re-insert thousands separators iff the original had them. */
  useGrouping: boolean;
}

export function parseMetricValue(value: string): ParsedMetricValue | null {
  const match = /^([^0-9]*)([\d,]+)([\s\S]*)$/.exec(value);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const target = Number.parseInt(digits.replaceAll(",", ""), 10);
  if (!Number.isFinite(target)) return null;
  return { prefix, target, suffix, useGrouping: digits.includes(",") };
}

export function formatMetricValue(parsed: ParsedMetricValue, n: number): string {
  const digits = parsed.useGrouping ? n.toLocaleString("en-US") : String(n);
  return `${parsed.prefix}${digits}${parsed.suffix}`;
}

const DURATION_MS = 1100;

/**
 * Returns the string to render. Idle: the final value (tiles are opacity-0
 * until revealed, so nothing shows early). When `active` flips true the
 * digits run 0 → target with a cubic ease-out, then snap to the original
 * string verbatim. Reduced motion never animates — final value only.
 */
export function useCountUp(value: string, active: boolean): string {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parsed = parseMetricValue(value);
    if (!parsed || parsed.target === 0) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      if (t >= 1) {
        setDisplay(value); // land on the source string exactly
        return;
      }
      const eased = 1 - (1 - t) ** 3;
      setDisplay(formatMetricValue(parsed, Math.round(parsed.target * eased)));
      raf = requestAnimationFrame(tick);
    };
    setDisplay(formatMetricValue(parsed, 0));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return display;
}
