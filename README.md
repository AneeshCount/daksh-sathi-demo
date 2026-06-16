# Daksh Sathi — Customer PWA Demo (pre-award sample)

A runnable slice of the Phase 2 deliverable, built to show the look-and-feel and the
PWA "Add to Home Screen" behaviour the brief calls for.

## What it demonstrates
- **Premium Urban-Company/Ola-grade UI** in React + Tailwind, brand-matched to the V33 docs (dark emerald + Platinum gold).
- **All 33 service channels** rendered from the 11-11-11 matrix, filterable by vertical.
- **Masonry portfolio grid** — verified green badges, ratings, credentials (all education levels), work-gallery panels.
- **Platinum CEO theming** — gold crown badge + emerald accent on qualifying partners.
- **Targeted video flag** — only Doctor / Agri / CA / Legal show the "Video Consult" (WebRTC) badge.
- **Hybrid-map hint** — each vertical surfaces its map mode ("Live moving map" / "2 KM away" / "Video").
- **Installable PWA** — manifest + service worker + an "Add to Home Screen" prompt wired to `beforeinstallprompt`.

## Run it
```bash
npm install
npm run dev      # open the printed localhost URL
# or a production preview:
npm run build && npm run preview
```

## Notes
- Work-gallery images are coloured placeholders — production wires them to `portfolio_media` (see `../02-database/schema.sql`).
- Service worker is minimal; production would use Workbox / `vite-plugin-pwa` for precaching.
- Bundle is ~49 KB gzipped JS — tuned for a Hostinger VPS / static host per the brief.
