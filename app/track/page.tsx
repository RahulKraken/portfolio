import type { Metadata } from "next";
import { ChapterBody } from "@/components/ChapterBody";
import { ChapterWorld } from "@/components/ChapterWorld";
import { SiteFooter } from "@/components/SiteFooter";
import { chapters } from "@/lib/chapters";

const chapter = chapters[0];

export const metadata: Metadata = {
  title: "Track",
  description: chapter.subtitle,
};

export default function TrackPage() {
  return (
    <main>
      <ChapterWorld chapter={chapter} eager />
      <ChapterBody chapter={chapter} />
      <SiteFooter />
    </main>
  );
}
