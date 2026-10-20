import { photos, type Photo } from "@/lib/lab/photos";

export const LIST_SIZE = 100;

export const chapters = [
  { id: "ride", label: "Ride", from: 1, to: 20 },
  { id: "lift", label: "Lift", from: 21, to: 40 },
  { id: "play", label: "Play", from: 41, to: 60 },
  { id: "build", label: "Build", from: 61, to: 80 },
  { id: "go", label: "Go", from: 81, to: 100 },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export type ListItem = {
  n: number;
  title: string;
  chapter: ChapterId;
  done: boolean;
  /** Placeholder date — not a real completion. */
  doneDate?: string;
  /** Placeholder note — not his words. */
  note?: string;
  photo?: Photo;
};

/**
 * Obviously-fake sample rows so the List 100 layouts can be judged.
 * None of these are Rahul's real list.
 */
const doneByN: Partial<
  Record<number, Pick<ListItem, "doneDate" | "note" | "photo">>
> = {
  1: {
    doneDate: "[date]",
    note: "[note: what happened]",
    photo: photos.track338,
  },
  7: {
    doneDate: "[date]",
    note: "[note: what happened]",
    photo: photos.helmet,
  },
  14: {
    doneDate: "[date]",
    note: "[note: what happened]",
    photo: photos.gloves,
  },
  22: {
    doneDate: "[date]",
    note: "[note: what happened]",
  },
  41: {
    doneDate: "[date]",
    note: "[note: what happened]",
    photo: photos.strat016,
  },
  48: {
    doneDate: "[date]",
    note: "[note: what happened]",
    photo: photos.strat019,
  },
  63: {
    doneDate: "[date]",
    note: "[note: what happened]",
    photo: photos.bikePrint,
  },
  71: {
    doneDate: "[date]",
    note: "[note: what happened]",
  },
  88: {
    doneDate: "[date]",
    note: "[note: what happened]",
  },
};

function chapterOf(n: number): ChapterId {
  const found = chapters.find((c) => n >= c.from && n <= c.to);
  return found?.id ?? "go";
}

export const list100: ListItem[] = Array.from({ length: LIST_SIZE }, (_, i) => {
  const n = i + 1;
  const extra = doneByN[n];
  return {
    n,
    title: `Sample item ${String(n).padStart(2, "0")}`,
    chapter: chapterOf(n),
    done: Boolean(extra),
    doneDate: extra?.doneDate,
    note: extra?.note,
    photo: extra?.photo,
  };
});

export const sampleDoneCount = list100.filter((item) => item.done).length;

export function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function catNo(n: number) {
  return `N°${pad3(n)}`;
}

export function itemId(n: number) {
  return `n-${pad3(n)}`;
}

export function chapterOfId(id: ChapterId) {
  return chapters.find((c) => c.id === id)!;
}
