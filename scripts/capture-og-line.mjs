#!/usr/bin/env node
/**
 * Deterministic OG video: one continuous ink line on the site's bone ground.
 *
 * 6.0 s, 1200×630, 30 fps, seamless loop. Silhouettes are suggested, not drawn.
 *
 *   npm run capture:og-line
 *
 * Writes public/og/intro-line-v1.mp4
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_MP4 = join(ROOT, "public/og/intro-line-v1.mp4");
const FRAME_DIR = "/tmp/og-line-frames";
const CHROME = "/usr/bin/google-chrome-stable";

const W = 1200;
const H = 630;
const FPS = 30;
const DURATION = 6;
const FRAMES = Number(process.env.OG_FRAMES) || FPS * DURATION;

// Site serif: Bodoni Moda italic 400 (same cut as `.nav-name`). Latin subset
// inlined so capture does not depend on Google Fonts' UA sniffing.
const BODONI_WOFF2 =
  "https://fonts.gstatic.com/s/bodonimoda/v28/aFTB7PxzY382XsXX63LUYJSPUqb0qojSAq1rZLktbNxSXgM.woff2";
const fontRes = await fetch(BODONI_WOFF2);
if (!fontRes.ok) throw new Error(`bodoni woff2 ${fontRes.status}`);
const BODONI_DATA = `data:font/woff2;base64,${Buffer.from(await fontRes.arrayBuffer()).toString("base64")}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Bodoni Moda";
    font-style: italic;
    font-weight: 400;
    src: url("${BODONI_DATA}") format("woff2");
  }
  html, body { margin: 0; background: #fbf6ec; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="c" width="${W}" height="${H}"></canvas>
<script>
const W = ${W}, H = ${H};
const CX = 600, CY = 318;
const ORIGIN = [500, CY];
const INK = "#111210";
const BONE = "#fbf6ec";
const N = 240;
const LINE = 3.15;

function dist(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpPt(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}
function clamp(t, a, b) {
  return Math.min(b, Math.max(a, t));
}
function smooth(t) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}
function easeOut(t) {
  t = clamp(t, 0, 1);
  return 1 - (1 - t) * (1 - t);
}
function easeIn(t) {
  t = clamp(t, 0, 1);
  return t * t;
}

function polylineLen(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += dist(pts[i - 1], pts[i]);
  return L;
}
function resample(pts, n) {
  if (pts.length === 1) return Array.from({ length: n }, () => pts[0].slice());
  const L = polylineLen(pts);
  if (L < 1e-6) return Array.from({ length: n }, () => pts[0].slice());
  const out = [pts[0].slice()];
  const step = L / (n - 1);
  let i = 1, acc = 0, prev = pts[0];
  for (let k = 1; k < n - 1; k++) {
    const target = k * step;
    while (i < pts.length) {
      const d = dist(prev, pts[i]);
      if (acc + d >= target - 1e-9) {
        const u = d < 1e-9 ? 0 : (target - acc) / d;
        out.push(lerpPt(prev, pts[i], u));
        break;
      }
      acc += d;
      prev = pts[i];
      i++;
    }
  }
  out.push(pts[pts.length - 1].slice());
  return out;
}
function catmull(pts, density) {
  if (pts.length < 2) return pts.map((p) => p.slice());
  const out = [];
  const cr = (p0, p1, p2, p3, t) => {
    const t2 = t * t, t3 = t2 * t;
    return [
      0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
      0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
    ];
  };
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < density; j++) out.push(cr(p0, p1, p2, p3, j / density));
  }
  out.push(pts[pts.length - 1].slice());
  return out;
}

function tautLine() {
  return [ORIGIN.slice(), [CX + 210, CY]];
}
function guitar() {
  const pts = [];
  const x0 = CX - 220, x1 = CX + 230;
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const x = x0 + (x1 - x0) * t;
    const y = CY + 48 * Math.pow(Math.sin(Math.PI * t), 2.15);
    pts.push([x, y]);
  }
  return pts;
}
function racing() {
  // one late-apex corner: long entry, a rounded clip, unwind. not a chicane, not a V.
  return catmull(
    [
      [CX - 250, CY - 46],
      [CX - 120, CY - 28],
      [CX - 20, CY + 36],
      [CX + 55, CY + 78],
      [CX + 108, CY + 74],
      [CX + 188, CY + 4],
      [CX + 252, CY - 50],
    ],
    24,
  );
}
function coffee() {
  const pts = [];
  const top = [CX + 6, CY - 138];
  const meet = [CX, CY + 8];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    pts.push([
      lerp(top[0], meet[0], t) + 10 * Math.sin(t * Math.PI),
      lerp(top[1], meet[1], t),
    ]);
  }
  const r = 62;
  const ccx = CX, ccy = meet[1] + r;
  const a0 = -Math.PI / 2;
  const a1 = a0 + Math.PI * 2.12;
  for (let i = 1; i <= 90; i++) {
    const a = lerp(a0, a1, i / 90);
    pts.push([ccx + r * Math.cos(a), ccy + r * Math.sin(a)]);
  }
  return pts;
}
function barbell() {
  const y = CY;
  const xL = CX - 220, xR = CX + 220;
  const h = 44, g = 22;
  const L0 = xL, L1 = xL + g, R0 = xR - g, R1 = xR;
  return [
    [L0, y - h], [L0, y + h], [L0, y],
    [L1, y], [L1, y - h], [L1, y + h], [L1, y],
    [R0, y], [R0, y + h], [R0, y - h], [R0, y],
    [R1, y], [R1, y + h], [R1, y - h],
  ];
}
function cursor(blink) {
  const x0 = CX - 168, x1 = CX + 72;
  const h = 40 * Math.max(blink, 0);
  return [
    [x0, CY],
    [x1, CY],
    [x1, CY - h],
    [x1, CY + h],
  ];
}
function restLine() {
  return [[CX - 188, CY - 10], [CX + 188, CY - 10]];
}
function originPath() {
  return [ORIGIN.slice(), ORIGIN.slice()];
}

const KEYS = {
  origin: resample(originPath(), N),
  taut: resample(tautLine(), N),
  guitar: resample(guitar(), N),
  racing: resample(racing(), N),
  coffee: resample(coffee(), N),
  barbell: resample(barbell(), N),
  rest: resample(restLine(), N),
};

function mix(a, b, t) {
  const u = smooth(t);
  return a.map((p, i) => lerpPt(p, b[i], u));
}
function cursorMix(blink) {
  return resample(cursor(blink), N);
}
function trim(pts, t) {
  t = clamp(t, 0, 1);
  if (t <= 0) return [pts[0].slice()];
  if (t >= 1) return pts;
  const L = polylineLen(pts);
  const target = L * t;
  const out = [pts[0].slice()];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = dist(pts[i - 1], pts[i]);
    if (acc + d >= target) {
      out.push(lerpPt(pts[i - 1], pts[i], (target - acc) / d));
      return out;
    }
    acc += d;
    out.push(pts[i].slice());
  }
  return out;
}

/*
  0.0–1.0  draw taut line
  1.0–4.5  five silhouettes, 0.7 s each
  4.5–6.0  rest line + wordmark, hold, unwind to origin
*/
const SLOT = 0.7;
const MORPH = 0.34;
const SHAPES = ["guitar", "racing", "coffee", "barbell", "cursor"];

