# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page personal site for Pradeep Kumar at a `*.pages.dev` URL that reads as a credible senior AI engineer within one screen and is memorable within one scroll.

**Architecture:** React 19 + Vite 8 + Tailwind v4 (`@theme` tokens, no config file), deployed to Cloudflare Pages. One scrolling page of presentational components that read every string, number, and asset path from a single `content.ts` module. Photography is pre-processed by a Node script into graded, sized WebP. Tests cover content integrity and link health, not component rendering.

**Tech Stack:** React 19.2 · Vite 8.1 · TypeScript 6.0 · Tailwind CSS 4.3 (`@tailwindcss/vite`) · Vitest 3 · sharp 0.34 · oxlint · Cloudflare Pages · GitHub Actions

## Global Constraints

Every task's requirements implicitly include this section.

- **Repo:** `~/projects/pradeep-site` (already initialised, `main`, spec committed at `dca38e3`).
- **Single dark theme only.** No light variant, no `prefers-color-scheme` block, no `data-theme`. Paint `body` background explicitly from a token.
- **Palette — use these exact values, no others:** `--color-night: #141225` · `--color-dusk: #2A2140` · `--color-rose: #7A3A4E` · `--color-ember: #E8623C` · `--color-indigo-ink: #8390BE` · `--color-ink: #F2EDE8` · `--color-ink-2: #B4B0C8`.
- **Ember is the only saturated colour.** Do not introduce a second accent.
- **Typefaces:** Archivo (display), Source Sans 3 (body), IBM Plex Mono (utility). Self-hosted via `@fontsource*` npm packages — never a CDN `<link>`.
- **`content.ts` is the single source of content.** No component may contain a user-visible string, number, or asset path. This is the rule to defend; a reviewer should reject any task that violates it.
- **Section order is load-bearing:** Hero → Evidence → Building → Work → Interstitial → Training → Riding → Contact. Life sections never move above work.
- **Mobile-first.** Design at 390 px wide, enhance upward.
- **All motion disabled under `prefers-reduced-motion: reduce`.**
- **No component unit tests** (spec §7). Tests cover `content.ts` integrity and link health only.
- **Every image** ships as WebP with explicit `width`/`height` attributes and non-empty `alt`.
- **Commit after every task** using `type(scope): description` (feat/fix/chore/docs/test/refactor).

**Prerequisite before Task 3:** the four source photographs must be placed in `assets-src/` as `train.jpg`, `bike.jpg`, `mma.jpg`, `stump.jpg`. **`bike.jpg` must already have the number plate cropped or blurred by hand before it is committed** — the pipeline does not redact it.

---

## File Structure

| Path | Responsibility |
|---|---|
| `package.json`, `vite.config.ts`, `tsconfig*.json` | Build tooling |
| `index.html` | Document shell, meta/OG tags |
| `src/main.tsx` | React entry |
| `src/index.css` | `@theme` tokens, font faces, base element styles |
| `src/content.ts` | **Every string, number, link, asset path** |
| `src/content.types.ts` | Interfaces for the content module |
| `src/content.test.ts` | Content integrity tests |
| `src/App.tsx` | Section composition order |
| `src/components/Nav.tsx` | Fixed minimal nav |
| `src/components/Hero.tsx` | Train photo, headline, horizon parallax |
| `src/components/Evidence.tsx` | Four-metric strip |
| `src/components/Building.tsx` | Project cards |
| `src/components/Work.tsx` | Role timeline + resume link |
| `src/components/Interstitial.tsx` | Thesis quote over stump photo |
| `src/components/Training.tsx` | MMA + lifts |
| `src/components/Riding.tsx` | KTM + trips |
| `src/components/Contact.tsx` | Email + links + footer |
| `src/components/Section.tsx` | Shared section shell + scroll reveal |
| `src/hooks/useReveal.ts` | IntersectionObserver reveal hook |
| `scripts/process-photos.mjs` | Grade + resize + WebP |
| `scripts/check-links.mjs` | Link health checker |
| `.github/workflows/ci.yml` | Build + lint + test + links + Lighthouse |
| `public/resume.pdf` | Copied from `~/projects/resume/resume.pdf` |
| `public/img/*.webp` | Pipeline output (committed) |

