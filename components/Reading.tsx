"use client";

import { useEffect, useRef, useState } from "react";

type ReadingProps = {
  label: string;
  value: string;
};

export function Reading({ label, value }: ReadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = "0123456789ABCDEFGHKMNRSTZ.$₹";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setLocked(true);
          return;
        }
        let n = 0;
        const id = window.setInterval(() => {
          n += 1;
          if (n > 14) {
            window.clearInterval(id);
            setShown(value);
            setLocked(true);
            return;
          }
          setShown(
            value
              .split("")
              .map((ch) =>
                /[ \u2014\u2192\u2260./]/.test(ch)
                  ? ch
                  : chars[Math.floor(Math.random() * chars.length)],
              )
              .join(""),
          );
        }, 38);
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className={`reading case-reading${locked ? " is-locked" : ""}`}
    >
      <span className="reading-label">{label}</span>
      <span className="reading-value">{shown}</span>
    </div>
  );
}