function poseAt(time) {
  let pts;
  let name = 0;
  if (time < 1) {
    pts = trim(KEYS.taut, easeOut(time / 1));
  } else if (time < 4.5) {
    const local = time - 1;
    const i = Math.min(4, Math.floor(local / SLOT));
    const u = local - i * SLOT;
    const prevName = i === 0 ? null : SHAPES[i - 1];
    const prev =
      i === 0
        ? KEYS.taut
        : prevName === "cursor"
          ? cursorMix(1)
          : KEYS[prevName];
    const nextName = SHAPES[i];
    const next = nextName === "cursor" ? cursorMix(1) : KEYS[nextName];
    if (u < MORPH) pts = mix(prev, next, u / MORPH);
    else if (nextName === "cursor") {
      const hold = (u - MORPH) / (SLOT - MORPH);
      const blink = hold % 0.42 < 0.28 ? 1 : 0;
      pts = cursorMix(blink);
    } else pts = next;
  } else {
    const u = time - 4.5;
    // 0–0.42 morph cursor → rest; 0.42–1.02 hold; 1.02–1.5 unwind
    if (u < 0.42) {
      pts = mix(cursorMix(1), KEYS.rest, u / 0.42);
      name = smooth(u / 0.42);
    } else if (u < 1.02) {
      pts = KEYS.rest;
      name = 1;
    } else {
      // reach the origin disc by t=5.90 and hold it so frames 177–179 match frame 0
      const w = clamp((u - 1.02) / 0.38, 0, 1);
      pts = w >= 1 ? [ORIGIN.slice()] : mix(KEYS.rest, KEYS.origin, w);
      name = 1 - smooth(Math.min(1, w / 0.55));
    }
  }
  return { pts, name };
}

