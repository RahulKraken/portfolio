"use client";

import Image from "next/image";
import { useState } from "react";
import { slots } from "@/lib/lab/copy";
import { photos } from "@/lib/lab/photos";
import { products } from "@/lib/products";

const preview: Record<string, { photo?: typeof photos.strat016; slot?: string }> = {
  meusic: { photo: photos.strat016 },
  pillar: {},
  "apex-one": { slot: slots.apex },
  "am-i-fucked": {},
};

export function Products() {
  const [id, setId] = useState<string>(products[0].id);
  const active = products.find((p) => p.id === id)!;
  const shot = preview[id];

  return (
    <section className="f-panel" aria-labelledby="built">
      <h2 id="built">Building</h2>
      <div className="f-built">
        <ul className="f-products">
          {products.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={id === p.id ? "is-on" : undefined}
                onMouseEnter={() => setId(p.id)}
                onFocus={() => setId(p.id)}
                onClick={() => setId(p.id)}
              >
                <span>{p.name}</span>
                <span>{p.status}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="f-preview" aria-live="polite" key={id}>
          {shot?.photo ? (
            <div className="f-now-photo">
              <Image
                src={shot.photo.src}
                alt={shot.photo.alt}
                width={shot.photo.width}
                height={shot.photo.height}
                sizes="200px"
              />
            </div>
          ) : shot?.slot ? (
            <div className="f-now-slot" role="img" aria-label={shot.slot}>
              {shot.slot}
            </div>
          ) : (
            <div className="f-now-slot">No photo yet</div>
          )}
          <p>{active.line}</p>
        </div>
      </div>
    </section>
  );
}
