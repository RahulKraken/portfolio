"use client";

import Link from "next/link";
import { list100 } from "@/lib/lab/list100";

const featured = list100.find((item) => item.hasStory) ?? list100[0];
const rest = list100.filter((item) => item.n !== featured.n);

export function Featured() {
  return (
    <>
      <article className="j-feature">
        <p>{featured.done ? "Done" : "Next"}</p>
        <h2>
          <span className="ph">{featured.title}</span>
        </h2>
        {featured.note ? (
          <p>
            <span className="ph">{featured.note}</span>
          </p>
        ) : null}
        {featured.hasStory ? (
          <p>
            <Link href="/lab/j/blog/sample">Read the sample story</Link>
          </p>
        ) : null}
      </article>
      <ol className="j-list">
        {rest.map((item) => (
          <li key={item.n} className={item.done ? "is-done" : undefined}>
            <span>{item.n}</span>
            {item.hasStory ? (
              <Link href="/lab/j/blog/sample">
                <span className="ph">{item.title}</span>
              </Link>
            ) : (
              <span className="ph">{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