function drawPath(ctx, pts, scale) {
  // a collapsed polyline does not stroke in Chromium — draw the same round
  // cap that frame 0 uses, or the loop hitch is a missing origin dot
  const L = pts.length < 2 ? 0 : polylineLen(pts);
  if (pts.length < 2 || L < 0.75) {
    ctx.beginPath();
    ctx.arc(pts[0][0] * scale, pts[0][1] * scale, (LINE * scale) / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(pts[0][0] * scale, pts[0][1] * scale);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * scale, pts[i][1] * scale);
  ctx.stroke();
}

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

window.renderFrame = (frame, frames, scale) => {
  scale = scale || 1;
  const time = (frame / frames) * 6;
  const { pts, name } = poseAt(time);
  ctx.fillStyle = BONE;
  ctx.fillRect(0, 0, W * scale, H * scale);
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = LINE * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  drawPath(ctx, pts, scale);
  if (name > 0.004) {
    ctx.save();
    ctx.globalAlpha = name;
    ctx.font = "italic 400 " + 52 * scale + 'px "Bodoni Moda"';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.letterSpacing = "-0.02em";
    ctx.fillText("Rahul Kumar", CX * scale, (CY + 28) * scale);
    ctx.restore();
  }
};

window.poseAt = poseAt;
window.KEYS = KEYS;
</script>
</body>
</html>`;

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
  args: [
    "--headless=new",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--font-render-hinting=none",
  ],
});

const page = await browser.newPage({
  viewport: { width: W, height: H, deviceScaleFactor: 1 },
});
page.setDefaultTimeout(60000);
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => document.fonts.load('italic 400 52px "Bodoni Moda"'));

rmSync(FRAME_DIR, { recursive: true, force: true });
mkdirSync(FRAME_DIR, { recursive: true });
mkdirSync(join(ROOT, "public/og"), { recursive: true });

const canvas = page.locator("canvas");

if (process.env.OG_PREVIEW) {
  const times = [0, 0.85, 1.5, 2.2, 2.9, 3.6, 4.3, 5.2, 5.95];
  mkdirSync("/tmp/og-line-preview", { recursive: true });
  for (const t of times) {
    const frame = Math.round((t / 6) * 180);
    await page.evaluate(
      ({ frame, frames }) => window.renderFrame(frame, frames, 1),
      { frame, frames: 180 },
    );
    const buf = await canvas.screenshot({ type: "png" });
    writeFileSync(`/tmp/og-line-preview/t${t.toFixed(2).replace(".", "")}.png`, buf);
    console.log("preview", t, "frame", frame);
  }
  await browser.close();
  process.exit(0);
}

console.log(`rendering ${FRAMES} frames…`);
for (let i = 0; i < FRAMES; i++) {
  await page.evaluate(
    ({ frame, frames }) => window.renderFrame(frame, frames, 1),
    { frame: i, frames: FRAMES },
  );
  const buf = await canvas.screenshot({ type: "png", omitBackground: false });
  writeFileSync(join(FRAME_DIR, `frame_${String(i).padStart(4, "0")}.png`), buf);
  if (i % 30 === 0 || i === FRAMES - 1) console.log(`frame ${i + 1}/${FRAMES}`);
}

// Wordmark hold frame at 2400×1260 for a possible later og:image (not committed).
await page.setViewportSize({ width: 2400, height: 1260 });
await page.evaluate(() => {
  const c = document.getElementById("c");
  c.width = 2400;
  c.height = 1260;
  window.renderFrame(156, 180, 2);
});
writeFileSync(
  "/tmp/og-line-wordmark-2400.png",
  await page.locator("canvas").screenshot({ type: "png" }),
);

await browser.close();

if (FRAMES === FPS * DURATION) {
  console.log("encoding…");
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    join(FRAME_DIR, "frame_%04d.png"),
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "20",
    "-preset",
    "slow",
    "-an",
    "-movflags",
    "+faststart",
    OUT_MP4,
  ]);
  console.log("wrote", OUT_MP4);
} else {
  console.log("skipping encode (OG_FRAMES override)");
}
