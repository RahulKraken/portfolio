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
  /** Placeholder aside — not his joke. */
  aside?: string;
  /** When true, the item links to the labelled sample post. */
  hasStory?: boolean;
};

/**
 * Obviously-fake sample rows so the List 100 layouts can be judged.
 * None of these are Rahul's real list.
 */
const extraByN: Partial<
  Record<number, Pick<ListItem, "doneDate" | "note" | "aside" | "hasStory">>
> = {
  1: {
    doneDate: "[date]",
    note: "placeholder: what happened",
    hasStory: true,
  },
  7: {
    doneDate: "[date]",
    note: "placeholder: what happened",
    aside: "placeholder: a funny aside",
  },
  14: {
    doneDate: "[date]",
    note: "placeholder: what happened",
  },
  22: {
    doneDate: "[date]",
    note: "placeholder: what happened",
  },
  41: {
    doneDate: "[date]",
    note: "placeholder: what happened",
    hasStory: true,
  },
  48: {
    doneDate: "[date]",
    note: "placeholder: what happened",
  },
  63: {
    doneDate: "[date]",
    note: "placeholder: what happened",
    aside: "placeholder: a funny aside",
  },
  71: {
    doneDate: "[date]",
    note: "placeholder: what happened",
  },
  88: {
    doneDate: "[date]",
    note: "placeholder: what happened",
  },
};

function chapterOf(n: number): ChapterId {
  const found = chapters.find((c) => n >= c.from && n <= c.to);
  return found?.id ?? "go";
}

export const list100: ListItem[] = Array.from({ length: LIST_SIZE }, (_, i) => {
  const n = i + 1;
  const extra = extraByN[n];
  return {
    n,
    title: `placeholder: sample item ${String(n).padStart(2, "0")}`,
    chapter: chapterOf(n),
    done: Boolean(extra),
    doneDate: extra?.doneDate,
    note: extra?.note,
    aside: extra?.aside,
    hasStory: extra?.hasStory,
  };
});

export const sampleDoneCount = list100.filter((item) => item.done).length;

/** Date is a placeholder — not a real as-of. */
export const sampleScoreAsOf = "[date]";
