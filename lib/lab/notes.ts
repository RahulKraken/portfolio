import { notes, type Note } from "@/lib/notes";

export type SampleNote = Note & { sample: true };

/**
 * Two labelled sample rows so Notes can be judged with 0 published posts.
 * Not his writing. Hidden automatically if `lib/notes.ts` gains real entries.
 */
export const sampleNotes: SampleNote[] = [
  {
    slug: "sample-01",
    title: "[title: a track note]",
    dek: "[dek: one sentence]",
    date: "[date]",
    chapter: "track",
    sample: true,
  },
  {
    slug: "sample-02",
    title: "[title: a strings note]",
    dek: "[dek: one sentence]",
    date: "[date]",
    chapter: "music",
    sample: true,
  },
];

export type LabNote = (Note & { sample?: false }) | SampleNote;

export function labNotes(): { items: LabNote[]; usingSample: boolean } {
  if (notes.length > 0) {
    return { items: notes, usingSample: false };
  }
  return { items: sampleNotes, usingSample: true };
}

export function noteYear(note: LabNote) {
  if ("sample" in note && note.sample) return "Sample";
  const match = note.date.match(/\d{4}/);
  return match ? match[0] : note.date;
}

export function groupNotes(items: LabNote[]) {
  const map = new Map<string, LabNote[]>();
  for (const item of items) {
    const year = noteYear(item);
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return Array.from(map, ([year, grouped]) => ({ year, items: grouped }));
}
