import { About } from "@/components/About";
import { ChapterBody } from "@/components/ChapterBody";
import { ChapterRail } from "@/components/ChapterRail";
import { ChapterWorld } from "@/components/ChapterWorld";
import { Hero } from "@/components/Hero";
import { SiteFooter } from "@/components/SiteFooter";
import { chapters } from "@/lib/chapters";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ChapterRail />
      <About />
      {chapters.map((chapter) => (
        <div key={chapter.id}>
          <ChapterWorld chapter={chapter} />
          <ChapterBody chapter={chapter} />
        </div>
      ))}
      <SiteFooter />
    </main>
  );
}
