"use client";

import { Mark } from "@/components/Mark";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { art } from "@/components/art";
import { site } from "@/lib/site";
import { END, GROUND, props, zoneAt, zones } from "@/lib/world";

// World units are CSS pixels. z runs forward, down the track.
// The CSS perspective is 900px; the cover-plane sizes in ride.css depend on it.
const FAR = 6000; // things fade in out of the dark at this distance
const SCROLL_PER_Z = 0.4; // page pixels scrolled per world pixel travelled
const CURVE = 2600; // length scale of the track's bends

type Board = { src: string; alt: string; x: number; y?: number; z: number; w: number; ratio: string; ry: number };

const boards: Board[] = [
  { src: "/photos/print/track-331.webp", alt: "A motorcycle at speed past long grass, as a screenprint", x: -760, z: 3000, w: 1000, ratio: "3 / 2", ry: 28 },
  { src: "/photos/print/track-346.webp", alt: "A motorcycle turning in over a kerb, as a screenprint", x: 780, z: 4100, w: 1000, ratio: "3 / 2", ry: -28 },
  { src: "/photos/print/track-340.webp", alt: "A motorcycle leaned over mid-corner, as a screenprint", x: -780, z: 9400, w: 1000, ratio: "3 / 2", ry: 28 },
  { src: "/photos/print/track-001.webp", alt: "A motorcycle side-on at full lean, as a screenprint", x: 800, z: 10000, w: 1000, ratio: "3 / 2", ry: -28 },
  { src: "/photos/print/track-344.webp", alt: "A distant motorcycle framed through an opening, as a screenprint", x: -700, z: 13500, w: 620, ratio: "2 / 3", ry: 24 },
];

// Burst screens stand across the track and play as you close in on them
const screens = [
  { base: "/photos/print/seq/corner", count: 28, z: 8700 },
  { base: "/photos/print/seq/approach", count: 32, z: 20900 },
];
const SCREEN_START = 4200; // distance at which the first frame shows
const SCREEN_END = 500; // distance at which the last frame shows

const walls = [
  { strip: "corner", side: -1, y: -150, z: 6000 },
  { strip: "pass", side: -1, y: 110, z: 6000 },
  { strip: "approach", side: 1, y: -150, z: 6000 },
  { strip: "pan", side: 1, y: 110, z: 6000 },
];

const kit = [
  { name: "helmet", alt: "A helmet, seen from the front", x: 40, y: -90, z: 10900, w: 560, wpx: 744, hpx: 1076 },
  { name: "gloves", alt: "A pair of race gloves", x: -560, y: 150, z: 11700, w: 620, wpx: 1083, hpx: 822 },
  { name: "boot", alt: "A scuffed race boot", x: 600, y: 150, z: 12300, w: 380, wpx: 583, hpx: 847 },
  { name: "leathers", alt: "Race leathers on a hanger", x: -640, y: -40, z: 13000, w: 300, wpx: 367, hpx: 1139 },
];

const slices = [
  { n: "017", x: -640, z: 30300, ry: 32 },
  { n: "016", x: 640, z: 30900, ry: -32 },
  { n: "019", x: -640, z: 31500, ry: 32 },
  { n: "020", x: 640, z: 32100, ry: -32 },
];

// Six strings across the track, low to high: ride through them to strum
const strings = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63].map((hz, i) => ({
  hz,
  y: -170 + i * 62,
  z: 30500 + i * 300,
  thick: 9 - i * 1.3,
}));
const PLUCK_AT = 1000; // a string sounds when it is this far ahead, so you see it ring

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const frameSrc = (base: string, i: number) => `${base}-${String(i).padStart(2, "0")}.webp`;

const place = (x: number, y: number, z: number, ry = 0) =>
  ({ "--x": x, "--y": y, "--z": z, "--ry": ry }) as React.CSSProperties;

/** Karplus–Strong: a burst of noise fed through a short averaging delay line. */
function pluckBuffer(ctx: AudioContext, hz: number) {
  const rate = ctx.sampleRate;
  const period = Math.round(rate / hz);
  const buffer = ctx.createBuffer(1, Math.round(rate * 2.2), rate);
  const out = buffer.getChannelData(0);
  for (let i = 0; i < out.length; i++) {
    out[i] =
      i <= period
        ? Math.random() * 2 - 1
        : 0.996 * 0.5 * (out[i - period] + out[i - period - 1]);
  }
  return buffer;
}

