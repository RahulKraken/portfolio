import type { Metadata } from "next";
import { Nav } from "@/app/lab/i/Nav";
import { Ledger } from "@/app/lab/i/Ledger";
import { sampleDoneCount, sampleScoreAsOf } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "I · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="i-main">
        <h1>List 100</h1>
        <p>
          Sample data. {sampleDoneCount}/100 as of{" "}
          <span className="ph">{sampleScoreAsOf}</span>. Done items with a
          story link to the sample post. Not his list.
        </p>
        <Ledger />
      </main>
    </>
  );
}
