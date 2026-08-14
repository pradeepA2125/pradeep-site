import { describe, it, expect } from "vitest";
import { site } from "./content";

const isHttps = (h: string) => /^https:\/\//.test(h);

describe("site content", () => {
  it("has no empty strings anywhere", () => {
    const walk = (v: unknown, path: string): string[] => {
      if (typeof v === "string") return v.trim() === "" ? [path] : [];
      if (Array.isArray(v)) return v.flatMap((x, i) => walk(x, `${path}[${i}]`));
      if (v && typeof v === "object")
        return Object.entries(v).flatMap(([k, x]) => walk(x, `${path}.${k}`));
      return [];
    };
    expect(walk(site, "site")).toEqual([]);
  });

  it("exposes exactly four metrics", () => {
    expect(site.metrics).toHaveLength(4);
  });

  it("uses https for every external link", () => {
    const hrefs = [
      ...site.contact.links.map((l) => l.href),
      ...site.projects.flatMap((p) => (p.href ? [p.href] : [])),
    ];
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((h) => expect(isHttps(h)).toBe(true));
  });

  it("uses a mailto address for contact", () => {
    expect(site.contact.email).toMatch(/^mailto:/);
  });

  it("gives every photo alt text and intrinsic dimensions", () => {
    const photos = [
      site.hero.photo,
      site.interstitial.photo,
      site.training.photo,
      site.riding.photo,
    ];
    photos.forEach((p) => {
      expect(p.alt.trim().length).toBeGreaterThan(10);
      expect(p.width).toBeGreaterThan(0);
      expect(p.height).toBeGreaterThan(0);
      expect(p.src.endsWith(".webp")).toBe(true);
    });
  });

  it("keeps roles in reverse-chronological order", () => {
    const starts = site.roles.map((r) => r.startYear);
    expect([...starts].sort((a, b) => b - a)).toEqual(starts);
  });
});
