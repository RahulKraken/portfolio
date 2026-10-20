"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { photos, type Photo } from "@/lib/lab/photos";

type Piece = {
  id: string;
  name: string;
  photo: Photo;
  related?: Photo;
  caption: string;
  placeholder?: boolean;
  x: string;
  y: string;
  w: string;
  depth: number;
};

const pieces: Piece[] = [
  {
    id: "helmet",
    name: "Helmet",
    photo: photos.helmet,
    related: photos.gloves,
    caption: "Panigale V2 S at MMRT",
    x: "58%",
    y: "2%",
    w: "26%",
    depth: 0.22,
  },
  {
    id: "gloves",
    name: "Gloves",
    photo: photos.gloves,
    related: photos.boot,
    caption: "placeholder: a note on the gloves",
    placeholder: true,
    x: "4%",
    y: "38%",
    w: "28%",
    depth: 0.12,
  },
  {
    id: "boot",
    name: "Boot",
    photo: photos.boot,
    related: photos.leathers,
    caption: "placeholder: a note on the boot",
    placeholder: true,
    x: "36%",
    y: "28%",
    w: "18%",
    depth: 0.3,
  },
  {
    id: "leathers",
    name: "Leathers",
    photo: photos.leathers,
    related: photos.helmet,
    caption: "placeholder: a note on the leathers",
    placeholder: true,
    x: "78%",
    y: "42%",
    w: "16%",
    depth: 0.18,
  },
  {
    id: "strat",
    name: "Strat",
    photo: photos.strat017,
    related: photos.strat016,
    caption: "Gilmour-style on a Fender Strat",
    x: "22%",
    y: "58%",
    w: "30%",
    depth: 0.26,
  },
];

export function Hall() {
  const stage = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<string | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = stage.current;
    if (!el || reduce.current) return;

    let cx = 0;
    let cy = 0;
    let sx = 0;
    let sy = 0;
    let scroll = 0;
    let raf = 0;

    const nodes = [...el.querySelectorAll<HTMLElement>("[data-depth]")];

    const tick = () => {
      sx += (cx - sx) * 0.08;
      sy += (cy - sy) * 0.08;
      for (const node of nodes) {
        const d = Number(node.dataset.depth);
        node.style.transform = `translate3d(${(-sx * d * 28).toFixed(1)}px, ${(scroll * d * -0.18 - sy * d * 18).toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cx = (e.clientX - r.left) / r.width - 0.5;
      cy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onScroll = () => {
      scroll = window.scrollY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="k-hall" ref={stage}>
      {pieces.map((p) => {
        const show = on === p.id;
        const img = show && p.related ? p.related : p.photo;
        return (
          <button
            key={p.id}
            type="button"
            className={`k-piece${show ? " is-on" : ""}`}
            style={{ left: p.x, top: p.y, width: p.w }}
            data-depth={p.depth}
            aria-pressed={show}
            aria-label={p.name}
            onPointerEnter={() => setOn(p.id)}
            onPointerLeave={() => setOn(null)}
            onFocus={() => setOn(p.id)}
            onBlur={() => setOn(null)}
            onClick={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
              setOn((id) => (id === p.id ? null : p.id));
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 720px) 70vw, 28vw"
              priority={p.id === "helmet" || p.id === "strat"}
            />
            <span className="k-cap">
              {p.name}
              {show ? (
                <>
                  {". "}
                  {p.placeholder ? <span className="ph">{p.caption}</span> : p.caption}
                </>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = track.current;
    if (!el) return;
    let x = 0;
    let v = 0.35;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const dt = Math.max(8, t - lastT);
      const dy = window.scrollY - lastY;
      const inst = dy / dt;
      v += (0.35 + Math.max(-1.2, Math.min(2.4, inst * 18)) - v) * 0.08;
      x -= v;
      const w = el.scrollWidth / 2;
      if (x < -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x}px,0,0)`;
      lastY = window.scrollY;
      lastT = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const words = "Rahul Kumar · Ride · Lift · Play · Build · ";
  return (
    <div className="k-marquee" aria-hidden>
      <div className="k-marquee-track" ref={track}>
        <span>{words.repeat(6)}</span>
      </div>
    </div>
  );
}
