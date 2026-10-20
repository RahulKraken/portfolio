"use client";

import { useEffect, useRef, useState } from "react";
import { slots } from "@/lib/lab/copy";
import { photos, type Photo } from "@/lib/lab/photos";
import { products } from "@/lib/products";

type Row = {
  id: string;
  name: string;
  status: string;
  line: string;
  photo?: Photo;
  slot?: string;
};

const rows: Row[] = products.map((p) => ({
  id: p.id,
  name: p.name,
  status: p.status,
  line: p.line,
  photo: p.id === "meusic" ? photos.strat016 : undefined,
  slot: p.id === "apex-one" ? slots.apex : undefined,
}));

export function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const follow = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-row]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        }
      },
      { threshold: 0.2 },
    );
    items.forEach((el) => io.observe(el));
    const show = window.setTimeout(() => {
      items.forEach((el) => el.classList.add("is-in"));
    }, 900);
    return () => {
      io.disconnect();
      window.clearTimeout(show);
    };
  }, []);

  useEffect(() => {
    const el = follow.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const active = rows.find((r) => r.id === hover);

  return (
    <section className="n-projects" ref={list} aria-labelledby="n-build">
      <h2 id="n-build">What I build</h2>
      {rows.map((row) => {
        const expanded = open === row.id;
        return (
          <article key={row.id} data-row className={expanded ? "is-open" : undefined}>
            <button
              type="button"
              className={`n-row${hover === row.id ? " is-hovering" : ""}`}
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : row.id)}
              onPointerEnter={(e) => {
                setHover(row.id);
                const el = follow.current;
                if (el) {
                  el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
                }
              }}
              onPointerLeave={() => setHover((h) => (h === row.id ? null : h))}
              onFocus={() => setHover(row.id)}
              onBlur={() => setHover((h) => (h === row.id ? null : h))}
            >
              <span className="n-bg" aria-hidden />
              <span className="n-cell" style={{ "--i": 0 } as React.CSSProperties}>
                <span className="n-text">{row.name}</span>
              </span>
              <span className="n-cell n-status" style={{ "--i": 1 } as React.CSSProperties}>
                <span className="n-text">{row.status}</span>
              </span>
            </button>
            <div className="n-body" hidden={!expanded}>
              <p>{row.line}</p>
              {row.photo ? (
                <img
                  src={row.photo.src}
                  alt={row.photo.alt}
                  width={row.photo.width}
                  height={row.photo.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : row.slot ? (
                <p className="n-slot">
                  <span className="ph">{row.slot}</span>
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
      <div
        ref={follow}
        className={`n-follow${hover && active?.photo ? " is-on" : hover && active?.slot ? " is-slot" : ""}`}
        aria-hidden
      >
        {active?.photo ? (
          <img src={active.photo.src} alt="" width={active.photo.width} height={active.photo.height} />
        ) : active?.slot ? (
          <span className="ph">{active.slot}</span>
        ) : null}
      </div>
    </section>
  );
}
