import { notes, type Note } from "@/lib/notes";

export type SamplePost = Note & {
  sample: true;
  hasPage: boolean;
  year: string;
};

/**
 * Sample entries so Blog can be judged with 0 published posts.
 * Not his writing. Hidden if `lib/notes.ts` gains real entries.
 */
export const samplePosts: SamplePost[] = [
  {
    slug: "sample",
    title: "[title: a sample post]",
    dek: "[dek: one sentence]",
    date: "[date]",
    year: "[year]",
    chapter: "track",
    sample: true,
    hasPage: true,
  },
  {
    slug: "sample-two",
    title: "[title: another sample]",
    dek: "[dek: one sentence]",
    date: "[date]",
    year: "[year]",
    chapter: "music",
    sample: true,
    hasPage: false,
  },
];

export type LabPost = (Note & { sample?: false; hasPage?: boolean; year?: string }) | SamplePost;

export function labPosts(): { items: LabPost[]; usingSample: boolean } {
  if (notes.length > 0) {
    return { items: notes.map((n) => ({ ...n, hasPage: false })), usingSample: false };
  }
  return { items: samplePosts, usingSample: true };
}

/** Clearly fake reading copy for `/blog/sample`. */
export const sampleBody = [
  "Sample text. Not his writing.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae nisl a lorem facilisis tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Sed auctor, nisl eget aliquam tincidunt, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.",
  "Donec euismod, nisl eget consectetur sagittis, nisl nisl consectetur nisl, eget consectetur nisl nisl eget nisl. Mauris in leo non nisl tincidunt tincidunt.",
  "[paragraph: the rest, in his words]",
] as const;

export const sampleSidenote = "placeholder: a sidenote";
