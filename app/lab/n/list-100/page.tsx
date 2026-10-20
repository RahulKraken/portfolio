import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/n/Nav";
import { list100, sampleDoneCount, sampleScoreAsOf } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "N · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div data-n="paper">
      <Nav here="list" />
      <main className="n-page">
        <h1>List 100</h1>
        <p className="n-note">
          Sample entries. {sampleDoneCount} of 100, as of{" "}
          <span className="ph">{sampleScoreAsOf}</span>.
        </p>
        <ol className="n-list">
          {list100.map((item) => (
            <li key={item.n} className={item.done ? "is-done" : undefined}>
              <span className="n-n">{item.n}</span>
              <span className="n-item">
                {item.hasStory ? (
                  <Link href="/lab/n/blog/sample">
                    <span className="ph">{item.title}</span>
                  </Link>
                ) : (
                  <span className="ph">{item.title}</span>
                )}
                {item.done ? <span className="n-strike" aria-hidden /> : null}
              </span>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
