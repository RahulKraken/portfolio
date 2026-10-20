"use client";

import { useEffect, useRef, useState } from "react";
import { Flipbook } from "@/components/home/Flipbook";

const COUNT = 28;

/**
 * One corner, frame by frame, as big as the screen. Scrolling turns the frames; a little readout
 * keeps count and guesses the lean angle (most at the apex, the middle of the corner).
 */
export function Corner() {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onFlip = (e: Event) => setFrame((e as CustomEvent<{ i: number }>).detail.i);
    el.addEventListener("flip", onFlip);
    return () => el.removeEventListener("flip", onFlip);
  }, []);

  const t = frame / (COUNT - 1);
  const lean = Math.round(Math.sin(Math.PI * Math.min(1, t * 1.15)) * 51);

  return (
    <div className="lean" data-scrub>
      <div className="lean-stage">
        <div className="lean-frame print-frame" ref={ref} style={{ "--k": t } as React.CSSProperties}>
          <Flipbook base="/photos/print/seq/corner" count={COUNT} scrub width={1500} height={1000} alt="One corner, frame by frame" />
          <div className="lean-hud" aria-hidden>
            <span>
              Lean <b>{lean}°</b>
            </span>
          </div>
          <span className="lean-line" aria-hidden />
        </div>
      </div>
    </div>
  );
}
