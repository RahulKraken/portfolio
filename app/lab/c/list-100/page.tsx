import type { Metadata } from "next";
import { Nav } from "@/app/lab/c/Nav";
import { chapters, list100, pad3, sampleDoneCount } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "C · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="c-toc">
        <header className="c-toc-head">
          <p className="c-kicker">List 100</p>
          <h1>Contents</h1>
          <p className="c-flag">
            Sample data · {sampleDoneCount}/100 marked done for layout. Not his
            list.
          </p>
          <nav className="c-chapters" aria-label="Chapters">
            {chapters.map((c) => (
              <a key={c.id} href={`#${c.id}`}>
                {c.label}
                <span>
                  {pad3(c.from)}–{pad3(c.to)}
                </span>
              </a>
            ))}
          </nav>
        </header>
        {chapters.map((c) => (
          <section key={c.id} id={c.id} className="c-chapter">
            <h2>{c.label}</h2>
            <ol>
              {list100
                .filter((item) => item.chapter === c.id)
                .map((item) => (
                  <li
                    key={item.n}
                    className={item.done ? "is-done" : "is-open"}
                  >
                    <span className="c-no">{pad3(item.n)}</span>
                    <span className="c-title">{item.title}</span>
                    <span className="c-status">
                      {item.done ? (
                        <span className="ph">{item.doneDate}</span>
                      ) : (
                        "—"
                      )}
                    </span>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </main>
    </>
  );
}
