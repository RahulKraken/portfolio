"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { slots } from "@/lib/lab/copy";
import { photos, type Photo } from "@/lib/lab/photos";
import { products } from "@/lib/products";

type Chap = {
  id: string;
  word: string;
  line: string;
  photo?: Photo;
  need?: string;
};

const chaps: Chap[] = [
  {
    id: "track",
    word: "Track",
    line: "Panigale V2 S at MMRT",
    photo: photos.corner14,
  },
  {
    id: "iron",
    word: "Iron",
    line: "placeholder: currently lifting",
    need: slots.squat,
  },
  {
    id: "strings",
    word: "Strings",
    line: "Gilmour-style on a Fender Strat",
    photo: photos.strat016,
  },
  {
    id: "build",
    word: "Build",
    line: products.map((p) => p.name).join(", "),
    need: slots.apex,
  },
];

export function Chapters() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = root.current?.querySelectorAll<HTMLElement>("[data-chap]");
    if (!nodes) return;
    const onScroll = () => {
      for (const node of nodes) {
        const r = node.getBoundingClientRect();
        const p = 1 - Math.min(1, Math.max(0, r.top / window.innerHeight));
        const media = node.querySelector<HTMLElement>(".l-media");
        if (media) {
          media.style.transform = `scale(${(1.12 - p * 0.12).toFixed(3)})`;
          media.style.clipPath = `inset(${(8 - p * 8).toFixed(1)}% ${(10 - p * 10).toFixed(1)}%)`;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={root}>
      {chaps.map((c) => (
        <section key={c.id} className="l-chap" data-chap={c.id}>
          <div className="l-sticky">
            <div className="l-media">
              {c.photo ? (
                <Image
                  src={c.photo.src}
                  alt={c.photo.alt}
                  width={c.photo.width}
                  height={c.photo.height}
                  sizes="100vw"
                />
              ) : (
                <div className={`l-need l-need-${c.id}`}>
                  <span>Photo needed</span>
                  <span className="ph">{c.need}</span>
                </div>
              )}
            </div>
            <h2>{c.word}</h2>
            <p>
              {c.line.startsWith("placeholder") ? (
                <span className="ph">{c.line}</span>
              ) : (
                c.line
              )}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
