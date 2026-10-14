/**
 * Homepage copy. Every `todo: true` line is a placeholder — replace the `text`
 * and set `todo` to false when the words are final. Do not write filler here.
 *
 * Structural labels (nav, chapter names, product names, photo captions) are
 * real. Headlines and sentences start as TODO.
 */

export type Line = {
  text: string;
  todo: boolean;
};

const todo = (text = "TODO"): Line => ({ text, todo: true });
const line = (text: string): Line => ({ text, todo: false });

export const homeCopy = {
  brand: "rahulkraken",

  nav: [
    { href: "#track", label: "Track" },
    { href: "#iron", label: "Iron" },
    { href: "#strings", label: "Strings" },
    { href: "#coffee", label: "Coffee" },
    { href: "#build", label: "Build" },
  ] as const,

  menu: [
    { href: "#track", label: "Track" },
    { href: "#iron", label: "Iron" },
    { href: "#strings", label: "Strings" },
    { href: "#coffee", label: "Coffee" },
    { href: "#build", label: "Build" },
    { href: "/ride", label: "Ride" },
    { href: "/notes", label: "Notes" },
  ] as const,

  hero: {
    /** TODO: ghost word behind the portrait. Empty hides it. */
    ghost: todo(""),
    /** TODO: short intro at the left of the hero. */
    intro: todo(),
    /** TODO: hero headline. Second line is italic. */
    headline: [todo(), todo()] as [Line, Line],
    year: "©2026",
    thumb: {
      src: "/photos/track-338.jpg",
      alt: "Leaned over on a red Ducati at MMRT",
      kicker: "MMRT",
      path: "/Track",
      href: "#track",
    },
    now: {
      src: "/photos/track-337.jpg",
      alt: "Close on the same bike",
      label: "Now building",
      name: "Meusic",
      href: "#build",
    },
    portrait: {
      src: "/photos/cut/portrait.webp",
      alt: "Painted portrait of Rahul Kumar",
    },
  },

  intro: {
    kicker: "Index",
    /** TODO: one sentence under the index. */
    line: todo(),
  },

  track: {
    id: "track",
    label: "Track",
    /** TODO: Track headline. Second line is italic. */
    headline: [todo(), todo()] as [Line, Line],
    /** TODO: Track dek. */
    dek: todo(""),
    photo: {
      src: "/photos/track-338.jpg",
      alt: "Leaned over on a red Ducati at MMRT",
    },
    caption: line("Panigale V2 S — MMRT"),
    /** TODO: Track caption, right side. */
    meta: todo(""),
    sequence: {
      caption: line("Corner"),
      frames: [
        "/photos/print/seq/corner-00.webp",
        "/photos/print/seq/corner-09.webp",
        "/photos/print/seq/corner-18.webp",
        "/photos/print/seq/corner-27.webp",
      ],
    },
    gear: [
      { src: "/photos/print/helmet.webp", caption: "Helmet" },
      { src: "/photos/print/gloves.webp", caption: "Gloves" },
      { src: "/photos/print/boot.webp", caption: "Boot" },
      { src: "/photos/print/leathers.webp", caption: "Leathers" },
    ],
  },

  iron: {
    id: "iron",
    label: "Iron",
    /** TODO: Iron headline. Second fragment is italic. */
    headline: [todo(), todo()] as [Line, Line],
    /** TODO: Iron dek. */
    dek: todo(""),
    slot: "Photo: squat, side-on, black and white",
  },

  strings: {
    id: "strings",
    label: "Strings",
    /** TODO: Strings headline. Second line is italic. */
    headline: [todo(), todo()] as [Line, Line],
    /** TODO: Strings dek. */
    dek: todo(""),
    slot: "Photo: Fender Strat, hands on the neck",
  },

  coffee: {
    id: "coffee",
    label: "Coffee",
    /** TODO: Coffee headline. Second fragment is italic. */
    headline: [todo(), todo()] as [Line, Line],
    /** TODO: Coffee dek. */
    dek: todo(""),
    slot: "Photo: pour-over, overhead",
  },

  build: {
    id: "build",
    label: "Build",
    /** TODO: Build dek. */
    dek: todo(""),
    items: [
      { name: "Meusic", italic: false, line: todo("") }, // TODO: Meusic one-liner
      { name: "Pillar", italic: true, line: todo("") }, // TODO: Pillar one-liner
      { name: "Apex One", italic: false, line: todo("") }, // TODO: Apex One one-liner
      { name: "Am I F*cked?", italic: true, line: todo("") }, // TODO: Am I F*cked? one-liner
    ],
    slot: "Photo: Apex One on the bench",
  },

  close: {
    /** TODO: closing headline. Second fragment is italic. */
    headline: [todo(), todo()] as [Line, Line],
    domain: "rahulkraken.com",
    elsewhere: [
      { label: "Instagram", href: "" }, // TODO: Instagram URL
      { label: "X", href: "" }, // TODO: X URL
      { label: "GitHub", href: "https://github.com/RahulKraken" },
    ],
  },
} as const;
