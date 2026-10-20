"use client";

import { useMemo, useState } from "react";
import { chapters, list100, sampleDoneCount, type ChapterId } from "@/lib/lab/list100";

type Filter = "all" | ChapterId;

export function Checklist() {
  const initial = useMemo(
    () => Object.fromEntries(list100.map((item) => [item.n, item.done])),
    [],
  );
  const [done, setDone] = useState<Record<number, boolean>>(initial);
  const [filter, setFilter] = useState<Filter>("all");

  const count = Object.values(done).filter(Boolean).length;

  return (
    <>
      <p>
        Sample data. Started at {sampleDoneCount} done so the layout can be
        judged. Checks here are only for the interaction — not his list.
      </p>
      <div className="f-toolbar">
        <p className="f-count" aria-live="polite">
          {count} / 100
        </p>
        <div className="f-filters" role="group" aria-label="Filter">
          <button
            type="button"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {chapters.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="f-checks">
        {list100.map((item) => {
          const on = done[item.n];
          const hidden = filter !== "all" && item.chapter !== filter;
          return (
            <li
              key={item.n}
              className={[on && "is-on", hidden && "is-out"].filter(Boolean).join(" ") || undefined}
              inert={hidden}
            >
              <label>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    setDone((prev) => ({ ...prev, [item.n]: !prev[item.n] }))
                  }
                />
                <span className="f-box" aria-hidden />
                <span className="f-check-title">{item.title}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
}
