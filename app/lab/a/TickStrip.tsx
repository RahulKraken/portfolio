"use client";

import { useEffect, useState } from "react";
import { catNo, itemId, list100, pad3, sampleDoneCount } from "@/lib/lab/list100";

export function TickStrip() {
  const [hover, setHover] = useState<number | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shown = hover ?? sampleDoneCount;
  const mode = hover ? "N°" : "DONE";

  return (
    <div className="a-tower">
      <p className="a-tower-readout" aria-live="polite">
        <span className="a-tower-mode">{mode}</span>
        <span className="a-tower-num">
          {pad3(shown)}
          <small>/100</small>
        </span>
      </p>
      <div className="a-ticks" aria-label="Sample List 100">
        {list100.map((item) => (
          <a
            key={item.n}
            href={`#${itemId(item.n)}`}
            className={item.done ? "is-done" : undefined}
            title={`${catNo(item.n)} ${item.title}`}
            aria-label={`${catNo(item.n)} ${item.title}${item.done ? ", done" : ", open"}`}
            onPointerEnter={() => {
              if (!reduce) setHover(item.n);
            }}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(item.n)}
            onBlur={() => setHover(null)}
          />
        ))}
      </div>
    </div>
  );
}
