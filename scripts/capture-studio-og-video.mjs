#!/usr/bin/env node
/**
 * Deterministic OG video of the workbench-staged studio.
 *
 * Staging and camera knobs are the PR #14 workbench still (layout `g`): objects
 * are moved only inside this script, then restored never — the live room is
 * unchanged. Frame 0 uses that still's eye/look/FOV so the switch from
 * og:image to og:video does not jump. The same crop that produced
 * app/opengraph-image.jpg is applied to every frame.
 *
 * Usage (dev server on :3000):
 *   npm run capture:og-video
 *
 * Writes public/og/studio-loop-v1.mp4
 *   1200×630, 30 fps, ~6 s seamless loop, H.264 High, yuv420p, no audio, faststart
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_MP4 = join(ROOT, "public/og/studio-loop-v1.mp4");
const FRAME_DIR = "/tmp/studio-og-video-frames";
const CHROME = "/usr/bin/google-chrome-stable";

const W = 2400;
const H = 1260;
const FPS = 30;
const DURATION = 6;
const FRAMES = Number(process.env.OG_FRAMES) || FPS * DURATION;
// PR #14 final crop of g.png before it was resized to 2400×1260
const CROP = { x: 64, y: 130, w: 2152, h: 1130 };
const DEST = { w: 1200, h: 630 };

// Bootstrap pin so idle orbit never starts. Overwritten after staging.
const BOOT_CAM = "0,2.72,8,0,1.6,-0.7";

// Layout `g` from the PR #14 capture script (the chosen workbench still).
const WORKBENCH = {
  fov: 34,
  eyeY: 2.58,
  lookY: 1.08,
  fill: 0.85,
  span: 0.93,
  panX: -0.18,
  desk: [0, 0, -0.4],
  chair: [0.05, 0, -1.65],
  chairRotY: Math.PI,
  ducati: [-2.2, -0.005, -2.15],
  ducatiYaw: 0.95,
  duke: [-2.5, -0.005, -3.05],
  dukeYaw: 0.9,
  leathers: [-3.65, -0.04, 0.85],
  table: [-3.0, -0.04, 1.05],
  music: [2.45, 0.585, 0.55],
  musicYaw: -0.95,
  coffee: [2.05, 0, -1.15],
};

// Logged eye after PR #14's setLookAt; look recomputed from the same bbox formula.
const PINNED_EYE = [-0.236, 2.58, 8.506];
const PINNED_LOOK = [-0.1528, 1.08, -1.45];

const chromeArgs = [
  "--headless=new",
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--hide-scrollbars",
  "--mute-audio",
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
  "--enable-webgl",
  "--enable-webgl2",
  "--disable-gpu-sandbox",
  `--window-size=${W},${H}`,
];

function poseAt(t, home) {
  // t in [0, 1). Cosine pulse: rest on the OG still, a gentle push/arc along
  // the desk past coffee toward the Strat, then back. u is never negative, so
  // the camera never trucks left of home — bikes stay at the edge.
  const u = 0.5 - 0.5 * Math.cos(2 * Math.PI * t);
  const arc = Math.sin(Math.PI * u);
  return {
    eye: [
      home.eye[0] + 0.2 * u + 0.05 * arc,
      home.eye[1],
      home.eye[2] - 0.38 * u,
    ],
    look: [
      home.look[0] + 0.32 * u,
      home.look[1] + 0.03 * u,
      home.look[2] + 0.16 * u,
    ],
  };
}

async function waitForServer(url, ms = 120000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.ok || (res.status >= 300 && res.status < 500)) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`dev server did not start: ${url}`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: chromeArgs,
});

const page = await browser.newPage({
  viewport: { width: W, height: H, deviceScaleFactor: 1 },
});
page.setDefaultTimeout(180000);

const origin = process.env.OG_CAPTURE_ORIGIN ?? "http://localhost:3000";
await waitForServer(origin);
console.log("loading studio…");
await page.goto(`${origin}/?cam=${BOOT_CAM}&capture=1`, {
  waitUntil: "domcontentloaded",
});
await page.waitForFunction(
  () =>
    document.querySelector("canvas") &&
    !document.querySelector(".studio-loader") &&
    window.__scene &&
    window.__room &&
    window.__render,
  { timeout: 180000, polling: 500 },
);
console.log("loader gone");
await page.waitForTimeout(1200);

await page.evaluate(() => {
  const style = document.createElement("style");
  style.textContent = `
    .skip, .studio-controls, .studio-menu, .studio-accessibility,
    .studio-loader, .cursor, nextjs-portal, [data-next-badge-root],
    [data-nextjs-toast], [data-nextjs-dev-overlay] {
      display: none !important; visibility: hidden !important; pointer-events: none !important;
    }
    html, body, .room-experience, .room-scene { margin: 0 !important; cursor: none !important; }
    body { overflow: hidden !important; }
  `;
  document.documentElement.appendChild(style);
});

const home = await page.evaluate((layout) => {
  const scene = window.__scene;
  const near = (o, x, z, tol = 0.25) =>
    Math.abs(o.position.x - x) < tol && Math.abs(o.position.z - z) < tol;
  let room = null;
  scene.traverse((o) => {
    if (!room && Math.abs(o.position.y + 0.08) < 0.002 && o.children.length >= 8)
      room = o;
  });
  if (!room) throw new Error("room group not found");
  const grab = (x, z, key) => {
    const hit = room.children.find((c) => near(c, x, z));
    if (!hit) throw new Error("missing " + key);
    return hit;
  };
  const ducati = grab(-5.85, 2.25, "ducati");
  const duke = grab(-6.1, -0.1, "duke");
  const music = grab(3.05, 0.05, "music");
  const objs = {
    desk: grab(0, -0.7, "desk"),
    chair: grab(0.12, 1.05, "chair"),
    ducati,
    duke,
    leathers: grab(-8.5, 4.7, "leathers"),
    table: grab(-7.1, 4.75, "table"),
    music,
    coffee: grab(5.16, 3.0, "coffee"),
    ducatiYaw: ducati.children[0],
    dukeYaw: duke.children[0],
    musicYaw: music.children[0],
  };

  objs.desk.position.set(...layout.desk);
  objs.chair.position.set(...layout.chair);
  objs.chair.rotation.y = layout.chairRotY;
  objs.ducati.position.set(...layout.ducati);
  objs.duke.position.set(...layout.duke);
  objs.leathers.position.set(...layout.leathers);
  objs.table.position.set(...layout.table);
  objs.music.position.set(...layout.music);
  objs.coffee.position.set(...layout.coffee);
  objs.ducatiYaw.rotation.y = layout.ducatiYaw;
  objs.dukeYaw.rotation.y = layout.dukeYaw;
  objs.musicYaw.rotation.y = layout.musicYaw;
  room.updateMatrixWorld(true);

  const boxOf = (obj) => {
    let minx = Infinity,
      miny = Infinity,
      minz = Infinity,
      maxx = -Infinity,
      maxy = -Infinity,
      maxz = -Infinity;
    obj.traverse((o) => {
      if (!o.isMesh || !o.geometry) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const b = o.geometry.boundingBox;
      if (!b) return;
      const e = o.matrixWorld.elements;
      for (const x of [b.min.x, b.max.x]) {
        for (const y of [b.min.y, b.max.y]) {
          for (const z of [b.min.z, b.max.z]) {
            const wx = e[0] * x + e[4] * y + e[8] * z + e[12];
            const wy = e[1] * x + e[5] * y + e[9] * z + e[13];
            const wz = e[2] * x + e[6] * y + e[10] * z + e[14];
            if (wx < minx) minx = wx;
            if (wy < miny) miny = wy;
            if (wz < minz) minz = wz;
            if (wx > maxx) maxx = wx;
            if (wy > maxy) maxy = wy;
            if (wz > maxz) maxz = wz;
          }
        }
      }
    });
    return { minx, miny, minz, maxx, maxy, maxz };
  };

  let uminx = Infinity,
    umaxx = -Infinity,
    uminz = Infinity,
    umaxz = -Infinity;
  for (const [k, o] of Object.entries(objs)) {
    if (k.endsWith("Yaw")) continue;
    const b = boxOf(o);
    if (b.minx < uminx) uminx = b.minx;
    if (b.maxx > umaxx) umaxx = b.maxx;
    if (b.minz < uminz) uminz = b.minz;
    if (b.maxz > umaxz) umaxz = b.maxz;
  }

  const cx = (uminx + umaxx) / 2;
  const cz = (uminz + umaxz) / 2;
  const spanX = (umaxx - uminx) * (layout.span || 1);
  const cam = window.__room.camera;
  cam.fov = layout.fov;
  cam.zoom = 1;
  cam.updateProjectionMatrix();
  const hfov2 = Math.atan(cam.aspect * Math.tan((layout.fov * Math.PI) / 360));
  const dist = spanX / 2 / (layout.fill * Math.tan(hfov2));
  const eyeZ = Math.max(umaxz + dist * 0.9, cz + dist);
  const pan = layout.panX || 0;
  const computedEye = [cx * 0.1 + pan, layout.eyeY, eyeZ];
  const computedLook = [
    cx * 0.08 + pan * 0.6,
    layout.lookY,
    Math.min(cz, layout.desk[2]),
  ];
  window.__ogHome = { eye: computedEye, look: computedLook, fov: layout.fov };
  window.__ogStage = objs;
  return {
    computedEye,
    computedLook,
    spanX,
    aspect: cam.aspect,
    uminx,
    umaxx,
    uminz,
    umaxz,
    cx,
    cz,
  };
}, WORKBENCH);

console.log("workbench staged", JSON.stringify(home, null, 2));

// Pin the logged PR #14 pose so frame 0 matches the committed still. The
// computed numbers are logged as a sanity check; they should be close.
const HOME = { eye: PINNED_EYE, look: PINNED_LOOK, fov: WORKBENCH.fov };
console.log("using pinned home", HOME);

rmSync(FRAME_DIR, { recursive: true, force: true });
mkdirSync(FRAME_DIR, { recursive: true });
mkdirSync(join(ROOT, "public/og"), { recursive: true });

const canvas = page.locator("canvas").first();

for (let i = 0; i < FRAMES; i++) {
  const t = i / FRAMES;
  const pose = poseAt(t, HOME);
  await page.evaluate(
    async ({ eye, look, fov, time }) => {
      const controls = window.__room;
      const cam = controls.camera;
      cam.fov = fov;
      cam.zoom = 1;
      cam.updateProjectionMatrix();
      await controls.setLookAt(
        eye[0],
        eye[1],
        eye[2],
        look[0],
        look[1],
        look[2],
        false,
      );
      // CameraControls keeps spherical state until update(); __render
      // bypasses the R3F loop, so we flush it ourselves.
      controls.update(1);
      cam.fov = fov;
      cam.updateProjectionMatrix();
      cam.updateMatrixWorld(true);
      const canvasEl = document.querySelector("canvas");
      const r3f = canvasEl?.__r3f;
      const state = r3f?.root?.getState?.() ?? r3f?.getState?.();
      if (state?.clock) {
        state.clock.elapsedTime = time;
        state.clock.oldTime = time * 1000;
      }
      window.__render();
    },
    { eye: pose.eye, look: pose.look, fov: HOME.fov, time: i / FPS },
  );
  const buf = await canvas.screenshot({ type: "png" });
  writeFileSync(
    join(FRAME_DIR, `frame_${String(i).padStart(4, "0")}.png`),
    buf,
  );
  if (i % 30 === 0 || i === FRAMES - 1) {
    console.log(`frame ${i + 1}/${FRAMES}`);
  }
}

await browser.close();

console.log("encoding…");
await run("ffmpeg", [
  "-y",
  "-framerate",
  String(FPS),
  "-i",
  join(FRAME_DIR, "frame_%04d.png"),
  "-vf",
  `crop=${CROP.w}:${CROP.h}:${CROP.x}:${CROP.y},scale=${DEST.w}:${DEST.h}`,
  "-c:v",
  "libx264",
  "-profile:v",
  "high",
  "-pix_fmt",
  "yuv420p",
  "-crf",
  "23",
  "-preset",
  "slow",
  "-an",
  "-movflags",
  "+faststart",
  OUT_MP4,
]);

console.log("wrote", OUT_MP4);
