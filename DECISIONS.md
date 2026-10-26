# Decisions

## 2026-10-26 — Simplify studio controls and add social links

**Decision:** Remove the reset-camera, pan/rotate, and day/night buttons from the studio corner. Keep mute and the four-dot menu. Add always-visible GitHub, LinkedIn, and X links (URLs live in `lib/site.ts`). Bound the camera look-at so pan cannot send the room off-screen. Default to daylight; night-mode wiring and unused night styles are gone.

**Options considered:**
- Keep all five round buttons as they were.
- Remove the three buttons but keep a reset so visitors can recover a lost view.
- Remove the three buttons and constrain the camera target to the room’s bounds.

**Chosen and why:** Remove three, bound the camera. Owner request 2026-10-26.

**How to reverse:** revert the PR.

## 2026-10-25 — og:video ripple portrait

**Decision:** `og:video` is the ripple portrait (espresso `#3B2A20` on flat white `#E6D6C0`), shipped as `public/og/ripple-portrait-v1.mp4`. `og:image` / `twitter:image` are a matching still (frame 135 of the same clip).

**Options considered:** room drift, ink-line wordmark, orbit illustration, and palettes (black on cream, red, teal, cream on black, six softer inks).

**Chosen and why:** Rahul picked it in chat.

**How to reverse:** revert this PR, or swap the file and the metadata URL.
