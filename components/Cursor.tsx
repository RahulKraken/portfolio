"use client";

import { useEffect, useRef } from "react";
import { art } from "@/components/art";

// Which tool the pointer turns into over each stretch of the page
const TOOLS = { pick: art.pick, iron: art.iron, cone: art.cone, plate: art.plate } as const;

/**
 * A dot that trails the mouse and swells over anything you can touch. Over a section marked
 * with data-cursor it becomes that section's tool instead.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };

    const frame = () => {
      raf = 0;
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.2) {
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.dataset.on = "";
      dot.toggleAttribute("data-big", !!el.closest("a, button, [data-touch]"));
      dot.dataset.kind = el.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => delete dot.dataset.on;

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden>
      {Object.entries(TOOLS).map(([kind, drawing]) => (
        <span key={kind} className="cursor-tool" data-tool={kind}>
          {drawing}
        </span>
      ))}
    </div>
  );
}
