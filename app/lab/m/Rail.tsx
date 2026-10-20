"use client";

import { useEffect, useRef } from "react";
import { products } from "@/lib/products";
import { photos } from "@/lib/lab/photos";
import { slots } from "@/lib/lab/copy";

const faces = [
  { bg: photos.strat019.src, slot: null },
  { bg: null, slot: slots.squat },
  { bg: null, slot: slots.apex },
  { bg: photos.gloves.src, slot: null },
] as const;

export function Rail() {
  const pin = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = pin.current;
    if (!el) return;
    const track = el.querySelector<HTMLElement>(".m-rail-track");
    if (!track) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const max = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / max));
      const run = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${(-run * p).toFixed(1)}px,0,0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="m-rail" ref={pin}>
      <div className="m-rail-sticky">
        <div className="m-rail-track">
          {products.map((p, i) => (
            <article key={p.id} className={`m-panel m-panel-${i}`}>
              {faces[i]?.bg ? (
                <div
                  className="m-panel-img"
                  style={{ backgroundImage: `url(${faces[i].bg})` }}
                />
              ) : (
                <div className="m-panel-slot">
                  <span className="ph">{faces[i]?.slot}</span>
                </div>
              )}
              <h2>{p.name}</h2>
              <p>{p.line}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
