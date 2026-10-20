"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Photo } from "@/lib/lab/photos";

type Props = {
  children: string;
  photo?: Photo;
  slot?: string;
};

function canFollow() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function place(x: number, y: number) {
  return {
    x: Math.min(x + 16, window.innerWidth - 176),
    y: Math.min(y + 16, window.innerHeight - 160),
  };
}

export function Peek({ children, photo, slot }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const card = (
    <span className="d-peek-card" id={id} aria-hidden>
      {photo ? (
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          sizes="160px"
        />
      ) : (
        <span className="d-peek-slot">{slot}</span>
      )}
    </span>
  );

  return (
    <button
      type="button"
      className="d-peek"
      aria-expanded={open}
      aria-controls={id}
      onPointerEnter={(e) => {
        if (!canFollow()) return;
        setOpen(true);
        setPos(place(e.clientX, e.clientY));
      }}
      onPointerMove={(e) => {
        if (!canFollow()) return;
        setPos(place(e.clientX, e.clientY));
      }}
      onPointerLeave={() => {
        if (!canFollow()) return;
        setOpen(false);
        setPos(null);
      }}
      onFocus={(e) => {
        if (!canFollow()) return;
        setOpen(true);
        const r = e.currentTarget.getBoundingClientRect();
        setPos(place(r.right, r.bottom));
      }}
      onBlur={() => {
        if (!canFollow()) return;
        setOpen(false);
        setPos(null);
      }}
      onClick={() => {
        if (canFollow()) return;
        setOpen((v) => !v);
      }}
    >
      {children}
      {open && pos ? (
        <span className="d-peek-float" style={{ left: pos.x, top: pos.y }}>
          {card}
        </span>
      ) : null}
      {open && !pos ? card : null}
    </button>
  );
}
