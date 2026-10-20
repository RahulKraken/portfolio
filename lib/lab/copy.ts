import { photos, type Photo } from "@/lib/lab/photos";

/** Visible placeholder — replace with his words. */
export const headline = "[headline: who you are, 6-10 words]";

export type Current = {
  id: "riding" | "lifting" | "playing" | "building";
  label: string;
  /** Real, short fact. Omit when we would have to invent. */
  line?: string;
  placeholder?: string;
  photo?: Photo;
  slot?: string;
};

export const currently: Current[] = [
  {
    id: "riding",
    label: "Riding",
    line: "Panigale V2 S at MMRT",
    photo: photos.track337,
  },
  {
    id: "lifting",
    label: "Lifting",
    placeholder: "[currently: lifting]",
    slot: "Photo: squat, side-on",
  },
  {
    id: "playing",
    label: "Playing",
    line: "Gilmour-style on a Fender Strat",
    photo: photos.strat016,
  },
  {
    id: "building",
    label: "Building",
    line: "Meusic, Pillar, Apex One, Am I F*cked?",
    slot: "Photo: Apex One on the bench",
  },
];

export const slots = {
  squat: "Photo: squat, side-on",
  coffee: "Photo: pour-over, overhead",
  apex: "Photo: Apex One on the bench",
} as const;

export type GridFigure =
  | { kind: "photo"; photo: Photo; caption: string; kicker: string }
  | { kind: "slot"; slot: string; caption: string; kicker: string };

/** Captioned grid for direction C. Captions are object names, not invented scenes. */
export const editorialGrid: GridFigure[] = [
  {
    kind: "photo",
    photo: photos.track338,
    caption: "Panigale V2 S",
    kicker: "MMRT",
  },
  {
    kind: "photo",
    photo: photos.helmet,
    caption: "Helmet",
    kicker: "Print",
  },
  {
    kind: "photo",
    photo: photos.strat017,
    caption: "Fender Strat",
    kicker: "Print",
  },
  { kind: "slot", slot: slots.squat, caption: "Iron", kicker: "Slot" },
  {
    kind: "photo",
    photo: photos.gloves,
    caption: "Gloves",
    kicker: "Print",
  },
  { kind: "slot", slot: slots.coffee, caption: "Coffee", kicker: "Slot" },
  {
    kind: "photo",
    photo: photos.corner14,
    caption: "Corner",
    kicker: "Sequence",
  },
  { kind: "slot", slot: slots.apex, caption: "Apex One", kicker: "Slot" },
];
