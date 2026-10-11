export type Note = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  chapter: "track" | "strength" | "music" | "building";
};

export const notes: Note[] = [];
