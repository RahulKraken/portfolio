import type { Metadata } from "next";
import { Featured } from "@/app/lab/j/Featured";
import { Nav } from "@/app/lab/j/Nav";
import { sampleDoneCount, sampleScoreAsOf } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "J · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="j-page j-dark-page">
        <h1>List 100</h1>
        <p>
          Sample data. {sampleDoneCount}/100 as of{" "}
          <span className="ph">{sampleScoreAsOf}</span>. Not his list.
        </p>
        <Featured />
      </main>
    </>
  );
}
