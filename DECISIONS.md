# Decisions

## 2026-10-29 — Five Prints chapter routing and content sourcing

**Decision:** Chapters are real App Router routes (`/track`, `/lift`, `/guitar`, `/build`, `/coffee`) rendered as children of a persistent `app/(prints)` layout. The row stays mounted so closing a chapter returns to the same print. Opening uses `router.push`; prev/next uses `replace`; close uses `back()` when the chapter was opened from the row, otherwise `replace("/")`. Shared-element morph uses React `<ViewTransition name={`print-${id}`}>` (crossfade fallback is the browser default). `?p=track` / `?p=0` deep-link the same routes.

**Options considered:**
- Client overlay only (no URL) — the previous placeholder, which could not be shared or refreshed.
- Parallel routes / intercepting routes — more machinery than five static pages.
- Motion FLIP without the View Transitions API — extra dependency; React 19 already ships `ViewTransition`.

**Chosen and why:** Routes + a persistent layout. Shareable, refresh-safe, back-button native, and the row never remounts. Old hash redirects (`/strength`, `/music`, `/building`, `/engineering`) map onto the new chapter paths; `/track` is no longer swallowed by the hash redirect.

**How to reverse:** close the preview PR. Do not merge.

**Content sourcing:** Chapter copy is taken only from already-published repo files (`components/room/content.ts`, `lib/products.ts`, `public/cv.pdf`, existing `/room`). No invented personal facts, numbers, places, or names. Lift has no published copy, so it uses one neutral line and a `TODO(rahul)` in `lib/chapters.ts`.

## 2026-10-29 — Five Prints preview branch

**Decision:** Five Prints preview branch; home route swapped only on this branch; room moved to `/room`; reversible by closing the PR.

**Options considered:**
- Replace production home in place on `main`.
- Keep the 3D studio at `/` and put Five Prints on a side route.
- Ship Five Prints as a preview-only branch with the studio moved, not deleted.

**Chosen and why:** Preview-only. The landing is the experiment; the studio stays reachable. Closing the PR restores `/` to the room.

**How to reverse:** close the PR. Do not merge.

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
