# Personal site — design

**Date:** 2026-08-14
**Owner:** Pradeep Kumar
**Status:** approved (structure, visual direction, stack, hosting)

## 1. Purpose

A single-page personal site whose job is inbound: someone arriving from LinkedIn, GitHub,
or a referral should read Pradeep as a credible senior AI engineer within one screen, and
remember him well enough to make contact within one scroll.

It is a personal site about both the person and the work — not a portfolio, not a CV in
HTML, not a blog.

**Audience,** in priority order:

1. Hiring managers and engineers at AI-native companies (India market)
2. Recruiters sourcing AI Engineer roles
3. Peers who arrive from Crucible

**Success criteria.** A visitor can state, unprompted: what he builds, that he has shipped
something substantial independently, and one thing about him that is not engineering.

**Why it exists.** Applications are not converting (under 100, passive, via LinkedIn; the
interviews that did happen came from other channels). Inbound is the working channel, and
there is currently nothing to send people to. Crucible has 0 stars and the GitHub profile
surfaces Udacity coursework above it.

## 2. Governing idea

> "Engineering is a major part of my life, but it isn't my entire identity."

The site is one integrated thesis rather than a professional page with a hobbies footer:
deliberate practice across domains. A 120k-LOC coding agent, six days a week of MMA, a
170 kg RDL, and a KTM pointed at a mountain road are the same instinct in different
arenas.

**The single risk this creates, and the mitigation.** An integrated life-thesis can read as
unfocused to a conservative reviewer. Mitigated by ordering: the hero carries feeling, but
the very next section is hard evidence. Life sections sit *after* proof, never before it.

## 3. Visual direction — "Dusk Horizon"

A mountain road at last light: cinematic, atmospheric, in motion. Chosen over a
topographic and a blueprint direction because it is the most memorable, and memorability
is what drives inbound.

**Deliberately unlike Crucible's site.** Crucible is a dark violet "void" space metaphor
(`#08051a`, Space Grotesk, film grain, nebulae). This site shares neither its palette,
its typeface, nor its metaphor, so the two never read as one template. It may share
build tooling and the `content.ts` discipline.

### Tokens

Single committed dark theme. No light variant — the direction is inherently dark, and a
light inversion would not hold. Every colour is painted explicitly so the page never
borrows a host background.

| Token | Value | Role |
|---|---|---|
| `--color-night` | `#141225` | page ground |
| `--color-dusk` | `#2A2140` | raised surface |
| `--color-rose` | `#7A3A4E` | horizon mid-band |
| `--color-ember` | `#E8623C` | accent — the only saturated colour |
| `--color-indigo-ink` | `#8390BE` | nav, secondary labels |
| `--color-ink` | `#F2EDE8` | primary text |
| `--color-ink-2` | `#B4B0C8` | body text |

Boldness is spent on ember alone; everything else stays quiet. The KTM's factory orange
sits close to `--color-ember`, so the bike photograph reinforces the accent rather than
competing with it.

### Type

Three roles, self-hosted (no CDN, no silent fallback), `font-display: swap`:

- **Display** — a heavy, tightly-tracked grotesk for headlines. Not Space Grotesk
  (Crucible uses it) and not Inter.
- **Body** — a humanist sans, comfortable at 16–18 px, running text near 65 characters.
- **Utility** — a mono for numbers, labels, and the evidence strip, with
  `font-variant-numeric: tabular-nums`.

Exact families are chosen at implementation; the roles and constraints are fixed here.

## 4. Content architecture

One scrolling page, seven sections, in this order:

| # | Section | Carries |
|---|---|---|
| 1 | **Hero** | Train photo, name, thesis line. Feeling. |
| 2 | **Evidence** | 6 years · 120k-LOC open source · 5,000+ users · USD 534K influenced |
| 3 | **Building** | Crucible (links out to its own site), Ask-Git, watsonx Orchestrate agents |
| 4 | **Work** | IBM / Infilect / Drishte, condensed, plus the resume PDF |
| — | *Interstitial* | Full-width pivot from proof to person: the thesis in his own words, over the stump photograph. Not a nav destination. |
| 5 | **Training** | MMA six days a week; RDL 170, squat 130, bench 90 |
| 6 | **Riding** | KTM 390 Adventure, road trips, Ooty |
| 7 | **Contact** | email, GitHub, LinkedIn |