---

### Task 1: Scaffold, tokens, and typography

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.gitignore` (exists — extend)

**Interfaces:**
- Consumes: nothing
- Produces: a building, deployable shell painting `--color-night` with all three fonts loaded and all seven palette tokens defined.

- [ ] **Step 1: Initialise the project**

```bash
cd ~/projects/pradeep-site
npm init -y
npm pkg set name="pradeep-site" private=true type="module" version="0.0.0"
npm pkg delete main
npm i react@^19.2.7 react-dom@^19.2.7 tailwindcss@^4.3.2 @tailwindcss/vite@^4.3.2
npm i @fontsource-variable/archivo @fontsource-variable/source-sans-3 @fontsource/ibm-plex-mono
npm i -D vite@^8.1.1 @vitejs/plugin-react@^6.0.3 typescript@~6.0.2 \
  @types/react@^19.2.17 @types/react-dom@^19.2.3 @types/node@^24.13.2 \
  oxlint@^1.71.0 vitest@^3.2.4
npm pkg set scripts.dev="vite" scripts.build="tsc -b && vite build" \
  scripts.preview="vite preview" scripts.lint="oxlint" scripts.test="vitest run"
```

- [ ] **Step 2: Write `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Write `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

Write `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts", "scripts/**/*.mjs"]
}
```

- [ ] **Step 4: Write `src/index.css` with the exact tokens**

```css
@import "tailwindcss";
@import "@fontsource-variable/archivo";
@import "@fontsource-variable/source-sans-3";
@import "@fontsource/ibm-plex-mono/400.css";

