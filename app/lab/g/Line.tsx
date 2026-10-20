"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The identity is one red stroke. A seed of it is always on screen.
 * Scroll draws the racing line, then a string that vibrates, then a check.
 */
export function Line() {
  const tRef = useRef(0.34);
  const [t, setT] = useState(0.34);
  const [wave, setWave] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tRef.current = 1;
      setT(1);
      return;
    }

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const next = 0.34 + 0.66 * Math.min(1, window.scrollY / max);
      tRef.current = next;
      setT(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      const p = tRef.current;
      const amp = p > 0.3 && p < 0.72 ? Math.sin(frame / 7) * 16 : 0;
      setWave((w) => (Math.abs(w - amp) < 0.35 ? w : amp));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const string = `M 10 455 Q 60 ${455 - wave} 110 455`;
  const raceOff = 1 - t;
  const stringOff = t < 0.28 ? 1 : Math.max(0, 1 - (t - 0.28) / 0.18);
  const checkOff = t < 0.62 ? 1 : Math.max(0, 1 - (t - 0.62) / 0.3);

  return (
    <svg
      className="g-stroke"
      viewBox="0 0 120 900"
      aria-hidden
      preserveAspectRatio="xMidYMin meet"
    >
      <path
        className="g-race"
        pathLength={1}
        style={{ strokeDashoffset: raceOff }}
        d="M 58 10
           C 102 48 108 96 78 138
           C 36 192 16 236 42 286
           C 78 348 112 372 96 430
           C 78 492 18 518 28 580
           C 40 650 102 668 108 738
           C 112 790 72 828 48 872
           C 36 894 62 892 86 888"
      />
      <path
        className="g-string"
        pathLength={1}
        d={string}
        style={{
          strokeDashoffset: stringOff,
          opacity: t > 0.26 && t < 0.78 ? 1 : 0.2,
        }}
      />
      <path
        className="g-check"
        pathLength={1}
        style={{ strokeDashoffset: checkOff }}
        d="M 22 820 C 40 838 58 854 74 878 S 102 872 112 848"
      />
    </svg>
  );
}
