# Interactive workspace brief

## Direction

A creative, polished personal site, playful and credible enough to share on
LinkedIn or X. Express Rahul through his belongings and interests, without
depending on a large collection of design projects.

Rahul's strongest reference is https://henryheffernan.com/: an explorable workspace
with objects as navigation. Also liked: the visual richness of ramp.design and
Unseen Studio. Build an original scene, not a copy of another site's assets.

## Scene

- Wooden desk with black legs, monitor, personal laptop connected to the monitor,
  space-grey MacBook Pro for work, rose-gold MacBook Air for personal projects, glass coffee mug, and chair.
- Work laptop opens professional experience and engineering. Existing source:
  `lib/craft.ts`. Confirm current facts and public-disclosure boundaries.
- Personal laptop / monitor opens personal projects. Existing source:
  `lib/products.ts`. Confirm status and links.
- Left of desk: Gen 3 KTM Duke 390 for travel; 2025 Ducati Panigale V2 S for track.
  Duke colour: blue and orange.
- Right: black Fender Stratocaster, white pickguard, maple neck, Boss Katana amp,
  red instrument cable. Pink Floyd listening requested; playback method undecided.
- Separate coffee table: Hario Switch, AeroPress, and various bean bags. Exact
  equipment variants, additional accessories, and beans remain to be confirmed.
- Hanging riding leathers are a potential additional detail, not a settled placement.

Photo references: `IMG_8392.HEIC` (desk), `IMG_8393.HEIC` (guitar/amp), and
`IMG_8394.HEIC` (riding gear). User supplied originals from Downloads; they are
not committed or copied into public assets during repository organization.
Recognizable details matter more than recreating the apartment exactly.

## Lighting and navigation

Proposed starting point: warm daylight. Rahul remains undecided between daylight
and late night. A lamp switching to night is a proposed later interaction.

Objects should respond to hover/tap. Selection moves the camera closer and opens
readable web content, with an obvious return. Make work/contact easy to find;
support touch, keyboard access, reduced motion, and user-initiated audio.

## First milestone

One desk, monitor, two laptops, mug, chair, lighting, and a camera transition into
one laptop containing a readable project page. Start with simple geometry and
validate composition before investing in detailed assets.

Proposed stack: retain Next.js/React/TypeScript; add Three.js, React Three Fiber,
and Drei when implementing. Use GLB models as appropriate. Simple objects can
be code-built; complex assets may use licensed models or tested AI generation.
Manual cleanup/Blender depends on results. Three.js, React Three Fiber, and Drei are installed.

No asset purchase, AI subscription, or external upload has been authorized.

## Remaining inputs

- Personal customizations beyond the confirmed blue/orange Duke.
- Coffee equipment and current bean preferences.
- Public work details and current project links/status.
- Optional ChatGPT memory brief for voice and personal context.
- Feedback on the actual prototype before settling its visual finish.

## Version one implemented

The room is built from original Three.js geometry, with no downloaded or paid
models. It includes both bikes, two laptops and monitor, Strat and amp, brew
station, chair, plants, window, and desk lamp. These are stylized approximations,
not exact product replicas. The bikes especially remain candidates for better assets.

All six destinations open readable native-dialog panels. The monitor also opens
projects. A daylight/night button and clickable lamp change the lighting.
Optional guitar audio is a synthesized chord; Pink Floyd opens through Spotify.
No copyrighted recordings are bundled. The scene loads only on the client, renders
on demand, and has direct navigation outside WebGL.

Current work/project copy is reused from the existing repo and still needs Rahul’s
review for currency. Travel content is introductory; no trip histories or lap stats
have been invented. Raw photos were not uploaded to an AI service.

## Version two: space and screen interactions

Rahul approved a small scene floating in empty space, without opening text.
The header, hero copy, destination dock, and footer are removed. The walls,
window, plants, art, and platform are removed so the belongings define the scene.
A first click approaches the desk; clicking a laptop moves the perspective camera
straight onto its screen. Native interactive HTML sits inside each physical
screen on desktop. Personal projects have an index and detail views; work uses
the existing engineering content. Escape / the back arrow returns to the desk,
then to the distant opening. An icon menu appears after entering, with a separate
keyboard navigation path. Phone screens open a readable computer overlay.