/** One continuous space. Scrolling moves a camera forward down a track; everything else is scenery. */
export function Ride() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sound, setSound] = useState(false);
  const audio = useRef<{ ctx: AudioContext; buffers: AudioBuffer[] } | null>(null);

  function toggleSound() {
    if (!audio.current) {
      const ctx = new AudioContext();
      audio.current = { ctx, buffers: strings.map((s) => pluckBuffer(ctx, s.hz)) };
    }
    setSound((on) => !on);
  }

  useEffect(() => {
    const ctx = audio.current?.ctx;
    if (!ctx) return;
    if (sound) void ctx.resume();
    else void ctx.suspend();
  }, [sound]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cam = root.querySelector<HTMLElement>(".ride-cam")!;
    const ground = root.querySelector<HTMLElement>(".ride-ground")!;
    const sky = root.querySelector<HTMLElement>(".ride-sky")!;
    const fog = root.querySelector<HTMLElement>(".ride-fog")!;
    const plate = root.querySelector<HTMLElement>(".ride-plate")!;
    const end = root.querySelector<HTMLElement>(".ride-end")!;
    const cue = root.querySelector<HTMLElement>(".ride-cue")!;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-z]")).map((el) => ({
      el,
      z: Number(el.dataset.z),
      // long things (walls) stay visible until their far end has passed
      depth: Number(el.dataset.depth ?? 0),
      keep: el.hasAttribute("data-keep"),
      shown: -1,
    }));
    const stringEls = Array.from(root.querySelectorAll<HTMLElement>(".ride-string"));
    const lastD = strings.map(() => Infinity);

    const canvases = Array.from(root.querySelectorAll<HTMLCanvasElement>(".ride-screen canvas"));
    const reels = screens.map((s, i) => ({
      ...s,
      ctx: canvases[i].getContext("2d"),
      frames: [] as HTMLImageElement[],
      current: -1,
    }));

    root.classList.add("is-live");
    let raf = 0;
    let lean = 0;
    let leanTarget = 0;

    const pluck = (i: number) => {
      const el = stringEls[i];
      el.classList.remove("is-plucked");
      void el.offsetWidth; // restart the animation
      el.classList.add("is-plucked");
      const a = audio.current;
      if (a && a.ctx.state === "running") {
        const source = a.ctx.createBufferSource();
        const gain = a.ctx.createGain();
        gain.gain.value = 0.4;
        source.buffer = a.buffers[i];
        source.connect(gain).connect(a.ctx.destination);
        source.start();
      }
    };

    const frame = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const z = clamp(-rect.top / Math.max(1, travel)) * END;

      // The track bends; the camera drifts across it and banks into each bend
      const kx = Math.min(1, window.innerWidth / 1200);
      const bend = Math.sin(z / CURVE) * clamp((z - 1800) / 1800) * clamp((END - 1200 - z) / 1500);
      lean += (leanTarget - lean) * 0.08;
      cam.style.transform = `rotateZ(${(bend * 8 + lean * 4).toFixed(3)}deg) translate3d(${(-bend * 230 * kx).toFixed(1)}px, 0, ${z.toFixed(1)}px)`;
      root.style.setProperty("--kx", kx.toFixed(3));

      // Sky, ground and vignette belong to the stretch you are in, and blend at its edges
      const zi = zoneAt(z);
      const zone = zones[zi];
      const next = zones[zi + 1];
      const prev = zones[zi - 1];
      const blend = next ? clamp((z - (next.from - 700)) / 700) : 0;
      const mix = (a: number, b: number) => a + (b - a) * blend;
      const to = next ?? zone;
      const skyColor = `rgb(${zone.sky.map((c, k) => Math.round(mix(c, to.sky[k]))).join(" ")})`;
      root.style.backgroundColor = skyColor;
      ground.style.setProperty("--sky", skyColor);
      fog.style.opacity = mix(zone.dark, to.dark).toFixed(3);

      // The ground and the sky objects travel with the camera; only the ground's paint slides
      const edge = Math.min(prev ? clamp((z - zone.from) / 500) : 1, next ? clamp((next.from - z) / 500) : 1);
      ground.dataset.kind = zone.id;
      ground.style.transform = `translate(-50%, -50%) translate3d(0, ${GROUND}px, ${(-z - 3900).toFixed(1)}px) rotateX(90deg) scale(4)`;
      ground.style.backgroundPositionY = `${(z / 4).toFixed(1)}px`;
      // it appears once the opening has pulled apart and is gone before the last frame fills the view
      ground.style.opacity = Math.min(clamp((z - 500) / 700), clamp((END - 2600 - z) / 900), edge).toFixed(3);
      sky.dataset.kind = zone.id;
      sky.style.transform = `translate(-50%, -50%) translate3d(0, 0, ${(-z - 6400).toFixed(1)}px) scale(4)`;
      sky.style.opacity = Math.min(clamp((z - 900) / 700), clamp((END - 2200 - z) / 900), edge).toFixed(3);

      plate.style.opacity = (1 - clamp(z / 320)).toFixed(3);
      plate.style.display = z > 330 ? "none" : "block";
      cue.style.opacity = (1 - clamp(z / 200)).toFixed(3);
      const done = clamp((z - (END - 500)) / 500);
      end.style.opacity = done.toFixed(3);
      end.style.pointerEvents = done > 0.5 ? "auto" : "none";

      for (const item of items) {
        const d = item.z - z;
        const near = item.keep ? 1 : clamp((d + item.depth - 60) / 260);
        const far = clamp((FAR - d) / 1500);
        const o = Math.round(Math.min(near, far) * 100) / 100;
        if (o === item.shown) continue;
        item.shown = o;
        item.el.style.opacity = String(o);
        item.el.style.display = o <= 0 ? "none" : "block";
      }

      reels.forEach((reel, r) => {
        const d = reel.z - z;
        if (d < FAR + 2500 && reel.frames.length === 0) {
          for (let i = 0; i < reel.count; i++) {
            const img = new window.Image();
            img.onload = () => {
              reel.current = -1;
              schedule();
            };
            img.src = frameSrc(reel.base, i);
            reel.frames[i] = img;
          }
        }
        const t = clamp((SCREEN_START - d) / (SCREEN_START - SCREEN_END));
        const i = Math.min(reel.count - 1, Math.floor(t * reel.count));
        const img = reel.frames[i];
        if (i === reel.current || !img?.complete || !img.naturalWidth || !reel.ctx) return;
        reel.ctx.drawImage(img, 0, 0, canvases[r].width, canvases[r].height);
        reel.current = i;
      });

      strings.forEach((s, i) => {
        const d = s.z - z;
        if ((lastD[i] - PLUCK_AT) * (d - PLUCK_AT) < 0) pluck(i);
        lastD[i] = d;
      });

      if (Math.abs(leanTarget - lean) > 0.002) schedule();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const measure = () => {
      root.style.height = `${END * SCROLL_PER_Z + window.innerHeight}px`;
      schedule();
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      leanTarget = (e.clientX / window.innerWidth) * 2 - 1;
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("is-live");
      root.style.height = "";
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div className="ride" ref={rootRef}>
      <div className="ride-view">
        <div className="ride-cam">
          <div className="ride-ground" aria-hidden />
          <div className="ride-sky" aria-hidden>
            {art.sun}
          </div>

          {/* Opening: the photograph, then the number and the machine pulling apart in depth */}
          <div className="ride-item ride-cover ride-plate" style={place(0, 0, 0)}>
            <Image className="wide" src="/photos/track-338.jpg" alt="A red motorcycle leaned into a corner, seen from above" fill priority sizes="100vw" />
            <Image className="tall" src="/photos/track-337.jpg" alt="A red motorcycle leaned into a corner, close up" fill loading="eager" fetchPriority="high" sizes="100vw" />
          </div>
          <h1 className="ride-item ride-number ride-number-open" data-z="1150" style={{ "--x": 0, "--z": 1150, "--ry": 0 } as React.CSSProperties}>
            <span className="sr-only">{site.title}</span>
            <Mark />
          </h1>
          <div className="ride-item ride-cover ride-machine" data-z="900" style={place(0, 0, 900)} aria-hidden>
            <Image className="wide" src="/photos/cut/hero.webp" alt="" fill priority sizes="100vw" />
            <Image className="tall" src="/photos/cut/hero-tall.webp" alt="" fill loading="eager" unoptimized fetchPriority="high" sizes="100vw" />
          </div>

          {/* Drawn scenery: each prop takes its ink from the stretch it stands in */}
          {props.map((p, i) => (
            <div
              key={i}
              className={`ride-item ride-prop z-${zones[zoneAt(p.z)].id}${p.y === undefined ? " is-grounded" : ""}${p.motion ? ` is-${p.motion}` : ""}`}
              data-z={p.z}
              style={{ ...place(p.x, p.y ?? GROUND, p.z, p.ry), "--w": p.w } as React.CSSProperties}
              aria-hidden
            >
              {art[p.art]}
            </div>
          ))}

          {[17000, 18400, 19700].map((z, i) => (
            <div key={z} className="ride-item ride-chalk" data-z={z} style={place(i % 2 ? 380 : -320, -60, z)} aria-hidden />
          ))}

          {boards.map((b) => (
            <div
              key={b.src}
              className="ride-item ride-board"
              data-z={b.z}
              style={{ ...place(b.x, b.y ?? -40, b.z, b.ry), "--w": b.w, aspectRatio: b.ratio } as React.CSSProperties}
            >
              <Image src={b.src} alt={b.alt} fill loading="eager" unoptimized sizes="(max-width: 900px) 90vw, 60vw" />
            </div>
          ))}

          {walls.map((w) => (
            <div
              key={w.strip}
              className="ride-item ride-wall"
              data-z={w.z}
              data-depth="5200"
              style={{
                ...place(w.side * 1050, w.y, w.z, w.side * -90),
                backgroundImage: `url(/photos/print/strip-${w.strip}.webp)`,
              }}
              role="img"
              aria-label="A contact strip of burst frames"
            />
          ))}

          {screens.map((s) => (
            <div key={s.base} className="ride-item ride-screen" data-z={s.z} style={place(0, -60, s.z)}>
              <canvas width={1200} height={800} role="img" aria-label="A burst of frames playing as you approach" />
            </div>
          ))}

          {kit.map((k) => (
            <div
              key={k.name}
              className="ride-item ride-kit"
              data-z={k.z}
              style={{ ...place(k.x, k.y, k.z), "--w": k.w } as React.CSSProperties}
            >
              <Image src={`/photos/print/${k.name}.webp`} alt={k.alt} width={k.wpx} height={k.hpx} loading="eager" unoptimized sizes="(max-width: 900px) 70vw, 40vw" />
            </div>
          ))}

          <div className="ride-item ride-number ride-number-gate" data-z="14300" style={place(0, -40, 14300)} aria-hidden>
            <Mark outline />
          </div>

          {slices.map((s) => (
            <div
              key={s.n}
              className="ride-item ride-board ride-slice"
              data-z={s.z}
              style={{ ...place(s.x, -20, s.z, s.ry), "--w": 560, aspectRatio: "3 / 4" } as React.CSSProperties}
            >
              <Image src={`/photos/print/strat-${s.n}.webp`} alt="An electric guitar in close-up, as a screenprint" fill loading="eager" unoptimized sizes="(max-width: 900px) 60vw, 35vw" />
            </div>
          ))}

          {strings.map((s, i) => (
            <div
              key={i}
              className="ride-item ride-string"
              data-z={s.z}
              style={{ ...place(0, s.y, s.z), height: `${s.thick}px` }}
              aria-hidden
            />
          ))}

          <div className="ride-item ride-cover ride-last" data-z={END} data-keep style={place(0, 0, END)}>
            <Image src="/photos/print/track-345.webp" alt="A lone rider in a long empty corner, as a screenprint" fill loading="eager" unoptimized sizes="100vw" />
          </div>
        </div>

        <div className="ride-fog" aria-hidden />
        <div className="ride-cue" aria-hidden />

        <button type="button" className="ride-sound" aria-pressed={sound} onClick={toggleSound}>
          Sound {sound ? "on" : "off"}
        </button>

        <footer className="ride-end">
          <Link href="/notes">Notes</Link>
          <a href={site.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}
