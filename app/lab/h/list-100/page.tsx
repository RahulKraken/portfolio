import type { Metadata } from "next";
import { Nav } from "@/app/lab/h/Nav";
import { Stack } from "@/app/lab/h/Stack";
import { sampleDoneCount, sampleScoreAsOf } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "H · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="h-main">
        <h1>List 100</h1>
        <p className="h-lede">
          Sample data. {sampleDoneCount}/100 as of{" "}
          <span className="ph">{sampleScoreAsOf}</span>. Hover a row. Not his
          list.
        </p>
        <Stack />
      </main>
    </>
  );
}
