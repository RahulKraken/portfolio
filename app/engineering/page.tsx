import type { Metadata } from "next";
import { ChapterBody } from "@/components/ChapterBody";
import { ChapterWorld } from "@/components/ChapterWorld";
import { SiteFooter } from "@/components/SiteFooter";
import { chapters } from "@/lib/chapters";

const chapter = chapters[4];

export const metadata: Metadata = {
  title: "Engineering",
  description: chapter.subtitle,
};

export default function EngineeringPage() {
  return (
    <main>
      <ChapterWorld chapter={chapter} />
      <ChapterBody chapter={chapter} />
      <SiteFooter />
    </main>
  );
}
