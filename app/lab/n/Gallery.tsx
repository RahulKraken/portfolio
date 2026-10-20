"use client";

import { useEffect, useRef, useState } from "react";
import { slots } from "@/lib/lab/copy";
import { photos, type Photo } from "@/lib/lab/photos";
import { products } from "@/lib/products";

type Row = {
  id: string;
  name: string;
  kind: string;
  status: string;
  line: string;
  photo?: Photo;
  slot?: string;
};

const rows: Row[] = [
  ...products.map((p) => ({
    id: p.id,
    name: p.name,
    kind: "Product",
    status: p.status,
    line: p.line,
    photo: p.id === "meusic" ? photos.strat016 : undefined,
    slot: p.id === "pillar" ? slots.squat : p.id === "apex-one" ? slots.apex : undefined,
  })),
  {
    id: "ride",
    name: "Ride",
    kind: "Track",
    status: "MMRT",
    line: "Panigale V2 S at MMRT",
    photo: photos.helmet,
  },
  {
    id: "play",
    name: "Play",
    kind: "Music",
    status: "Strat",
    line: "Gilmour-style on a Fender Strat",
    photo: photos.strat019,
  },
  {
    id: "lift",
    name: "Lift",
    kind: "Gym",
    status: "Open",
    line: "[currently: lifting]",
    slot: slots.squat,
  },
  {
    id: "brew",
    name: "Brew",
    kind: "Kitchen",
    status: "Home",
    line: "Coffee at home",
    slot: slots.coffee,
  },
];

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
    <section className="n-projects" ref={list} aria-label="Work and pursuits">
      <div className="n-head">
        <span>Name</span>
        <span className="n-wide">Kind</span>
        <span>Status</span>
      </div>
      {rows.map((row) => {
        const expanded = open === row.id;
        return (
          <article key={row.id} data-row className={expanded ? "is-open" : undefined}>
            <button
              type="button"
              className="n-row"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : row.id)}
              onPointerEnter={() => setHover(row.id)}
              onPointerLeave={() => setHover((h) => (h === row.id ? null : h))}
              onFocus={() => setHover(row.id)}
              onBlur={() => setHover((h) => (h === row.id ? null : h))}
            >
              <span className="n-bg" aria-hidden />
              <span className="n-cell" style={{ "--i": 0 } as React.CSSProperties}>
                <span className="n-text">{row.name}</span>
              </span>
              <span className="n-cell n-wide" style={{ "--i": 1 } as React.CSSProperties}>
                <span className="n-text">{row.kind}</span>
              </span>
              <span className="n-cell n-status" style={{ "--i": 2 } as React.CSSProperties}>
                <span className="n-text">{row.status}</span>
              </span>
            </button>
            <div className="n-body" hidden={!expanded}>
              <p>
                {row.line.startsWith("[") ? <span className="ph">{row.line}</span> : row.line}
              </p>
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
