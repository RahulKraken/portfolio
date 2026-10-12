"use client";

import { useEffect, useRef, useState } from "react";

export type LapState = {
  /** Sector times so far, in ms */
  splits: number[];
  lap: number | null;
  best: { lap: number; splits: number[] } | null;
};

const KEY = "lap-best";
const EVENT = "lap";
// A sector ends when the top of each of these crosses the middle of the screen
const MARKS = ["#track", "#hall", ".outro"];

export const formatLap = (ms: number) => {
  const tenths = Math.floor(ms / 100);
  return `${Math.floor(tenths / 600)}:${String(Math.floor(tenths / 10) % 60).padStart(2, "0")}.${tenths % 10}`;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The page is a lap. The clock starts when you start scrolling, takes a split at each third,
 * and stops at the footer; going back to the top resets it. It also reads your scroll speed
 * as a lean angle and tips the headlines by it.
 */
export function LapHud() {
  const hudRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const leanRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const marks = MARKS.map((q) => document.querySelector<HTMLElement>(q));
    const leaners = Array.from(document.querySelectorAll<HTMLElement>("[data-lean]"));
    const hud = hudRef.current;
    const phone = window.matchMedia("(max-width: 900px)");
    const cover = ["#built", "#craft"]
      .map((q) => document.querySelector<HTMLElement>(q))
      .filter((el): el is HTMLElement => Boolean(el));
    const syncAway = () => {
      const narrow = phone.matches || window.innerWidth <= 900;
      const onBench = cover.some((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
      });
      hud?.toggleAttribute("data-away", narrow && onBench);
    };

    let best: LapState["best"] = null;
    try {
      best = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
    } catch {
      best = null;
    }

    let running = false;
    let finished = false;
    let t0 = 0;
    let splits: number[] = [];
    let lastY = window.scrollY;
    let lean = 0;
    let raf = 0;

    const publish = (lap: number | null) => {
      window.dispatchEvent(new CustomEvent<LapState>(EVENT, { detail: { splits: [...splits], lap, best } }));
    };

    const frame = (now: number) => {
      raf = 0;
      const y = window.scrollY;

      if (!running && !finished && y > 40) {
        running = true;
        t0 = now;
      }
      if (y < 5 && (running || finished)) {
        running = false;
        finished = false;
        splits = [];
        if (timeRef.current) timeRef.current.textContent = "0:00.0";
        publish(null);
      }

      if (running) {
        const elapsed = now - t0;
        if (timeRef.current) timeRef.current.textContent = formatLap(elapsed);
        const mark = marks[splits.length];
        if (mark && mark.getBoundingClientRect().top < window.innerHeight / 2) {
          splits.push(elapsed - splits.reduce((a, b) => a + b, 0));
          if (splits.length === marks.length) {
            running = false;
            finished = true;
            if (!best || elapsed < best.lap) {
              best = { lap: elapsed, splits: [...splits] };
              try {
                window.localStorage.setItem(KEY, JSON.stringify(best));
              } catch {
                // private mode: the best lap just won't be remembered
              }
            }
            publish(elapsed);
          } else {
            publish(null);
          }
        }
      }

      // scroll speed, read as lean
      const target = reduce ? 0 : clamp((y - lastY) * 1.1, -58, 58);
      lastY = y;
      lean += (target - lean) * 0.14;
      if (leanRef.current) leanRef.current.textContent = `${String(Math.round(Math.abs(lean))).padStart(2, "0")}°`;
      if (needleRef.current) needleRef.current.style.rotate = `${lean.toFixed(1)}deg`;
      for (const el of leaners) el.style.setProperty("--lean", lean.toFixed(2));

      if (running || Math.abs(lean) > 0.05) raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      syncAway();
      schedule();
    };

    publish(null);
    syncAway();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncAway);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncAway);
    };
  }, []);

  return (
    <div className="lap-hud" ref={hudRef} aria-hidden>
      <span className="lap-dot" />
      <span ref={timeRef} className="lap-time">
        0:00.0
      </span>
      <span className="lap-lean">
        <span ref={needleRef} className="lap-needle" />
        <span ref={leanRef}>00°</span>
      </span>
    </div>
  );
}

/** The pit board at the finish: this lap, the best lap, and the three sectors. */
export function LapBoard() {
  const [state, setState] = useState<LapState>({ splits: [], lap: null, best: null });

  useEffect(() => {
    const onLap = (e: Event) => setState((e as CustomEvent<LapState>).detail);
    window.addEventListener(EVENT, onLap);
    return () => window.removeEventListener(EVENT, onLap);
  }, []);

  const { splits, lap, best } = state;

  return (
    <div className="lap-board" aria-live="polite">
      <div className="lap-board-row is-now">
        <span>Lap</span>
        <span>{lap ? formatLap(lap) : "-:--.-"}</span>
      </div>
      <div className="lap-board-row">
        <span>Best</span>
        <span>{best ? formatLap(best.lap) : "-:--.-"}</span>
      </div>
      <div className="lap-board-sectors">
        {[0, 1, 2].map((i) => {
          const done = splits[i] !== undefined;
          // purple when a sector matches or beats your best, the way a timing screen shows it
          const purple = done && best ? splits[i] <= best.splits[i] : false;
          return (
            <span key={i} className={done ? (purple ? "is-purple" : "is-set") : undefined}>
              S{i + 1} {done ? formatLap(splits[i]) : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
