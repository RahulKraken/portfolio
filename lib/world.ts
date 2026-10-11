import type { ArtName } from "@/components/art";

/*
  The route. World units are CSS pixels; z runs forward, x across the track, y down.
  The ground lies at y = GROUND.
*/
export const GROUND = 380;
export const END = 38400; // where the camera stops

export type ZoneId = "open" | "track" | "iron" | "bench" | "strings" | "table";

/** Each stretch has its own sky, ground and ink. `dark` drives the vignette. */
export const zones: { id: ZoneId; from: number; sky: [number, number, number]; dark: number }[] = [
  { id: "open", from: 0, sky: [200, 32, 28], dark: 0.35 },
  { id: "track", from: 1700, sky: [5, 5, 5], dark: 1 },
  { id: "iron", from: 15000, sky: [200, 32, 28], dark: 0.35 },
  { id: "bench", from: 21500, sky: [5, 5, 5], dark: 1 },
  { id: "strings", from: 28000, sky: [14, 12, 11], dark: 1 },
  { id: "table", from: 33400, sky: [239, 236, 228], dark: 0 },
];

export const zoneAt = (z: number) => {
  let i = 0;
  while (i < zones.length - 1 && z >= zones[i + 1].from) i++;
  return i;
};

export type Prop = {
  art: ArtName;
  x: number;
  /** Omitted: the prop stands on the ground */
  y?: number;
  z: number;
  /** Width in world pixels */
  w: number;
  ry?: number;
  motion?: "spin" | "float";
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const side = (k: number) => (k % 2 === 0 ? -1 : 1);

const track: Prop[] = [
  { art: "lights", x: 0, z: 2400, w: 2400 },
  { art: "flag", x: -1260, z: 2500, w: 200 },
  { art: "flag", x: 1260, z: 2500, w: 200 },
  ...range(14).map((k): Prop => ({ art: "tyres", x: side(k) * 1420, z: 2700 + k * 900, w: 190 })),
  ...range(10).map((k): Prop => ({ art: "cone", x: side(k + 1) * 1330, z: 3150 + k * 1150, w: 90 })),
  ...range(9).map((k): Prop => ({ art: "palm", x: side(k) * (1850 + (k % 3) * 130), z: 2950 + k * 1400, w: 380 })),
  { art: "stand", x: -1950, z: 10200, w: 1050, ry: 26 },
  { art: "stand", x: 1950, z: 11800, w: 1050, ry: -26 },
  { art: "flag", x: -1260, z: 9000, w: 200 },
  { art: "flag", x: 1260, z: 9000, w: 200 },
  { art: "marker300", x: 1270, z: 13050, w: 170 },
  { art: "marker200", x: 1270, z: 13500, w: 170 },
  { art: "marker100", x: 1270, z: 13950, w: 170 },
];

const iron: Prop[] = [
  // the bar gets heavier every gate
  { art: "bar1", x: 0, z: 15900, w: 2200 },
  { art: "bar2", x: 0, z: 17100, w: 2200 },
  { art: "bar3", x: 0, z: 18300, w: 2200 },
  { art: "bar4", x: 0, z: 19500, w: 2200 },
  ...range(4).map((k): Prop => ({ art: "plate", x: side(k) * 920, z: 16400 + k * 1200, w: 320, motion: "spin" })),
  { art: "plate", x: -1750, z: 16900, w: 760, motion: "spin" },
  { art: "plate", x: 1750, z: 19100, w: 760, motion: "spin" },
  ...range(3).map((k): Prop => ({ art: "kettlebell", x: side(k + 1) * 770, z: 16000 + k * 1900, w: 190 })),
  ...range(3).map((k): Prop => ({ art: "dumbbell", x: side(k) * 710, z: 16700 + k * 1800, w: 300 })),
];

const bench: Prop[] = [
  ...range(5).map((k): Prop => ({ art: "chip", x: side(k) * 800, z: 22300 + k * 1180, w: k % 2 ? 700 : 620 })),
  ...range(6).map((k): Prop => ({ art: "capacitor", x: side(k + 1) * (760 + (k % 3) * 120), z: 22800 + k * 900, w: 150 + (k % 3) * 35 })),
  { art: "resistor", x: -720, z: 23700, w: 420 },
  { art: "resistor", x: 720, z: 26200, w: 420 },
  ...range(4).map((k): Prop => ({ art: "led", x: side(k) * 540, z: 22500 + k * 1400, w: 110 })),
  { art: "iron", x: 900, z: 24900, w: 720 },
  ...range(3).map((k): Prop => ({ art: "scope", x: 0, y: -520, z: 23000 + k * 2100, w: 2400 })),
];

const strings: Prop[] = [
  ...range(3).map((k): Prop => ({ art: "rings", x: 0, y: -40, z: 28600 + k * 700, w: 1300 })),
  { art: "guitar", x: -900, z: 29000, w: 420 },
  { art: "guitar", x: 900, z: 30700, w: 420 },
  { art: "guitar", x: -900, z: 32400, w: 420 },
  { art: "amp", x: 830, z: 28800, w: 420 },
  { art: "amp", x: -830, z: 29900, w: 420 },
  { art: "amp", x: 830, z: 31600, w: 420 },
  { art: "pick", x: 300, y: -260, z: 29500, w: 120, motion: "float" },
  { art: "pick", x: -350, y: -300, z: 31000, w: 120, motion: "float" },
  { art: "pick", x: 250, y: -220, z: 32500, w: 120, motion: "float" },
];

const table: Prop[] = [
  { art: "dripper", x: -780, z: 34100, w: 620 },
  { art: "kettle", x: 820, z: 34700, w: 760 },
  { art: "books", x: 830, z: 35300, w: 480 },
  { art: "cup", x: -730, z: 35600, w: 520 },
  { art: "books", x: -830, z: 36400, w: 520 },
  { art: "dripper", x: 790, z: 36900, w: 500 },
  { art: "cup", x: -700, z: 37400, w: 420 },
  ...range(4).map((k): Prop => ({ art: "brick", x: side(k + 1) * (480 + (k % 2) * 60), z: 34400 + k * 1050, w: 230 })),
  // beans drift overhead; positions come from the index so server and client agree
  ...range(10).map(
    (k): Prop => ({
      art: "bean",
      x: ((k * 397) % 900) - 450,
      y: -90 - ((k * 131) % 260),
      z: 34000 + k * 400,
      w: 80,
      motion: "float",
    }),
  ),
];

export const props: Prop[] = [...track, ...iron, ...bench, ...strings, ...table];
