"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { slots } from "@/lib/lab/copy";
import { photos, type Photo } from "@/lib/lab/photos";
import { products } from "@/lib/products";

type Chip = {
  id: string;
  word: string;
  photo?: Photo;
  line: string;
  face?: ReactNode;
};

const chips: Record<string, Chip> = {
  squat: {
    id: "squat",
    word: "lift",
    line: "placeholder: currently lifting",
    face: (
      <svg viewBox="0 0 40 40" aria-hidden>
        <rect x="4" y="18" width="32" height="4" rx="1" />
        <rect x="8" y="10" width="5" height="20" rx="1" />
        <rect x="27" y="10" width="5" height="20" rx="1" />
      </svg>
    ),
  },
  strat: {
    id: "strat",
    word: "Strat",
    photo: photos.strat019,
    line: "Gilmour-style on a Fender Strat",
  },
  meusic: {
    id: "meusic",
    word: "Meusic",
    photo: photos.strat016,
    line: products[0].line,
  },
  pillar: {
    id: "pillar",
    word: "Pillar",
    line: products[1].line,
    face: (
      <svg viewBox="0 0 40 40" aria-hidden>
        <rect x="8" y="22" width="24" height="10" rx="1" />
        <rect x="12" y="14" width="16" height="7" rx="1" />
        <rect x="16" y="6" width="8" height="7" rx="1" />
      </svg>
    ),
  },
  apex: {
    id: "apex",
    word: "Apex One",
    line: products[2].line,
    face: (
      <svg viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20 L20 12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  legal: {
    id: "legal",
    word: "Am I F*cked?",
    line: products[3].line,
    face: (
      <svg viewBox="0 0 40 40" aria-hidden>
        <rect x="10" y="7" width="20" height="26" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 15h12M14 21h12M14 27h7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
};

function ChipButton({ chip }: { chip: Chip }) {
  const [open, setOpen] = useState(false);

  return (
    <span className={`h-chip${open ? " is-open" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => {
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
          setOpen((v) => !v);
        }}
      >
        {chip.word}
        <span className="h-chip-pic" aria-hidden>
          {chip.photo ? (
            <Image
              src={chip.photo.src}
              alt=""
              width={chip.photo.width}
              height={chip.photo.height}
              sizes="48px"
            />
          ) : (
            chip.face
          )}
        </span>
      </button>
      <span className="h-panel" role="note" hidden={!open}>
        {chip.photo ? (
          <Image
            src={chip.photo.src}
            alt={chip.photo.alt}
            width={chip.photo.width}
            height={chip.photo.height}
            sizes="260px"
          />
        ) : chip.id === "squat" ? (
          <span className="h-panel-slot">{slots.squat}</span>
        ) : chip.id === "apex" ? (
          <span className="h-panel-slot">{slots.apex}</span>
        ) : (
          <span className="h-panel-slot">{chip.word}</span>
        )}
        <span>
          {chip.line.startsWith("placeholder") ? (
            <em className="ph">{chip.line}</em>
          ) : (
            chip.line
          )}
        </span>
      </span>
    </span>
  );
}

export function Sentence() {
  return (
    <p className="h-sentence">
      <em className="h-lead">I&apos;m Rahul</em>
      {" — I ride a red Ducati Panigale V2 S at MMRT, I "}
      <ChipButton chip={chips.squat} />
      {", I play Gilmour-style on a Fender "}
      <ChipButton chip={chips.strat} />
      {", I brew coffee at home, and I build "}
      <ChipButton chip={chips.meusic} />
      {", "}
      <ChipButton chip={chips.pillar} />
      {", "}
      <ChipButton chip={chips.apex} />
      {", and "}
      <ChipButton chip={chips.legal} />
      .
    </p>
  );
}
