"use client";

import { useEffect, useRef } from "react";

/** A row of cards that travels sideways while the page scrolls down past it. */
export function Rail({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let distance = 0;
    let raf = 0;

    const frame = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      row.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      section.style.setProperty("--rail", p.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const measure = () => {
      // one pixel of scroll moves the row one pixel
      distance = Math.max(0, row.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      schedule();
    };

    section.classList.add("is-live");
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      section.classList.remove("is-live");
      section.style.height = "";
      row.style.transform = "";
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="rail" id={id} ref={sectionRef} aria-label={label} data-cursor="iron">
      <div className="rail-stage">
        <div className="rail-row" ref={rowRef}>
          {children}
        </div>
        <span className="rail-bar" aria-hidden />
      </div>
    </section>
  );
}
