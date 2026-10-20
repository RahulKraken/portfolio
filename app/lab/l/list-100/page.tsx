import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/l/Nav";
import { list100, sampleDoneCount, sampleScoreAsOf } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "L · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div data-l="paper">
      <Nav here="list" />
      <main className="l-page">
        <h1>List 100</h1>
        <p>
          Sample data. Not his list. As of <span className="ph">{sampleScoreAsOf}</span>.
        </p>
        <p className="l-score">
          {sampleDoneCount}
          <span>/100</span>
        </p>
        <ol className="l-list">
          {list100.map((item) => (
            <li key={item.n} className={item.done ? "is-done" : undefined}>
              <span className="l-n">{item.n}</span>
              <span className="l-item">
                {item.hasStory ? (
                  <Link href="/lab/l/blog/sample">
                    <span className="ph">{item.title}</span>
                  </Link>
                ) : (
                  <span className="ph">{item.title}</span>
                )}
                {item.aside ? (
                  <em>
                    {" "}
                    <span className="ph">{item.aside}</span>
                  </em>
                ) : null}
                {item.done ? <span className="l-strike" aria-hidden /> : null}
              </span>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
