"use client";

import { useMemo, useState } from "react";
import { list100, sampleDoneCount } from "@/lib/lab/list100";

export function Checks() {
  const initial = useMemo(
    () => Object.fromEntries(list100.map((item) => [item.n, item.done])),
    [],
  );
  const [done, setDone] = useState<Record<number, boolean>>(initial);
  const count = Object.values(done).filter(Boolean).length;

  return (
    <>
      <p className="e-lede">
        Sample data. Started at {sampleDoneCount} done so the layout can be
        judged. Checks here are only for the interaction — not his list.
      </p>
      <p className="e-count" aria-live="polite">
        {count} / 100
      </p>
      <ul className="e-checks">
        {list100.map((item) => {
          const on = done[item.n];
          return (
            <li key={item.n}>
              <label className={on ? "is-on" : undefined}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    setDone((prev) => ({ ...prev, [item.n]: !prev[item.n] }))
                  }
                />
                <span className="e-box" aria-hidden>
                  <svg viewBox="0 0 16 16">
                    <path d="M3 8.5 6.2 12 13 4" />
                  </svg>
                </span>
                <span>{item.title}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
}
