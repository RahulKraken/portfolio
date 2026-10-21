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
