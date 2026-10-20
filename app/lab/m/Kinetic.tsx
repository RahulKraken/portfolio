"use client";

import { useEffect, useRef } from "react";
import { photos } from "@/lib/lab/photos";

const pursuits = [
  { word: "Ride", img: photos.helmet.src },
  { word: "Lift", img: "" },
  { word: "Play", img: photos.strat016.src },
  { word: "Build", img: photos.gloves.src },
] as const;

export function Kinetic() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let v = 0;
    let raf = 0;
    const tick = (t: number) => {
      const dt = Math.max(8, t - lastT);
      const inst = (window.scrollY - lastY) / dt;
      v += (inst - v) * 0.12;
      const skew = Math.max(-14, Math.min(14, v * 220));
      const wdth = Math.max(62, Math.min(140, 100 + v * 900));
      el.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
      el.style.setProperty("--wdth", wdth.toFixed(0));
      lastY = window.scrollY;
      lastT = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="m-kinetic" ref={root}>
      <p className="m-name m-clip" style={{ backgroundImage: `url(${photos.helmet.src})` }}>
        Rahul
      </p>
      <p className="m-name m-solid">Kumar</p>
      {pursuits.map((p) =>
        p.img ? (
          <p
            key={p.word}
            className="m-word m-clip"
            style={{ backgroundImage: `url(${p.img})` }}
          >
            {p.word}
          </p>
        ) : (
          <p key={p.word} className="m-word m-need">
            {p.word}
            <span className="ph">Photo: squat, side-on</span>
          </p>
        ),
      )}
    </div>
  );
}
