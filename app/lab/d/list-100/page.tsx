import type { Metadata } from "next";
import { Nav } from "@/app/lab/d/Nav";
import { list100, sampleDoneCount } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "D · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="d-letter">
        <h1>List 100</h1>
        <p>
          Sample data. {sampleDoneCount} of 100 marked done so the layout can
          be judged. Not his list.
        </p>
        <ol className="d-list">
          {list100.map((item) => (
            <li key={item.n} className={item.done ? "is-done" : undefined}>
              <span>{item.title}</span>
              {item.done ? (
                <span>
                  {" "}
                  — done, <span className="ph">{item.doneDate}</span>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