**Ordering is load-bearing.** Evidence at position 2 is what makes the emotional hero
affordable. Do not move life sections above work.

**Crucible links out.** It has its own site; this page gives it a strong card and sends
people there. No deep-dive page here — that would duplicate and then diverge.

## 5. Photography

Four supplied photographs, each with a defined role:

| Asset | Role | Notes |
|---|---|---|
| Nilgiri Mountain Railway (leaning from train) | **Hero** | Warm light, motion, genuine expression. Grades naturally toward ember. |
| KTM 390 Adventure | Riding | **Number plate must be cropped or blurred** before publication. |
| Kranos MMA team | Training | Group shot — reads as "the gym is real", not "this is me training". Contains eight other identifiable people; publish only if Pradeep is comfortable. |
| Meditating on a stump | Thesis interstitial, between Work and Training | Carries the "still figuring it out" register and pivots the page from proof to person. |

**Grading is mandatory and consistent.** The source photographs are bright, saturated
daylight greens; the palette is deep indigo and ember. Ungraded they will punch holes in
the page. Treatment: lifted blacks, cooled shadows, warm highlights, reduced green
saturation — applied to all four so they read as one set. Expect the forest greens to
shift noticeably; this is intended.

**Gap:** no solo training photograph exists. The group shot stands in. Not blocking;
replace when one exists.

## 6. Technical architecture

React + Vite + Tailwind v4, deployed to Cloudflare Pages — the same toolchain as the
Crucible landing, so there is one mental model and nothing new to learn.

### Components

```
src/
  content.ts          <- every string, number, and asset path
  App.tsx
  components/
    Nav.tsx
    Hero.tsx
    Evidence.tsx
    Building.tsx
    Work.tsx
    Interstitial.tsx
    Training.tsx
    Riding.tsx
    Contact.tsx
  index.css           <- @theme tokens
public/
  resume.pdf          <- generated from resume.tex
  img/                <- graded photography
```

**`content.ts` is the single source of content.** Every headline, bullet, number, link,
and asset path lives there; components read from it and contain no copy. Updating the
site — a new lift PR, a new project, a job change — must never require opening a
component. This is the one architectural rule to defend.

### Motion

- Hero horizon parallax on scroll (transform only, no layout thrash)
- Section reveal on first intersection via `IntersectionObserver`, once, never repeating
- Nothing autoplaying, no motion libraries
- All of it disabled under `prefers-reduced-motion: reduce`

### Accessibility and performance

- Mobile-first; most LinkedIn traffic arrives on a phone
- Semantic landmarks, one `h1`, visible keyboard focus states
- Contrast checked against `--color-night` for every text token
- Photographs served as sized, compressed WebP with explicit `width`/`height` to prevent
  layout shift; descriptive `alt` text on all four

### Hosting

- New public GitHub repo
- Cloudflare Pages, auto-deploy on push to `main`
- `*.pages.dev` subdomain — **no custom domain.** A domain can be attached later with no
  structural change.

## 7. Testing

Component unit tests are deliberately out of scope. On a static single-page site with no
logic branches, they would test the framework rather than the product. What actually
protects this site, run in CI on every push:

1. **Build passes** — `vite build` with TypeScript strict
2. **Link check** — every external link resolves; a dead GitHub or LinkedIn URL must never
   ship
3. **Lighthouse budget** — performance and accessibility thresholds enforced

Plus one manual check before first publish: the page opened on a real phone.

## 8. Out of scope

No blog. No CMS. No contact form (a `mailto:` link — forms need a backend and spam
handling). No analytics in v1. No Crucible deep-dive. No light theme. No i18n.

## 9. Open items

1. Solo training photograph — replace the group shot when one exists.
2. Confirm publication of the Kranos team photo given the other people in frame.
3. Exact display/body/utility typeface selection at implementation time.
