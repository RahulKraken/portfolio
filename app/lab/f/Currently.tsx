"use client";

import Image from "next/image";
import { useState } from "react";
import { lives, type LifeId } from "@/lib/lab/copy";

export function Currently() {
  const [id, setId] = useState<LifeId>("ride");
  const life = lives.find((item) => item.id === id)!;

  return (
    <section className="f-panel" aria-labelledby="currently">
      <h2 id="currently">Currently</h2>
      <div className="f-seg" role="tablist" aria-label="Currently">
        {lives.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === id}
            onClick={() => setId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="f-now" role="tabpanel" key={id}>
        {life.photo ? (
          <div className="f-now-photo">
            <Image
              src={life.photo.src}
              alt={life.photo.alt}
              width={life.photo.width}
              height={life.photo.height}
              sizes="120px"
            />
          </div>
        ) : (
          <div className="f-now-slot" role="img" aria-label={life.slot}>
            {life.slot}
          </div>
        )}
        <p>
          {life.line ?? <span className="ph">{life.placeholder}</span>}
        </p>
      </div>
    </section>
  );
}