Models remain original procedural geometry. Laptops now have individual keys,
speaker grilles, bezels, hinges, and trackpads. Other objects keep their existing
content dialogs and simplified models for the next visual review. No source or
assets from Henry Heffernan's repository were copied; it was inspected only as
a reference for camera staging and screen interaction concepts.

Daylight remains the default; the lamp or sun icon switches to night. The blank
opening is intentional. Loading is indicated by a small spinner; browser
accessibility labels remain available without adding visible landing-page copy.

## Version three: floor-plan arrangement

The user supplied a top-down sketch. Ducati and KTM now sit parallel along the
left side, Ducati outermost and KTM nearer the desk, with their length running
front to back. A freestanding rail of stylized riding leathers and a two-level
helmet shelf sit beside the Ducati. The chair faces the desk directly. Guitar
and amp sit to the desk's right, angled inward. The coffee table sits much farther
right and forward, perpendicular to the desk with its shelves facing the room.

Shared layout coordinates drive both object placement and camera destinations.
The distant opening remains; the first click now approaches a wider exploration
view that keeps every object available to click. Laptop camera framing remains
unchanged. Gear opens the existing track section. All added geometry is original.

## Object inspection cameras

Each non-computer destination now has a separate approach direction and framing
size. Guitar uses a front-facing view aligned with its inward rotation; bikes
use a front/side angle; coffee approaches its inward-facing shelves. Distance
adapts to viewport aspect ratio. Transitions are quicker. Camera controls remain
active on selected objects: drag to orbit, wheel to dolly, right-drag to pan, or
switch the toolbar to pan mode. Touch supports one-finger orbit and two-finger
pinch/pan. Reset returns to the selected object's intended view. Orbit can circle
the object but stops above the ground. Laptop reading views retain fixed cameras.

Automatic modal dialogs no longer cover or disable the scene. Other destinations
use an optional collapsed information card; opening it leaves the rest of the
scene interactive. Dragging over interactive objects does not activate their
click actions.

Follow-up fixes: one-finger touch was mapped to camera-controls' ZOOM flag (32) rather
than TOUCH_ROTATE (64) in this library version, so phone drags zoomed instead of orbiting;
the scene now uses named action constants. The closest zoom on a selected object stops
before the camera enters it. The Ducati is approached from a high front three-quarter so
neither the gear rail nor the Duke blocks it.

## Version four: generated models

The procedural stand-ins are replaced by image-to-3D meshes in `public/models/`
(fal.ai: Hunyuan 3D Pro for most objects, Meshy 7.1 multi-image for the KTM, helmet and
boots). Bikes, guitar, amp and riding gear come from official product photos of the actual
gear; the desk, chair, monitor and laptops from generated reference images. Sources and raw
outputs live in the git-ignored `references/3d/`. Each mesh is simplified and
WebP/meshopt-compressed with glTF-Transform (about 0.4–1.6 MB each; 1024 px textures except
the bikes, helmet and laptops).

`Model` fits each mesh to a footprint, so the floor plan and cameras are unchanged except
for one deliberate fix: the bikes and riding gear were drawn about 0.6× the desk's scale;
everything now shares the desk's (1.28 units = 75 cm), with the Ducati and gear rail moved
outward and the bike close-ups widened. Laptop and monitor screens are pinned to each lid's
measured front plane, over a flat bezel that hides the generated glass. A locally generated
room environment lights the PBR materials. Coffee table models are pending review.

## Version five: the desk set in code

Direction (2026-10-21): stylized like a toy diorama, smooth and soft-edged, but never at
the cost of fine detail. Large surfaces are smoothed; small parts stay present and crisp.

