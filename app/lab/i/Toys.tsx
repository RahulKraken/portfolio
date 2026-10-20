"use client";

import { useRef, useState } from "react";
import { products } from "@/lib/products";

const MAX = 160;
const STEP = 20;
const START = 80;

const plateFill = ["#1d4ed8", "#111", "#c1121f", "#eab308", "#1d4ed8"];

export function Barbell() {
  const [kg, setKg] = useState(START);
  const plates = kg / STEP;

  return (
    <button
      type="button"
      className="i-bar"
      onClick={() => setKg((n) => (n >= MAX ? STEP : n + STEP))}
      aria-label={`Barbell toy, ${kg} of ${MAX}. A toy, not his numbers.`}
    >
      <svg viewBox="0 0 240 40" aria-hidden>
        <rect x="6" y="18" width="228" height="4" rx="1" />
        <rect x="18" y="14" width="8" height="12" rx="1" />
        <rect x="214" y="14" width="8" height="12" rx="1" />
        {Array.from({ length: plates }, (_, i) => (
          <g key={i}>
            <rect
              x={30 + i * 8}
              y={6}
              width="6"
              height="28"
              rx="1"
              fill={plateFill[i % plateFill.length]}
            />
            <rect
              x={204 - i * 8}
              y={6}
              width="6"
              height="28"
              rx="1"
              fill={plateFill[i % plateFill.length]}
            />
          </g>
        ))}
      </svg>
      <span>{kg}</span>
    </button>
  );
}

function pluck(ctx: AudioContext, freq: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.2);
}

export function StringToy() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [plucked, setPlucked] = useState(false);

  function onPluck() {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctxRef.current ??= new AC();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    pluck(ctx, 196);
    setPlucked(true);
    window.setTimeout(() => setPlucked(false), 720);
  }

  return (
    <button
      type="button"
      className={`i-string${plucked ? " is-on" : ""}`}
      onClick={onPluck}
      aria-label="Pluck a string. Silent until you press it."
    >
      <svg viewBox="0 0 180 28" aria-hidden>
        <path d="M6 14 Q 90 14 174 14" />
      </svg>
      <span>pluck</span>
    </button>
  );
}

export function ProductMini() {
  const p = products[0];
  return (
    <span className="i-mini" title={p.line}>
      <span className="i-mini-bars" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      {p.name}
    </span>
  );
}
