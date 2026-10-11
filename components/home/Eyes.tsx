"use client";

import { useEffect } from "react";

/** Every drawn face on the page looks at the pointer. */
export function Eyes() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      // faces come and go (toys fall, rails slide), so look them up each time
      document.querySelectorAll<SVGGElement>(".face").forEach((face) => {
        const rect = face.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh || rect.width === 0) return;
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        // pupils travel further the further away you are, up to the edge of the eye
        const reach = Math.min(1, dist / 220) * 5.5;
        face.style.setProperty("--ex", ((dx / dist) * reach).toFixed(2));
        face.style.setProperty("--ey", ((dy / dist) * reach).toFixed(2));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      schedule();
    };

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return null;
}
