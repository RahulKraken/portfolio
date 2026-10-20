"use client";

import { useEffect, useRef, useState } from "react";
import { slots } from "@/lib/lab/copy";
import { photos, type Photo } from "@/lib/lab/photos";
import { products } from "@/lib/products";

type PlaceId = "ride" | "play" | "lift" | "brew" | "build";

type Place = {
  id: PlaceId;
  label: string;
  line: string;
  photo?: Photo;
  slot?: string;
  products?: boolean;
};

const places: Place[] = [
  {
    id: "ride",
    label: "Ride",
    line: "Panigale V2 S at MMRT",
    photo: photos.helmet,
  },
  {
    id: "play",
    label: "Play",
    line: "Gilmour-style on a Fender Strat",
    photo: photos.strat016,
  },
  {
    id: "lift",
    label: "Lift",
    line: "[currently: lifting]",
    slot: slots.squat,
  },
  {
    id: "brew",
    label: "Brew",
    line: "Coffee at home",
    slot: slots.coffee,
  },
  {
    id: "build",
    label: "Build",
    line: "Meusic, Pillar, Apex One, Am I F*cked?",
    slot: slots.apex,
    products: true,
  },
];

export function Room() {
  const [open, setOpen] = useState<PlaceId | null>(null);
  const [hover, setHover] = useState<PlaceId | null>(null);
  const yard = useRef<HTMLDivElement>(null);
  const place = places.find((p) => p.id === open) ?? null;

  useEffect(() => {
    const el = yard.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -4;
      el.style.setProperty("--tilt-x", `${y}deg`);
      el.style.setProperty("--tilt-y", `${x}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="o-scene" aria-label="Rahul's room">
      <div className="o-yard" ref={yard}>
        <House hover={hover} />
        {places.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`o-hot o-hot-${p.id}${hover === p.id || open === p.id ? " is-on" : ""}`}
            aria-expanded={open === p.id}
            onClick={() => setOpen(p.id)}
            onPointerEnter={() => setHover(p.id)}
            onPointerLeave={() => setHover((h) => (h === p.id ? null : h))}
            onFocus={() => setHover(p.id)}
            onBlur={() => setHover((h) => (h === p.id ? null : h))}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>
      <ul className="o-fallback">
        {places.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => setOpen(p.id)}>
              {p.label}
              <em>{p.line.startsWith("[") ? <span className="ph">{p.line}</span> : p.line}</em>
            </button>
          </li>
        ))}
      </ul>
      {place ? (
        <div className="o-sheet" role="dialog" aria-modal="true" aria-labelledby="o-sheet-title">
          <button type="button" className="o-close" onClick={() => setOpen(null)}>
            Close
          </button>
          <h2 id="o-sheet-title">{place.label}</h2>
          <p>
            {place.line.startsWith("[") ? <span className="ph">{place.line}</span> : place.line}
          </p>
          {place.photo ? (
            <img
              src={place.photo.src}
              alt={place.photo.alt}
              width={place.photo.width}
              height={place.photo.height}
              loading="lazy"
              decoding="async"
            />
          ) : place.slot ? (
            <p className="o-slot">
              <span className="ph">{place.slot}</span>
            </p>
          ) : null}
          {place.products ? (
            <ul className="o-products">
              {products.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <span>{item.line}</span>
                  <em>{item.status}</em>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function House({ hover }: { hover: PlaceId | null }) {
  const lit = (id: PlaceId) => (hover === id ? "is-lit" : undefined);
  return (
    <svg
      className="o-house"
      viewBox="0 0 1100 720"
      role="img"
      aria-hidden
      data-hover={hover ?? ""}
    >
      <defs>
        <linearGradient id="o-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7ead2" />
          <stop offset="1" stopColor="#e0c49a" />
        </linearGradient>
        <linearGradient id="o-floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c58a48" />
          <stop offset="1" stopColor="#9a6230" />
        </linearGradient>
        <linearGradient id="o-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a45d32" />
          <stop offset="1" stopColor="#6e3918" />
        </linearGradient>
        <radialGradient id="o-win" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#d7eef8" />
          <stop offset="1" stopColor="#7fb4d4" />
        </radialGradient>
        <filter id="o-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#1a3310" floodOpacity="0.28" />
        </filter>
      </defs>
      <ellipse cx="555" cy="655" rx="390" ry="38" fill="#2a4a1c" opacity="0.4" />
      <path d="M210 628 C280 598 360 612 430 622 C520 636 640 600 760 618 C840 630 900 610 930 628 L920 668 C700 690 380 690 200 660 Z" fill="#8a8a82" />
      <path d="M210 628 C280 598 360 612 430 622 C520 636 640 600 760 618 C840 630 900 610 930 628 L900 638 C700 655 400 658 230 638 Z" fill="#b7b4aa" />
      <g filter="url(#o-soft)">
        <path d="M248 268 L555 118 L862 268 L818 292 L555 158 L292 292 Z" fill="url(#o-roof)" />
        <path d="M268 286 L842 286 L842 598 L268 598 Z" fill="#5a3014" />
        <path d="M286 302 L824 302 L824 582 L286 582 Z" fill="url(#o-wood)" />
        <path d="M286 498 L824 498 L824 582 L286 582 Z" fill="url(#o-floor)" />
        <g stroke="#8a5a30" strokeWidth="2.5" opacity="0.28">
          <path d="M286 512 H824" />
          <path d="M286 526 H824" />
          <path d="M286 540 H824" />
          <path d="M286 554 H824" />
          <path d="M286 568 H824" />
        </g>
        <rect x="318" y="328" width="118" height="142" rx="3" fill="url(#o-win)" />
        <path d="M318 328 h118 v142 h-118 Z" fill="none" stroke="#6a3d1c" strokeWidth="9" />
        <rect x="373" y="328" width="7" height="142" fill="#6a3d1c" />
        <path d="M318 398 H436" stroke="#6a3d1c" strokeWidth="7" />
        <rect x="778" y="338" width="46" height="244" rx="2" fill="#f3efe4" />
        <circle cx="812" cy="462" r="4" fill="#c7b089" />
        <g className={lit("lift")}>
          <rect x="448" y="352" width="9" height="146" rx="2" fill="#2a2a2a" />
          <rect x="528" y="352" width="9" height="146" rx="2" fill="#2a2a2a" />
          <rect x="440" y="368" width="106" height="8" rx="2" fill="#3c3c3c" />
          <rect x="440" y="428" width="106" height="8" rx="2" fill="#3c3c3c" />
          <circle cx="452" cy="372" r="14" fill="#333" />
          <circle cx="533" cy="372" r="14" fill="#333" />
          <circle cx="452" cy="372" r="6" fill="#6a6a6a" />
          <circle cx="533" cy="372" r="6" fill="#6a6a6a" />
        </g>
        <g className={lit("brew")}>
          <rect x="318" y="478" width="86" height="12" rx="2" fill="#7a4a24" />
          <path d="M348 430 L372 408 L396 430 Z" fill="#c4783a" />
          <rect x="356" y="430" width="32" height="36" rx="3" fill="#f4ead8" />
          <ellipse cx="372" cy="448" rx="7" ry="5" fill="#5a3018" />
          <path d="M402 452 q18 -16 8 -32" fill="none" stroke="#d8d2c6" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className={lit("ride")}>
          <rect x="588" y="318" width="148" height="12" rx="2" fill="#7a4a24" />
          <path d="M632 262 C656 248 700 248 722 264 C730 280 724 304 700 314 C672 322 648 318 636 300 C624 284 620 272 632 262 Z" fill="#161616" />
          <ellipse cx="676" cy="278" rx="22" ry="18" fill="#3aa0c4" />
          <path d="M656 292 h40 v8 h-40 z" fill="#111" />
        </g>
        <g className={lit("play")}>
          <rect x="760" y="348" width="10" height="188" rx="3" fill="#5c3414" transform="rotate(-8 765 442)" />
          <path
            d="M744 402 C736 372 748 348 772 340 C796 332 818 348 822 376 C826 404 812 428 788 436 C776 440 766 432 762 420 C752 424 744 416 744 402 Z"
            fill="#d9a24a"
          />
          <path d="M768 348 C774 338 786 336 792 346" fill="none" stroke="#c48a3a" strokeWidth="8" strokeLinecap="round" />
          <rect x="778" y="360" width="5" height="70" fill="#f0d7a4" />
          <circle cx="790" cy="378" r="3.5" fill="#2a1c10" />
        </g>
        <g className={lit("build")}>
          <rect x="572" y="468" width="176" height="48" rx="3" fill="#7a4a24" />
          <rect x="582" y="456" width="26" height="20" rx="2" fill="#c9e86a" />
          <rect x="616" y="446" width="30" height="30" rx="2" fill="#c94b32" />
          <rect x="654" y="452" width="28" height="24" rx="2" fill="#35566e" />
          <rect x="690" y="450" width="26" height="26" rx="2" fill="#efe6d6" />
          <rect x="724" y="460" width="14" height="16" rx="1" fill="#222" />
        </g>
        <path d="M268 598 L286 582 L824 582 L842 598 Z" fill="#4a2610" />
      </g>
    </svg>
  );
}
