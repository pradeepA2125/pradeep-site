import { describe, it, expect } from "vitest";
import { parseMetricValue, formatMetricValue } from "./useCountUp";
import { site } from "../content";

describe("metric value parsing", () => {
  it("round-trips every real metric in content.ts", () => {
    for (const metric of site.metrics) {
      const parsed = parseMetricValue(metric.value);
      expect(parsed, metric.value).not.toBeNull();
      // Formatting the parsed target must reproduce the source string
      // exactly — the count-up may never land on a rewritten value.
      expect(formatMetricValue(parsed!, parsed!.target)).toBe(metric.value);
      expect(parsed!.target).toBeGreaterThan(0);
    }
  });

  it("handles prefix, grouping, and suffix shapes", () => {
    expect(parseMetricValue("$534K")).toEqual({
      prefix: "$",
      target: 534,
      suffix: "K",
      useGrouping: false,
    });
    expect(parseMetricValue("5,000+")).toEqual({
      prefix: "",
      target: 5000,
      suffix: "+",
      useGrouping: true,
    });
    expect(parseMetricValue("6 yrs")).toEqual({
      prefix: "",
      target: 6,
      suffix: " yrs",
      useGrouping: false,
    });
  });

  it("re-groups intermediate values only when the source grouped", () => {
    const grouped = parseMetricValue("5,000+")!;
    expect(formatMetricValue(grouped, 1234)).toBe("1,234+");
    const plain = parseMetricValue("120k")!;
    expect(formatMetricValue(plain, 87)).toBe("87k");
  });

  it("returns null for digit-free strings", () => {
    expect(parseMetricValue("lots")).toBeNull();
  });
});
