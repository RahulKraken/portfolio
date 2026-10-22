"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

// The loading screen: a glass server pours black coffee into the progress bar. It rides the
// filling edge, so the stream always lands where the bar ends, and it tips further as it
// empties. The bar follows the real model downloads; when the studio is ready the server sets
// upright and the screen fades away.

const BAR = { x: 70, y: 160, w: 320, h: 18 }; // centred in the 460-wide drawing
const SPOUT_Y = 70; // where the stream leaves the server
const REACH = 8; // the stream's sideways travel from spout to bar

export function StudioLoader({
  ready,
  onGone,
}: {
  ready: boolean;
  onGone?: () => void;
}) {
  const { progress } = useProgress();
  const target = ready ? 1 : Math.min(progress / 100, 0.94);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"pouring" | "done" | "gone">("pouring");
  const goal = useRef(target);
  useEffect(() => {
    goal.current = Math.max(goal.current, target);
  }, [target]);
  // ease the bar toward the real progress so it pours rather than jumps
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      // before any model has started downloading, creep forward so it never looks frozen
      if (goal.current < 0.08) goal.current += 0.0005;
      setShown((v) => {
        const next = v + (goal.current - v) * 0.07;
        return goal.current - next < 0.002 ? goal.current : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  const full = ready && shown >= 0.999;
  useEffect(() => {
    if (!full) return;
    const settle = setTimeout(() => setPhase("done"), 450);
    const leave = setTimeout(() => setPhase("gone"), 1100);
    return () => {
      clearTimeout(settle);
      clearTimeout(leave);
    };
  }, [full]);
  useEffect(() => {
    if (phase === "gone") onGone?.();
  }, [phase, onGone]);
  if (phase === "gone") return null;

  const edge = BAR.x + BAR.w * shown;
  const pouring = !full;
  // tilted to pour, tipping further as the server empties; upright once the bar is full
  const tilt = pouring ? 42 + 46 * shown : 0;
  return (
    <div
      className="studio-loader"
      data-leaving={phase === "done"}
      role="progressbar"
      aria-label="Entering Rahul’s den"
      aria-valuenow={Math.round(shown * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox="0 0 460 220" aria-hidden data-pouring={pouring}>
        <defs>
          <clipPath id="loader-bar">
            <rect
              x={BAR.x}
              y={BAR.y}
              width={BAR.w}
              height={BAR.h}
              rx={BAR.h / 2}
            />
          </clipPath>
          <clipPath id="loader-glass">
            <path d={GLASS} />
          </clipPath>
        </defs>
        {/* the bar: cream track, coffee filling from the left */}
        <rect
          x={BAR.x}
          y={BAR.y}
          width={BAR.w}
          height={BAR.h}
          rx={BAR.h / 2}
          className="loader-track"
        />
        <g clipPath="url(#loader-bar)">
          <rect
            x={BAR.x - BAR.h}
            y={BAR.y}
            width={edge - BAR.x + BAR.h}
            height={BAR.h}
            className="loader-coffee"
          />
          <rect
            x={BAR.x}
            y={BAR.y + 3}
            width={Math.max(0, edge - BAR.x - 6)}
            height={2}
            rx={1}
            className="loader-crema"
          />
        </g>
        {/* the stream, from the spout down onto the filling edge */}
        <g
          className="loader-stream"
          data-on={pouring}
          transform={`translate(${edge - REACH} ${SPOUT_Y})`}
        >
          <path d={STREAM} className="loader-stream-body" />
          <path d={STREAM} className="loader-stream-flow" />
          <ellipse
            cx={REACH}
            cy={BAR.y - SPOUT_Y + 1}
            rx={6}
            ry={2}
            className="loader-splash"
          />
        </g>
        {/* the server, turning about its spout */}
        <g
          className="loader-server"
          style={{
            transform: `translate(${edge - REACH}px, ${SPOUT_Y}px) rotate(${tilt}deg)`,
          }}
        >
          {/* black coffee, its surface level with the spout whatever the tilt */}
          <g clipPath="url(#loader-glass)">
            <g style={{ transform: `rotate(${-tilt}deg)` }}>
              <rect
                x={-200}
                y={pouring ? 1 : 68}
                width={400}
                height={400}
                className="loader-coffee"
              />
            </g>
          </g>
          <path d={GLASS} className="loader-glass" />
          <path d={RIM} className="loader-glass" />
          <path d={HANDLE} className="loader-handle" />
          <path d={HANDLE} className="loader-handle-glass" />
          <path d={SHINE} className="loader-shine" />
        </g>
      </svg>
      <p>Entering Rahul’s den</p>
    </div>
  );
}

// a Timemore glass server, drawn upright with its spout tip at the origin: a short neck under
// the rim, sides flaring out to a wide flat base, the spout on the right, and a squared-off
// glass handle on the left
const GLASS =
  "M -58 2 L -6 2 Q -2 1 1 -2 Q 0 3 -3 6 L -3 12 C -1 30 8 52 7 70 C 7 79 2 82 -5 82 L -55 82 C -62 82 -67 79 -67 70 C -68 52 -59 30 -57 12 Z";
const RIM = "M -58 2 L -6 2";
const HANDLE =
  "M -57.5 10 L -82 10 Q -87 10 -87 15 L -87 50 Q -87 55 -83 57 L -65 68";
const SHINE = "M -60 36 C -63 48 -64 60 -62 72";
const STREAM = `M 0 0 C ${REACH * 0.6} 4 ${REACH} 18 ${REACH} ${BAR.y - SPOUT_Y + 1}`;
