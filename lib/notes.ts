export type Note = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  chapter: "track" | "strength" | "music" | "building";
};

export const notes: Note[] = [
  {
    slug: "built-it-himself",
    title: "He doesn’t trust an instrument until he’s built it himself.",
    dek: "A DIY GPS lap timer versus AiM and Garmin, then the same procedure on guitar and the log.",
    date: "2026-08-20",
    chapter: "building",
  },
];
