import type { Metadata } from "next";
import { ChapterBody } from "@/components/ChapterBody";
import { ChapterWorld } from "@/components/ChapterWorld";
import { SiteFooter } from "@/components/SiteFooter";
import { chapters } from "@/lib/chapters";

const chapter = chapters[2];

export const metadata: Metadata = {
  title: "Music",
  description: chapter.subtitle,
};

export default function MusicPage() {
  return (
    <main>
      <ChapterWorld chapter={chapter} />
      <ChapterBody chapter={chapter} />
      <SiteFooter />
    </main>
  );
}
