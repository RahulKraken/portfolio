"use client";

import Link from "next/link";
import { useState } from "react";
import { list100 } from "@/lib/lab/list100";

export function Stack() {
  const [on, setOn] = useState<number | null>(null);

  return (
    <ol className="h-stack">
      {list100.map((item) => {
        const active = on === item.n;
        const title = <span className="ph">{item.title}</span>;
        return (
          <li
            key={item.n}
            className={`${item.done ? "is-done" : ""}${active ? " is-on" : ""}`.trim()}
            onMouseEnter={() => setOn(item.n)}
            onMouseLeave={() => setOn(null)}
            onFocus={() => setOn(item.n)}
            onBlur={() => setOn(null)}
          >
            <span className="h-n">{item.n}</span>
            {item.hasStory ? (
              <Link href="/lab/h/blog/sample">{title}</Link>
            ) : (
              title
            )}
            {active && item.note ? (
              <span className="h-note">
                <span className="ph">{item.note}</span>
                {item.aside ? (
                  <>
                    {" "}
                    <span className="ph">{item.aside}</span>
                  </>
                ) : null}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
