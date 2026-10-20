"use client";

import { useEffect, useState } from "react";

const d = "M12 2 C 16 20, 8 40, 12 58 S 16 88, 12 98";

export function Progress() {
  const [t, setT] = useState(0.08);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setT(0.08 + 0.92 * Math.min(1, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <svg className="g-progress" viewBox="0 0 24 100" aria-hidden preserveAspectRatio="none">
      <path className="g-progress-track" d={d} />
      <path pathLength={1} style={{ strokeDashoffset: 1 - t }} d={d} />
    </svg>
  );
}
