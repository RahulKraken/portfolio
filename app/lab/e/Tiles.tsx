"use client";

import { useState } from "react";
import { lives, type LifeId } from "@/lib/lab/copy";

const order: LifeId[] = ["ride", "lift", "play", "build", "brew"];

export function Tiles() {
  const [seq, setSeq] = useState<LifeId[]>([]);
  const unlocked = seq.length === order.length && order.every((id, i) => seq[i] === id);

  function onTile(id: LifeId) {
    setSeq((prev) => {
      const next = [...prev, id];
      const expected = order.slice(0, next.length);
      if (next.every((v, i) => v === expected[i])) return next.slice(0, order.length);
      return id === order[0] ? [id] : [];
    });
  }

  return (
    <div className="e-tiles">
      {lives.map((life) => (
        <button
          key={life.id}
          type="button"
          className={`e-tile e-tile-${life.id}`}
          onClick={() => onTile(life.id)}
        >
          <span className="e-tile-name">{life.label}</span>
          <span className="e-tile-line">
            {life.line ?? <span className="ph">{life.placeholder}</span>}
          </span>
        </button>
      ))}
      <p className={`e-egg${unlocked ? " is-on" : ""}`} aria-live="polite">
        {unlocked ? "Nice." : ""}
      </p>
    </div>
  );
}
