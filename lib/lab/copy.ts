import { photos, type Photo } from "@/lib/lab/photos";

export const slots = {
  squat: "Photo: squat, side-on",
  coffee: "Photo: pour-over, overhead",
  apex: "Photo: Apex One on the bench",
} as const;

export type LifeId = "ride" | "lift" | "play" | "build" | "brew";

export type Life = {
  id: LifeId;
  label: string;
  line?: string;
  placeholder?: string;
  photo?: Photo;
  slot?: string;
};

export const lives: Life[] = [
  {
    id: "ride",
    label: "Ride",
    line: "Panigale V2 S at MMRT",
    photo: photos.helmet,
  },
  {
    id: "lift",
    label: "Lift",
    placeholder: "[currently: lifting]",
    slot: slots.squat,
  },
  {
    id: "play",
    label: "Play",
    line: "Gilmour-style on a Fender Strat",
    photo: photos.strat016,
  },
  {
    id: "build",
    label: "Build",
    line: "Meusic, Pillar, Apex One, Am I F*cked?",
    slot: slots.apex,
  },
  {
    id: "brew",
    label: "Brew",
    line: "Coffee at home",
    slot: slots.coffee,
  },
];
