export type PrintId = "track" | "lift" | "guitar" | "build" | "coffee";

export type Print = {
  id: PrintId;
  word: string;
  label: string;
  /** Background flood, RGB. */
  color: readonly [number, number, number];
  poster: string;
  webm: string;
  mp4: string;
  alt: string;
};

/**
 * Five equal pillars. Rest positions are 0..4; each neighbour is the same
 * distance, so no print (track included) owns more than 1/5 of the range.
 */
export const PRINTS: readonly Print[] = [
  {
    id: "track",
    word: "lean",
    label: "track",
    color: [24, 62, 66],
    poster: "/prints/track-poster.webp",
    webm: "/prints/track.webm",
    mp4: "/prints/track.mp4",
    alt: "Risograph print of a motorcyclist leaning through a corner",
  },
  {
    id: "lift",
    word: "depth",
    label: "the bar",
    color: [27, 56, 170],
    poster: "/prints/lift-poster.webp",
    webm: "/prints/lift.webm",
    mp4: "/prints/lift.mp4",
    alt: "Risograph print of a lifter at the bottom of a squat",
  },
  {
    id: "guitar",
    word: "bend",
    label: "strings",
    color: [66, 30, 128],
    poster: "/prints/guitar-poster.webp",
    webm: "/prints/guitar.webm",
    mp4: "/prints/guitar.mp4",
    alt: "Risograph print of hands bending a note on a Stratocaster",
  },
  {
    id: "build",
    word: "solder",
    label: "building",
    color: [18, 74, 38],
    poster: "/prints/build-poster.webp",
    webm: "/prints/build.webm",
    mp4: "/prints/build.mp4",
    alt: "Risograph print of a workbench with a laptop, boards, and a soldering iron",
  },
  {
    id: "coffee",
    word: "bloom",
    label: "coffee",
    color: [214, 92, 64],
    poster: "/prints/coffee-poster.webp",
    webm: "/prints/coffee.webm",
    mp4: "/prints/coffee.mp4",
    alt: "Risograph print of a pour-over beside a laptop",
  },
] as const;

export const PRINT_COUNT = PRINTS.length;
export const LAST_PRINT = PRINT_COUNT - 1;
export const PRINT_IDS: readonly PrintId[] = PRINTS.map((print) => print.id);

export function isPrintId(value: string): value is PrintId {
  return PRINTS.some((print) => print.id === value);
}

export function printById(id: string): Print | undefined {
  return PRINTS.find((print) => print.id === id);
}

export function printIndex(id: PrintId): number {
  return PRINTS.findIndex((print) => print.id === id);
}

export function printFromPath(pathname: string): Print | null {
  const segment = pathname.split("?")[0]?.replace(/^\//, "").split("/")[0] ?? "";
  return printById(segment) ?? null;
}

/** `?p=track` or `?p=0` deep-links a chapter. */
export function printFromQuery(value: string | null): Print | null {
  if (!value) return null;
  const named = printById(value);
  if (named) return named;
  if (!/^\d+$/.test(value)) return null;
  const index = Number(value);
  if (index < 0 || index > LAST_PRINT) return null;
  return PRINTS[index];
}

export function adjacentPrint(id: PrintId, direction: -1 | 1): Print {
  const index = printIndex(id);
  return PRINTS[(index + direction + PRINT_COUNT) % PRINT_COUNT];
}

export function printRgb(print: Print): string {
  return `rgb(${print.color.join(",")})`;
}
