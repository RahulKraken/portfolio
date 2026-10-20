import Link from "next/link";
import { chapters, list100, sampleDoneCount } from "@/lib/lab/list100";

export function Ledger() {
  return (
    <>
      <p className="i-score">
        {sampleDoneCount}/{100}
      </p>
      {chapters.map((ch) => (
        <section key={ch.id} className="i-chapter">
          <h2>{ch.label}</h2>
          <ol start={ch.from}>
            {list100
              .filter((item) => item.chapter === ch.id)
              .map((item) => (
                <li key={item.n} className={item.done ? "is-done" : undefined}>
                  {item.hasStory ? (
                    <Link href="/lab/i/blog/sample">
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
                </li>
              ))}
          </ol>
        </section>
      ))}
    </>
  );
}
