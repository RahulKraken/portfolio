"use client";

import { useEffect } from "react";

/**
 * Sets --t (0 → 1) on every [data-portal] across its pinned stretch, and marks the chapter
 * currently filling the screen on <main data-at>, so the top bar can follow along.
 */
export function PaperMotion() {
  useEffect(() => {
    const portals = Array.from(document.querySelectorAll<HTMLElement>("[data-portal]"));
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const main = document.querySelector<HTMLElement>(".pp");
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of portals) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const span = rect.height - vh;
        const t = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
        el.style.setProperty("--t", t.toFixed(4));
      }
      let at = "cover";
      for (const c of chapters) {
        if (c.getBoundingClientRect().top < vh * 0.5) at = c.dataset.chapter ?? at;
      }
      if (main && main.dataset.at !== at) main.dataset.at = at;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
