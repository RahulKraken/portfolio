export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Photos already in `public/photos/`. No generated or remote images. */
export const photos = {
  track337: {
    src: "/photos/track-337.jpg",
    alt: "Close on a red Ducati Panigale at MMRT",
    width: 1286,
    height: 2000,
  },
  track338: {
    src: "/photos/track-338.jpg",
    alt: "Leaned over on a red Ducati at MMRT",
    width: 2000,
    height: 1336,
  },
  hero: {
    src: "/photos/cut/hero.webp",
    alt: "Overhead of a rider on a red Ducati, cut out",
    width: 2000,
    height: 1336,
  },
  heroTall: {
    src: "/photos/cut/hero-tall.webp",
    alt: "Rider on a red Ducati, cut out",
    width: 1286,
    height: 2000,
  },
  bike: {
    src: "/photos/cut/bike.webp",
    alt: "Red Ducati, cut out",
    width: 1400,
    height: 1111,
  },
  helmet: {
    src: "/photos/print/helmet.webp",
    alt: "A racing helmet, as a halftone print",
    width: 900,
    height: 1302,
  },
  gloves: {
    src: "/photos/print/gloves.webp",
    alt: "Racing gloves, as a print",
    width: 924,
    height: 707,
  },
  boot: {
    src: "/photos/print/boot.webp",
    alt: "A racing boot, as a print",
    width: 924,
    height: 1722,
  },
  leathers: {
    src: "/photos/print/leathers.webp",
    alt: "Racing leathers, as a print",
    width: 924,
    height: 3210,
  },
  bikePrint: {
    src: "/photos/print/bike.webp",
    alt: "The Ducati as a print",
    width: 1400,
    height: 1111,
  },
  strat016: {
    src: "/photos/print/strat-016.webp",
    alt: "Fender Stratocaster body, as a print",
    width: 1000,
    height: 666,
  },
  strat017: {
    src: "/photos/print/strat-017.webp",
    alt: "Fender Stratocaster, as a print",
    width: 666,
    height: 1000,
  },
  strat019: {
    src: "/photos/print/strat-019.webp",
    alt: "Fender Stratocaster, as a print",
    width: 666,
    height: 1000,
  },
  strat020: {
    src: "/photos/print/strat-020.webp",
    alt: "Fender Stratocaster, as a print",
    width: 666,
    height: 1000,
  },
  corner00: {
    src: "/photos/print/seq/corner-00.webp",
    alt: "A rider leaning through a corner",
    width: 1500,
    height: 1000,
  },
  corner14: {
    src: "/photos/print/seq/corner-14.webp",
    alt: "A rider leaning through a corner",
    width: 1500,
    height: 1000,
  },
  corner27: {
    src: "/photos/print/seq/corner-27.webp",
    alt: "A rider leaning through a corner",
    width: 1500,
    height: 1000,
  },
} as const satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;
