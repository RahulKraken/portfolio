import { roomItems } from "@/components/room/content";
import { products } from "@/lib/products";
import type { PrintId } from "@/lib/prints";

const track = roomItems.find((item) => item.id === "track")!;
const projects = roomItems.find((item) => item.id === "projects")!;
const music = roomItems.find((item) => item.id === "music")!;
const coffee = roomItems.find((item) => item.id === "coffee")!;
const meusic = products.find((product) => product.id === "meusic")!;

export type ChapterItem = {
  label: string;
  detail?: string;
  href?: string;
  hrefLabel?: string;
  /** Open in a new tab. Internal routes stay in-place. */
  external?: boolean;
};

export type ChapterCopy = {
  lines: string[];
  items: ChapterItem[];
  /** True when the copy is a placeholder pending Rahul. */
  pending?: boolean;
};

/**
 * Chapter copy is sourced only from already-published repo files.
 * Do not invent personal facts, numbers, places, or names here.
 */
export const CHAPTERS: Record<PrintId, ChapterCopy> = {
  track: {
    // components/room/content.ts → roomItems.track
    lines: [track.intro],
    items: [{ label: track.object, detail: track.title }],
  },
  lift: {
    // TODO(rahul): lift chapter copy — no published lift/strength text in the repo yet.
    lines: ["This chapter is still being written."],
    items: [],
    pending: true,
  },
  guitar: {
    // components/room/content.ts → roomItems.music; lib/products.ts → Meusic
    lines: [music.intro],
    items: [
      { label: music.object },
      { label: meusic.name, detail: meusic.line },
    ],
  },
  build: {
    // components/room/content.ts → roomItems.projects; lib/products.ts; /room; public/cv.pdf
    lines: [projects.title, projects.intro],
    items: [
      ...products.map((product) => ({
        label: product.name,
        detail: product.kind,
        href: product.href,
        hrefLabel: product.hrefLabel,
        external: Boolean(product.href),
      })),
      {
        label: "Studio",
        detail: "The 3D room.",
        href: "/room",
        hrefLabel: "Open the room",
      },
      {
        label: "CV",
        href: "/cv.pdf",
        hrefLabel: "Open PDF",
      },
    ],
  },
  coffee: {
    // components/room/content.ts → roomItems.coffee
    lines: [coffee.intro],
    items: [{ label: coffee.object }],
  },
};