The desk set is now built in code at true scale (1 m ≈ 1.7 units) instead of from generated
meshes, whose thin parts melted: `components/room/DeskSet.tsx`, with shared primitives in
`components/room/parts.tsx`. It includes an oak top with procedural grain on a steel apron
and legs; a 27" monitor with vented housing, stand cut-out and cables; a 14" MacBook Pro
(every key in the Mac layout, black keyboard well, speaker grilles, ports, hinge, camera)
and the rose-gold M1 MacBook Air (wedge body, half-height function row); a glass mug with
coffee; a notebook and pen; the lamp; and a mesh-back office chair. Interactive screens are
placed from each lid's exact pose (`laptopScreen`), which the camera rig shares.

In development, `window.__room` (camera controls) and `window.__draw()` allow placing the
camera precisely from the console when inspecting details.

## The music corner in code

The Strat and the Katana are also built in code (`components/room/MusicSet.tsx`). The
guitar's body, pickguard and headstock outlines are traced from Fender's front product
photo (`scripts/trace-strat.mjs` → `components/room/strat.ts`), scaled from the fret-dot
spacing so the nut-to-saddle distance is exactly the 25.5" scale. On top of the traced
shapes sit the parts that matter up close: a tapering C-profile maple neck, 22 frets placed
by the equal-temperament formula, dot and side-dot inlays, three cream pickups with
staggered pole pieces, fluted knobs printed 0–10, the five-way switch, bent-steel saddles,
the tremolo arm, the football jack, six tuners with keys, the string tree and six strings
of real gauge running through the body to the posts. The Katana (47 × 41 × 23.8 cm) has its
labelled top panel with controls placed from Boss's top-down photo, strap handle, corner
guards and piped grille. One cable runs from the guitar's jack to the amp's input.

## Version six: bikes and riding gear at full generation quality

The Ducati, KTM 390 Duke, Arai helmet, Laguna Seca suit and Supertech R Vented boots are
Rodin Gen-2.5 generations at the model's top settings (Extreme-High tier, micro detail, HD
texture pass, 4K PBR maps, 2M triangles), each from one run on the sharpest official product
photos available. They are used as generated: the only edits are colour grades on the paint
(texture de-lighting leaves it pale) and, for the bikes, a mapping that puts the axles on the
real wheelbase and tyre sizes. Earlier attempts at cutting the generated bikes apart and
rebuilding the bodywork in code are gone; they read as patchwork. Originals, inputs, request
IDs and the processing scripts live in `references/3d/_generated/` (not in git).

The web copies are decimated with meshoptimizer 1.3's attribute-aware simplifier (Permissive
across UV seams, geometric error under 0.1 % of each object): bikes 550k triangles with 4K
maps, helmet, suit and boots 150–250k with 2K maps. Frame time on the M-series Mac dropped
from ~27 ms with the full meshes to ~10 ms.

The floor plan follows Rahul's sketch, scaled by the desk: the two bikes side by side at the
back left, angled toward the desk, each on its own pit mat (Ducati Corse, and a KTM one). The
Ducati stands on front and rear paddock stands (`TrackCorner`), the KTM on an orange rear stand
under its swingarm bobbins (`KtmCorner`). The leathers rail and the helmet-and-boots table stand
in front of them; the guitar corner is at the back right and the coffee station forward right.

## Version seven: real content in the panels

Panels show what each thing is, with as little copy as possible. The work laptop is the CV
(`lib/resume.ts`, no phone number). The Ducati panel has the onboard video from the Madras
International Circuit (540p, 17 MB, downloaded only when played) and a strip of trackside
photos; the coffee panel has Rahul's own brewing photos. Photos and video stay inside the
panel: no lightbox, no fullscreen, no pinch zoom. Web copies are resized to 1800 px with all
metadata stripped (the phone photos were geotagged); originals live in `references/incoming/`
(not in git).

Sound: a generative ambient pad (`components/room/ambient.ts`) starts on entering, with a mute
button in the corner controls. The guitar opens Spotify's "This Is Pink Floyd" playlist in
Spotify's own embed, which handles the licensing (full tracks for signed-in visitors, previews
otherwise). Spotify and the onboard video each hold the ambience off while they play, only one
of them plays at a time, and the corner button silences everything.

Portrait phones get their own establishing view, looking down the room from the coffee end,
so the whole studio fills the screen.
