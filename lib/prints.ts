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
  chapter: string;
  /** The building pillar opens the studio. */
  studio?: boolean;
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
    chapter:
      "A placeholder chapter. The 2025 Panigale V2 S at Madras — the real pages come later.",
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
    chapter:
      "A placeholder chapter. Heavy things, moved on purpose.",
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
    chapter:
      "A placeholder chapter. A black Strat, notes bent until they mean something.",
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
    chapter:
      "A placeholder chapter. An itch, a prototype — the studio is this way.",
    studio: true,
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
    chapter:
      "A placeholder chapter. A Hario Switch, an AeroPress, and this week’s beans.",
  },
] as const;

export const PRINT_COUNT = PRINTS.length;
export const LAST_PRINT = PRINT_COUNT - 1;
