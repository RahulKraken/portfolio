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
};

/**
 * Obviously-fake sample rows so the List 100 layouts can be judged.
 * None of these are Rahul's real list.
 */
const doneNs = new Set([1, 7, 14, 22, 41, 48, 63, 71, 88]);

function chapterOf(n: number): ChapterId {
  const found = chapters.find((c) => n >= c.from && n <= c.to);
  return found?.id ?? "go";
}

export const list100: ListItem[] = Array.from({ length: LIST_SIZE }, (_, i) => {
  const n = i + 1;
  const done = doneNs.has(n);
  return {
    n,
    title: `Sample item ${String(n).padStart(2, "0")}`,
    chapter: chapterOf(n),
    done,
    doneDate: done ? "[date]" : undefined,
  };
});

export const sampleDoneCount = doneNs.size;
