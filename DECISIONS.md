# Decisions

## 2026-10-26 — Simplify studio controls and add social links

**Decision:** Remove the reset-camera, pan/rotate, and day/night *buttons* from the studio corner. Keep mute and the four-dot menu. Add always-visible GitHub, LinkedIn, and X links (URLs live in `lib/site.ts`). Bound the camera look-at so pan cannot send the room off-screen. Night mode stays reachable in-world by clicking the desk lamp (pointer cursor, skip-nav toggle); daylight is still the default. There is no corner sun/moon button.

**Options considered:**
- Keep all five round buttons as they were.
- Remove the three buttons but keep a reset so visitors can recover a lost view.
- Remove the three buttons and constrain the camera target to the room’s bounds; drop night mode entirely.
- Remove the three corner buttons, bound the camera, and keep lamp-click night (owner follow-up 2026-10-26).

**Chosen and why:** Remove three corner buttons, bound the camera, keep the lamp. Owner request 2026-10-26, then restore lamp-click night the same day.

**How to reverse:** revert the PR.

## 2026-10-25 — og:video ripple portrait

**Decision:** `og:video` is the ripple portrait (espresso `#3B2A20` on flat white `#E6D6C0`), shipped as `public/og/ripple-portrait-v1.mp4`. `og:image` / `twitter:image` are a matching still (frame 135 of the same clip).

**Options considered:** room drift, ink-line wordmark, orbit illustration, and palettes (black on cream, red, teal, cream on black, six softer inks).

**Chosen and why:** Rahul picked it in chat.

**How to reverse:** revert this PR, or swap the file and the metadata URL.

## 2026-10-31 — Canonical host is www

**Decision:** `site.url` is `https://www.rahulkraken.com`. Each indexable page sets its own `alternates.canonical` and `openGraph.url`. Sitemap locs and `robots.txt` Sitemap follow `site.url`. The root layout does not set a canonical (that would pin every page to home).

**Options considered:**
- Keep the apex as the canonical host and hope crawlers follow the 307.
- Put a single canonical in `app/layout.tsx`.
- Per-page self-canonicals on www, matching the live apex→www redirect.

**Chosen and why:** Apex already 307s to www, so every apex URL in robots/sitemap/og was a redirect. Next 16 replaces nested `openGraph` objects, so pages spread `openGraphSite` from `lib/site.ts` and only override `url` (and the page description where it differs).

**How to reverse:** revert the PR.

## 2026-10-31 — /notes noindex and out of sitemap while empty; /cv.pdf noindex while placeholder; /ride in sitemap

**Decision:** `/notes` is `noindex, follow` and omitted from the sitemap until the first note ships. `/cv.pdf` gets `X-Robots-Tag: noindex` while it is still the placeholder PDF. `/ride` is in the sitemap. `lastModified` on sitemap entries is 2026-10-31.

**Options considered:**
- Leave `/notes` in the sitemap with description “Notes.”
- Remove `/notes` from the site until it has content.
- Index `/cv.pdf` as-is.
- Keep `/ride` out of the sitemap.

**Chosen and why:** `/notes` is “Nothing here yet.” and `/cv.pdf` is a placeholder that includes private contact details; neither should be indexed. `/ride` is a real 200 page that was missing from the sitemap.

**How to reverse:** revert the PR.

## 2026-10-31 — Crawlable links and SR-only room copy on home

**Decision:** Add `/ride` and `/list-100` as `next/link` entries in the existing focus-revealed `.studio-accessibility` nav. SSR a `.sr-only` section after the h1 with `resume.headline` and each `roomItems` title/intro. Map Nav hashes (`/#built`, `/#track`, …) to `select()` once the scene is ready. JSON-LD `WebSite` + `Person` on `/`. No `/notes` link while that page is noindex.

**Options considered:**
- Add Ride / List 100 to the visible studio menu and corner controls.
- Write new crawler-only copy.
- Leave in-scene destinations as buttons only.

**Chosen and why:** The accessible nav already SSR’s and only appears on keyboard focus, so crawlers get real `<a href>` without a visual redesign. The sr-only section repeats copy already shown in the panels. Hash mapping makes the existing Nav and `/track` redirects land on a room item.

**How to reverse:** revert the PR.

## 2026-10-31 — Touch polish

**Decision:** Gate unwrapped `:hover` in `room.css` to `@media (hover: hover) and (pointer: fine)`. Global `touch-action: manipulation` and transparent tap highlight on interactive elements; `user-select: none` on buttons and summaries. Pressed `:active` states reuse hover colours. 44px min-height on `.studio-menu` items, `.nav-mark`, `.menu a`, and `.ride-end a`. `viewportFit: "cover"` plus `env(safe-area-inset-*)` on fixed/corner UI.

**Options considered:**
- Leave hover stickiness on touch and skip safe-area until a notched-phone bug report.
- Change visible layout or colours to enlarge targets.
- Ship `viewport-fit=cover` without inset offsets (clips corner UI on notched phones).

**Chosen and why:** CSS-only, no visual change on desktop (env() is 0). Hover-only on fine pointers stops sticky hover on phones. Cover and insets must ship together.

**How to reverse:** revert the PR.
