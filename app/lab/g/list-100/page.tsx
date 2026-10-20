import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/g/Nav";
import { Strike } from "@/app/lab/g/Strike";
import { list100, sampleDoneCount, sampleScoreAsOf } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "G · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="g-page">
        <h1>List 100</h1>
        <p>
          Sample data. {sampleDoneCount}/100 as of{" "}
          <span className="ph">{sampleScoreAsOf}</span>. Not his list.
        </p>
        <ol className="g-list">
          {list100.map((item) => (
            <li key={item.n} className={item.done ? "is-done" : undefined}>
              <span className="g-n">{item.n}</span>
              <span className="g-item">
                {item.hasStory ? (
                  <Link href="/lab/g/blog/sample">
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
                {item.done ? <Strike on /> : null}
              </span>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
