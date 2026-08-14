# pradeep-site

Personal site — [spec](docs/superpowers/specs/2026-08-14-personal-site-design.md) ·
[plan](docs/superpowers/plans/2026-08-14-personal-site.md).

React 19 + Vite 8 + Tailwind v4, deployed to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev
```

## Content

**All copy, numbers, links, and asset paths live in `src/content.ts`.**
Never put a user-visible string in a component — updating the site should never
mean opening one.

Section order is load-bearing: Hero → Evidence → Building → Work → Interstitial
→ Training → Riding → Contact. The life sections never move above the work.

## Photos

Source images are **not** committed (`assets-src/` is gitignored) — they are
large, and `bike-original.jpg` contains an unredacted registration plate.

```bash
# assets-src/{train,bike-original,mma,stump}.jpg
npm run redact    # blurs the plate  -> assets-src/bike.jpg
npm run photos    # grades + resizes -> public/img/*.webp
```

The dusk grade cools shadows and warms highlights. Do not reach for sharp's
`.tint()` — it greyscales before tinting and destroys the source colour.

## Checks

```bash
npm run test         # content integrity
npm run check:links  # external link health
npm run lint
npm run build
```

`scripts/shoot.mjs` renders full-page screenshots to `/tmp` and audits for
horizontal overflow. Run `npm run preview` in another shell first.