@theme {
  --color-night: #141225;
  --color-dusk: #2a2140;
  --color-rose: #7a3a4e;
  --color-ember: #e8623c;
  --color-indigo-ink: #8390be;
  --color-ink: #f2ede8;
  --color-ink-2: #b4b0c8;

  --font-display: "Archivo Variable", system-ui, sans-serif;
  --font-body: "Source Sans 3 Variable", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-night);
  color: var(--color-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  margin: 0;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 750;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

:focus-visible {
  outline: 2px solid var(--color-ember);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pradeep Kumar — AI Engineer</title>
    <meta name="description" content="AI Engineer in Bengaluru. Agentic systems, retrieval, and the platforms under them. Author of Crucible." />
    <meta property="og:title" content="Pradeep Kumar — AI Engineer" />
    <meta property="og:description" content="Agentic systems, retrieval, and the platforms under them." />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#141225" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Write `src/main.tsx` and a placeholder `src/App.tsx`**

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

```tsx
// src/App.tsx
export default function App() {
  return (
    <main className="min-h-screen bg-night text-ink font-body">
      <h1 className="p-8 text-4xl">Pradeep Kumar</h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify the build passes**

Run: `npm run build`
Expected: exits 0, writes `dist/`.

Run: `npm run dev` and open the local URL.
Expected: near-black indigo (`#141225`) page, "Pradeep Kumar" in a heavy tight grotesk — **not** the browser default. If it looks like Helvetica, the font import failed.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold vite react tailwind with dusk horizon tokens"
```

---

### Task 2: Content module and integrity tests

**Files:**
- Create: `src/content.types.ts`, `src/content.ts`, `src/content.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `site` object (default export shape below) imported by every component and by `scripts/check-links.mjs`. Exact type names other tasks rely on: `Metric`, `Project`, `Role`, `Lift`, `NamedLink`, `Photo`, `SiteContent`.

- [ ] **Step 1: Write the failing test**

```ts
// src/content.test.ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/content.test.ts`
Expected: FAIL — cannot resolve `./content`.

- [ ] **Step 3: Write `src/content.types.ts`**

```ts
export interface Metric { value: string; label: string }
export interface Project { name: string; blurb: string; href?: string; stack: string[]; year: string }
export interface Role { title: string; org: string; period: string; startYear: number; points: string[] }
export interface Lift { name: string; value: string }
export interface NamedLink { label: string; href: string }
export interface Photo { src: string; alt: string; width: number; height: number }

export interface SiteContent {
  name: string;
  tagline: string;
  location: string;
  hero: { headline: string; body: string; photo: Photo };
  metrics: Metric[];
  projects: Project[];
  roles: Role[];
  resumeHref: string;
  interstitial: { quote: string; attribution: string; photo: Photo };
  training: { heading: string; body: string; lifts: Lift[]; photo: Photo };
  riding: { heading: string; body: string; photo: Photo };
  contact: { heading: string; email: string; links: NamedLink[] };
}
```

- [ ] **Step 4: Write `src/content.ts`**

```ts
import type { SiteContent } from "./content.types";

export const site: SiteContent = {
  name: "Pradeep Kumar",
  tagline: "AI Engineer",
  location: "Bengaluru, India",

  hero: {
    headline: "Still figuring it out,\nat speed.",
    body: "I get deeply interested in things and learn by building them. Right now that means agentic systems and retrieval — and six days a week on the mats.",
    photo: {
      src: "/img/train.webp",
      alt: "Pradeep leaning out of the window of the Nilgiri Mountain Railway as it climbs through forest toward Ooty",
      width: 1600,
      height: 2133,
    },
  },

  metrics: [
    { value: "6 yrs", label: "building production AI" },
    { value: "120k", label: "lines of open source shipped" },
    { value: "5,000+", label: "users on systems I built" },
    { value: "$534K", label: "customer revenue influenced" },
  ],

  projects: [
    {
      name: "Crucible",
      blurb:
        "An agentic coding assistant for VS Code. A FastAPI orchestrator runs ReAct tool loops against isolated shadow workspaces, a Rust indexer builds an LSP-resolved symbol graph across six languages, and a memory layer compacts context and recalls across sessions.",
      href: "https://github.com/pradeepA2125/crucible",
      stack: ["Python", "TypeScript", "Rust", "MCP"],
      year: "2026",
    },
    {
      name: "Ask-Git",
      blurb:
        "Conversational code intelligence over Git history — commits, file-level changes, and pull-request metadata across multiple repositories. Adopted into IBM's Client Engineering enablement accelerators.",
      stack: ["LangChain", "Vector search", "GitHub API"],
      year: "2025",
    },
    {
      name: "watsonx Orchestrate agents",
      blurb:
        "A portfolio of production agents: a LangGraph natural-language-to-SQL tool, a vision-language document extractor, and a call-transcript analyzer producing structured insight across six dimensions.",
      stack: ["LangGraph", "watsonx", "VLMs"],
      year: "2025",
    },
  ],

  roles: [
    {
      title: "Lead Engineer",
      org: "IBM",
      period: "Feb 2024 — Present",
      startYear: 2024,
      points: [
        "Architected 3+ enterprise RAG systems serving 5,000+ users across finance, HR, and energy.",
        "Technical Lead on the Rogers engagement — deployed Cloud Pak for Data and IBM Knowledge Catalog onto customer-managed OpenShift.",
        "Influenced USD 534K in customer revenue across three strategic engagements.",
      ],
    },
    {
      title: "Senior AI Engineer",
      org: "Infilect",
      period: "Sep 2021 — Feb 2024",
      startYear: 2021,
      points: [
        "Led six end-to-end AI deployments for global FMCG clients.",
        "Built computer vision systems for Share-of-Shelf and On-Shelf Availability analytics.",
      ],
    },
    {
      title: "Computer Vision Engineer",
      org: "Drishte",
      period: "Oct 2020 — Sep 2021",
      startYear: 2020,
      points: [
        "Built tracking, detection, and re-identification models for crowd analytics.",
        "Deployed to Jetson Nano and edge devices with TensorRT and OpenVINO.",
      ],
    },
  ],

  resumeHref: "/resume.pdf",

  interstitial: {
    quote:
      "Engineering is a major part of my life. It isn't my entire identity.",
    attribution: "Which is the whole point of the rest of this page.",
    photo: {
      src: "/img/stump.webp",
      alt: "Pradeep sitting cross-legged on a fallen tree trunk in dense green forest",
      width: 1600,
      height: 1500,
    },
  },

  training: {
    heading: "Training",
    body: "MMA six days a week — striking, wrestling, and Brazilian jiu-jitsu — alongside structured strength work. I care about what the body can actually do, not just what it looks like.",
    lifts: [
      { name: "RDL", value: "170 kg" },
      { name: "Squat", value: "130 kg" },
      { name: "Bench", value: "90 kg" },
      { name: "Press", value: "60 kg" },
    ],
    photo: {
      src: "/img/mma.webp",
      alt: "Pradeep with training partners and coaches on the mats at Kranos MMA in Bengaluru",
      width: 1600,
      height: 1200,
    },
  },

  riding: {
    heading: "Riding",
    body: "A KTM 390 Adventure and a preference for mountain roads. Long rides are how I get away from screens — Bengaluru to Ooty and back, exploring rather than sightseeing.",
    photo: {
      src: "/img/bike.webp",
      alt: "Pradeep sitting on his orange and black KTM 390 Adventure under pine trees",
      width: 1200,
      height: 2133,
    },
  },

  contact: {
    heading: "Get in touch",
    email: "mailto:pradeepkumar94p@gmail.com",
    links: [
      { label: "GitHub", href: "https://github.com/pradeepA2125" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/pradeepk21" },
      { label: "Crucible", href: "https://github.com/pradeepA2125/crucible" },
    ],
  },
};
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/content.test.ts`
Expected: 6 passed.

- [ ] **Step 6: Commit**

```bash
git add src/content.ts src/content.types.ts src/content.test.ts
git commit -m "feat: add content module with integrity tests"
```

---

### Task 3: Photography pipeline

**Files:**
- Create: `scripts/process-photos.mjs`
- Create (output, committed): `public/img/{train,bike,mma,stump}.webp`

**Interfaces:**
- Consumes: `assets-src/{train,bike,mma,stump}.jpg` (supplied by hand; `bike.jpg` already redacted)
- Produces: WebP files at the exact paths and dimensions declared in `src/content.ts`.

- [ ] **Step 1: Confirm the source photos exist and the plate is redacted**

Run: `ls -la assets-src/`
Expected: four `.jpg` files.

Open `assets-src/bike.jpg` and confirm the registration number is not legible. **Stop and fix by hand if it is** — the pipeline does not redact.

- [ ] **Step 2: Install sharp**

```bash
npm i -D sharp@^0.34.2
npm pkg set scripts.photos="node scripts/process-photos.mjs"
```

- [ ] **Step 3: Write `scripts/process-photos.mjs`**

The grade: lift blacks, cool the shadows, warm the highlights, pull green saturation down so the daylight forest greens sit inside the indigo/ember palette.

```js
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/img";

/** width, height must match src/content.ts exactly. */
const JOBS = [
  { in: "assets-src/train.jpg", out: "train.webp", width: 1600, height: 2133 },
  { in: "assets-src/bike.jpg",  out: "bike.webp",  width: 1200, height: 2133 },
  { in: "assets-src/mma.jpg",   out: "mma.webp",   width: 1600, height: 1200 },
  { in: "assets-src/stump.jpg", out: "stump.webp", width: 1600, height: 1500 },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  await sharp(job.in)
    .resize(job.width, job.height, { fit: "cover", position: "attention" })
    // pull the daylight greens back so they stop fighting the palette
    .modulate({ saturation: 0.72 })
    // cool the shadows, warm the highlights — the dusk grade
    .tint({ r: 246, g: 236, b: 232 })
    .linear(1.06, -6)
    .webp({ quality: 82, effort: 5 })
    .toFile(`${OUT}/${job.out}`);
  console.log(`graded ${job.out} (${job.width}x${job.height})`);
}
```

- [ ] **Step 4: Run the pipeline**

Run: `npm run photos`
Expected: four `graded …` lines; `ls -la public/img/` shows four `.webp` files, each well under 400 KB.

- [ ] **Step 5: Verify the grade visually**

Open `public/img/train.webp`. The greens must read muted and slightly warm, not vivid daylight. If they still look raw, lower `saturation` toward `0.6`; if the photo looks grey and lifeless, raise it toward `0.85`. Re-run and re-check.

- [ ] **Step 6: Commit**

```bash
git add scripts/process-photos.mjs public/img package.json package-lock.json
git commit -m "feat: add photo grading pipeline and graded webp assets"
```

---

### Task 4: Section shell and reveal hook

**Files:**
- Create: `src/hooks/useReveal.ts`, `src/components/Section.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `useReveal(): { ref, revealed }` and `<Section id title children eyebrow? />`, both used by Tasks 5–9.

- [ ] **Step 1: Write `src/hooks/useReveal.ts`**

```ts
import { useEffect, useRef, useState } from "react";

/** Reveals once on first intersection. Never re-hides. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return { ref, revealed };
}
```

- [ ] **Step 2: Write `src/components/Section.tsx`**

```tsx
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
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-ember">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="mb-8 text-3xl sm:text-4xl">{title}</h2>}
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/hooks src/components/Section.tsx
git commit -m "feat: add section shell and scroll reveal hook"
```

---

### Task 5: Nav and Hero

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Hero.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `site.name`, `site.tagline`, `site.location`, `site.hero` from Task 2
- Produces: nothing other tasks consume.

- [ ] **Step 1: Write `src/components/Nav.tsx`**

```tsx
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
      <ul className="mx-auto flex max-w-5xl gap-5 overflow-x-auto px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-indigo-ink sm:px-8">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a className="whitespace-nowrap transition-colors hover:text-ember" href={l.href}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Write `src/components/Hero.tsx`**

Horizon parallax uses `transform` only. The photo sits behind a dusk gradient so the headline stays legible.

```tsx
import { useEffect, useState } from "react";
import { site } from "../content";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setOffset(Math.min(window.scrollY * 0.25, 140));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { headline, body, photo } = site.hero;

  return (
    <header className="relative flex min-h-[92svh] items-end overflow-hidden">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.12)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-night/85 via-night/55 to-night"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ember/25 via-rose/10 to-transparent"
      />
      <div className="relative mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-ember">
          {site.tagline} · {site.location}
        </p>
        <h1 className="mb-5 whitespace-pre-line text-[clamp(2.4rem,9vw,4.5rem)] leading-[0.98]">
          {headline}
        </h1>
        <p className="max-w-xl text-lg text-ink-2">{body}</p>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Wire both into `src/App.tsx`**

```tsx
import Nav from "./components/Nav";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`
Expected on a 390 px-wide viewport: the train photo fills the screen, darkened toward the bottom with an ember glow at the horizon; the headline is legible over it; scrolling moves the photo slower than the page.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Hero.tsx src/App.tsx
git commit -m "feat: add nav and hero with horizon parallax"
```

---

### Task 6: Evidence and Building

**Files:**
- Create: `src/components/Evidence.tsx`, `src/components/Building.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `site.metrics`, `site.projects`, `Section` from Task 4
- Produces: nothing other tasks consume.

- [ ] **Step 1: Write `src/components/Evidence.tsx`**

```tsx
import { site } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function Evidence() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`border-y border-white/5 bg-dusk/40 transition-opacity duration-700 ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-12 sm:px-8 lg:grid-cols-4">
        {site.metrics.map((m) => (
          <div key={m.label}>
            <dt className="font-display text-3xl tabular-nums text-ember sm:text-4xl">
              {m.value}
            </dt>
            <dd className="mt-1 text-sm leading-snug text-ink-2">{m.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/Building.tsx`**

```tsx
import { site } from "../content";
import Section from "./Section";

export default function Building() {
  return (
    <Section id="building" eyebrow="What I build" title="Building">
      <div className="flex flex-col gap-8">
        {site.projects.map((p) => (
          <article
            key={p.name}
            className="rounded border border-white/8 bg-dusk/30 p-6 transition-colors hover:border-ember/40"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl text-ink">{p.name}</h3>
              <span className="font-mono text-xs text-indigo-ink">{p.year}</span>
            </div>
            <p className="mb-4 max-w-2xl text-ink-2">{p.blurb}</p>
            <div className="flex flex-wrap items-center gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-sm border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[0.65rem] text-ember"
                >
                  {s}
                </span>
              ))}
              {p.href && (
                <a
                  href={p.href}
                  className="ml-auto font-mono text-xs text-indigo-ink underline underline-offset-4 transition-colors hover:text-ember"
                >
                  View source →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Add both to `src/App.tsx`, in order, after `<Hero />`**

```tsx
import Evidence from "./components/Evidence";
import Building from "./components/Building";
// inside <main>, after <Hero />:
//   <Evidence />
//   <Building />
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: metrics land in two columns on mobile and four on desktop, values in ember with tabular figures; three project cards below.

- [ ] **Step 5: Commit**

```bash
git add src/components/Evidence.tsx src/components/Building.tsx src/App.tsx
git commit -m "feat: add evidence strip and building section"
```

---

### Task 7: Work, resume, and the interstitial

**Files:**
- Create: `src/components/Work.tsx`, `src/components/Interstitial.tsx`
- Create: `public/resume.pdf` (copied)
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `site.roles`, `site.resumeHref`, `site.interstitial`, `Section`
- Produces: nothing other tasks consume.

- [ ] **Step 1: Copy the resume into `public/`**

```bash
cp ~/projects/resume/resume.pdf public/resume.pdf
ls -la public/resume.pdf
```

Expected: a file around 50 KB. If it is missing, rebuild it first: `cd ~/projects/resume && tectonic -X compile resume.tex --outfmt pdf`.

- [ ] **Step 2: Write `src/components/Work.tsx`**

```tsx
import { site } from "../content";
import Section from "./Section";

export default function Work() {
  return (
    <Section id="work" eyebrow="Where I've done it" title="Work">
      <div className="flex flex-col gap-10">
        {site.roles.map((r) => (
          <article key={`${r.org}-${r.startYear}`} className="border-l-2 border-ember/30 pl-5">
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-lg text-ink">{r.title}</h3>
              <span className="font-display text-lg text-ember">{r.org}</span>
            </div>
            <p className="mb-3 font-mono text-xs text-indigo-ink">{r.period}</p>
            <ul className="flex flex-col gap-1.5">
              {r.points.map((p) => (
                <li key={p} className="text-ink-2">{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <a
        href={site.resumeHref}
        className="mt-10 inline-block rounded border border-ember/50 px-5 py-2.5 font-mono text-sm text-ember transition-colors hover:bg-ember/10"
      >
        Full resume (PDF)
      </a>
    </Section>
  );
}
```

- [ ] **Step 3: Write `src/components/Interstitial.tsx`**

```tsx
import { site } from "../content";
import { useReveal } from "../hooks/useReveal";

export default function Interstitial() {
  const { ref, revealed } = useReveal<HTMLElement>();
  const { quote, attribution, photo } = site.interstitial;

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden transition-opacity duration-700 ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/78" />
      <div className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <p className="font-display text-[clamp(1.6rem,5vw,2.6rem)] leading-tight text-ink">
          {quote}
        </p>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-ember">
          {attribution}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add to `src/App.tsx` — `<Work />` then `<Interstitial />`**

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: three roles with ember rules, a working resume button that opens the PDF, then the stump photo heavily darkened behind the thesis quote. The quote must be comfortably readable — if not, raise `bg-night/78` toward `/88`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Work.tsx src/components/Interstitial.tsx src/App.tsx public/resume.pdf
git commit -m "feat: add work timeline, resume, and thesis interstitial"
```

---

### Task 8: Training, Riding, and Contact

**Files:**
- Create: `src/components/Training.tsx`, `src/components/Riding.tsx`, `src/components/Contact.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `site.training`, `site.riding`, `site.contact`, `Section`
- Produces: nothing — this completes the page.

- [ ] **Step 1: Write `src/components/Training.tsx`**

```tsx
import { site } from "../content";
import Section from "./Section";

export default function Training() {
  const { heading, body, lifts, photo } = site.training;
  return (
    <Section id="training" eyebrow="Off the keyboard" title={heading}>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-6 text-ink-2">{body}</p>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2">
            {lifts.map((l) => (
              <div key={l.name} className="rounded border border-white/8 bg-dusk/30 p-3">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-indigo-ink">
                  {l.name}
                </dt>
                <dd className="font-display text-xl tabular-nums text-ink">{l.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="w-full rounded object-cover"
        />
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Write `src/components/Riding.tsx`**

```tsx
import { site } from "../content";
import Section from "./Section";

export default function Riding() {
  const { heading, body, photo } = site.riding;
  return (
    <Section id="riding" eyebrow="Getting away from screens" title={heading}>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="w-full rounded object-cover md:order-last"
        />
        <p className="text-ink-2">{body}</p>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Write `src/components/Contact.tsx`**

```tsx
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
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="font-mono text-sm text-indigo-ink underline underline-offset-4 transition-colors hover:text-ember"
            >
              {l.label} →
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
```

- [ ] **Step 4: Complete `src/App.tsx` in the mandated order**

```tsx
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Evidence from "./components/Evidence";
import Building from "./components/Building";
import Work from "./components/Work";
import Interstitial from "./components/Interstitial";
import Training from "./components/Training";
import Riding from "./components/Riding";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Evidence />
        <Building />
        <Work />
        <Interstitial />
        <Training />
        <Riding />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify the whole page**

Run: `npm run dev`, then scroll the full page at 390 px width.
Expected: eight bands in the order above, no horizontal scrollbar at any width, every nav anchor jumps to its section.

- [ ] **Step 6: Commit**

```bash
git add src/components src/App.tsx
git commit -m "feat: add training, riding, and contact sections"
```

---

### Task 9: Link checker

**Files:**
- Create: `scripts/check-links.mjs`

**Interfaces:**
- Consumes: `site.contact.links`, `site.projects[].href` from Task 2
- Produces: `npm run check:links`, exiting non-zero on any dead link. Used by Task 10's CI.

- [ ] **Step 1: Write `scripts/check-links.mjs`**

```js
import { readFileSync } from "node:fs";

/** Read hrefs straight out of content.ts — no build step, no import of TSX. */
const source = readFileSync("src/content.ts", "utf8");
const urls = [...new Set(source.match(/https:\/\/[^"'\s)]+/g) ?? [])];

if (urls.length === 0) {
  console.error("no external links found in src/content.ts — did the file move?");
  process.exit(1);
}

let failed = 0;
for (const url of urls) {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "link-check" } });
    // LinkedIn answers 999 to non-browser clients; that is not a dead link.
    const ok = res.ok || res.status === 999;
    console.log(`${ok ? "ok  " : "DEAD"} ${res.status} ${url}`);
    if (!ok) failed++;
  } catch (err) {
    console.log(`DEAD err  ${url} — ${err.message}`);
    failed++;
  }
}

console.log(`\n${urls.length - failed}/${urls.length} links healthy`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 2: Register the script**

```bash
npm pkg set scripts."check:links"="node scripts/check-links.mjs"
```

- [ ] **Step 3: Run it**

Run: `npm run check:links`
Expected: every URL prints `ok`, final line `4/4 links healthy` (or however many exist), exit 0.

- [ ] **Step 4: Verify it actually fails on a dead link**

Temporarily add `https://github.com/pradeepA2125/definitely-not-a-real-repo` to `site.contact.links`, re-run, confirm it prints `DEAD 404` and exits 1, then remove it.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-links.mjs package.json
git commit -m "test: add link health checker"
```

---

### Task 10: CI and Cloudflare Pages deploy

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`, `README.md`

**Interfaces:**
- Consumes: `npm run build`, `npm run test`, `npm run lint`, `npm run check:links`
- Produces: a live `*.pages.dev` URL.

- [ ] **Step 1: Write `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 1,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

- [ ] **Step 2: Write `.github/workflows/ci.yml`**

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - run: npm run check:links
      - name: Lighthouse
        run: npx --yes @lhci/cli@0.14.x autorun
```

- [ ] **Step 3: Write `README.md`**

```markdown
# pradeep-site

Personal site — [spec](docs/superpowers/specs/2026-08-14-personal-site-design.md).

## Develop

    npm install
    npm run dev

## Content

**All copy, numbers, links, and asset paths live in `src/content.ts`.**
Never put a user-visible string in a component.

## Photos

Put source images in `assets-src/` (plate on `bike.jpg` redacted by hand first), then:

    npm run photos

## Checks

    npm run test         # content integrity
    npm run check:links  # external link health
    npm run build
```

- [ ] **Step 4: Run the full CI sequence locally**

```bash
npm run lint && npm run test && npm run build && npm run check:links
```

Expected: all four exit 0.

- [ ] **Step 5: Push and connect Cloudflare Pages**

```bash
gh repo create pradeep-site --public --source=. --remote=origin --push
```

Then in the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → select `pradeep-site` → framework preset **Vite**, build command `npm run build`, output directory `dist` → Save and Deploy.

- [ ] **Step 6: Verify the deployed site on a phone**

Open the `*.pages.dev` URL on a real phone. Confirm: no horizontal scroll, the hero photo is sharp, the resume PDF opens, every nav anchor works, and the whole page loads in under three seconds on mobile data.

- [ ] **Step 7: Commit**

```bash
git add .github lighthouserc.json README.md
git commit -m "ci: add build, test, link, and lighthouse checks"
git push
```

---

## Self-Review

**Spec coverage.** §1 purpose → Tasks 5–8 content. §2 governing idea → Task 7 interstitial. §3 tokens and type → Task 1 (exact hex values, three fontsource packages, resolving spec open item 3). §4 all seven sections plus interstitial → Tasks 5–8, order enforced in Task 8 Step 4. §5 photography roles, grading, plate redaction → Task 3 (redaction is a hand step before Step 1, as the pipeline cannot do it). §6 architecture, `content.ts` rule, motion, a11y, hosting → Tasks 1, 2, 4, 5, 10. §7 testing — build, link check, Lighthouse, no component tests → Tasks 9, 10. §8 out of scope — nothing in this plan adds a blog, CMS, form, analytics, or light theme.

**Placeholder scan.** No TBD/TODO. Every code step carries real code. Every verification step names the command and the expected result.

**Type consistency.** `Metric`, `Project`, `Role`, `Lift`, `NamedLink`, `Photo`, `SiteContent` are defined once in Task 2 and used unchanged in Tasks 5–8. `useReveal` returns `{ ref, revealed }` in Task 4 and is destructured that way in Tasks 5–8. Photo dimensions in `content.ts` (Task 2) match `JOBS` in `process-photos.mjs` (Task 3) exactly: train 1600×2133, bike 1200×2133, mma 1600×1200, stump 1600×1500. `site.contact.email` carries the `mailto:` prefix in content and is stripped for display in Task 8.

**Gap found and closed.** The spec's open item 3 (typeface selection) had no owner; Task 1 now fixes Archivo / Source Sans 3 / IBM Plex Mono, all SIL OFL and self-hosted, with IBM Plex Mono deliberately distinct from Crucible's JetBrains Mono.

**Known dependency.** Task 3 cannot start until the four photographs are placed in `assets-src/` with the plate redacted. The solo training photo remains outstanding (spec open item 1); `mma.webp` uses the team shot until it arrives, and swapping it later means replacing one file and one `alt` string.
