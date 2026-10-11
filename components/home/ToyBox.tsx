"use client";

import { useEffect, useRef } from "react";
import { art, type ArtName } from "@/components/art";

const toys: { name: ArtName; size: number }[] = [
  { name: "plate", size: 1.25 },
  { name: "kettlebell", size: 1.1 },
  { name: "cone", size: 0.8 },
  { name: "terminal", size: 1.2 },
  { name: "chip", size: 1 },
  { name: "pick", size: 0.6 },
  { name: "cup", size: 0.9 },
  { name: "brick", size: 0.9 },
  { name: "shield", size: 1 },
  { name: "tyres", size: 1 },
  { name: "bean", size: 0.5 },
  { name: "timer", size: 1.1 },
  { name: "led", size: 0.6 },
  { name: "bean", size: 0.5 },
];

type Body = { el: HTMLElement; x: number; y: number; vx: number; vy: number; r: number; a: number; va: number };

/**
 * The drawn things, dropped into the footer as a pile you can grab and throw.
 * Each one is a circle as far as the physics is concerned.
 */
export function ToyBox() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(box.querySelectorAll<HTMLElement>(".toy"));
    let w = box.clientWidth;
    let h = box.clientHeight;
    const unit = () => Math.max(26, Math.min(w, h) * 0.058);

    const bodies: Body[] = els.map((el, i) => {
      const r = unit() * toys[i].size;
      el.style.width = `${r * 2}px`;
      el.style.height = `${r * 2}px`;
      return {
        el,
        r,
        // start above the box, spread out, so they rain in
        x: r + ((i * 97) % Math.max(1, w - 2 * r)),
        y: -r - i * 90,
        vx: ((i % 5) - 2) * 1.2,
        vy: 0,
        a: i * 40,
        va: ((i % 3) - 1) * 2,
      };
    });

    let held: Body | null = null;
    const grab = { x: 0, y: 0 };
    let raf = 0;
    let visible = false;
    let started = false;

    const step = () => {
      raf = 0;
      for (const b of bodies) {
        if (b === held) {
          // a held toy chases the pointer on a spring, so letting go throws it
          b.vx = (grab.x - b.x) * 0.35;
          b.vy = (grab.y - b.y) * 0.35;
        } else {
          b.vy += 0.55;
        }
        b.vx *= 0.992;
        b.vy *= 0.992;
        b.x += b.vx;
        b.y += b.vy;
        b.va = b.vx * (180 / Math.PI / b.r) * 0.9;
        b.a += b.va;

        if (b.x < b.r) {
          b.x = b.r;
          b.vx *= -0.45;
        } else if (b.x > w - b.r) {
          b.x = w - b.r;
          b.vx *= -0.45;
        }
        if (b.y > h - b.r) {
          b.y = h - b.r;
          b.vy *= -0.35;
          b.vx *= 0.94;
        }
      }

      // push overlapping circles apart and trade the velocity along the line between them
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const p = bodies[i];
          const q = bodies[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const overlap = p.r + q.r - dist;
          if (overlap <= 0) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          p.x -= nx * overlap * 0.5;
          p.y -= ny * overlap * 0.5;
          q.x += nx * overlap * 0.5;
          q.y += ny * overlap * 0.5;
          const rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
          if (rel < 0) {
            const impulse = rel * 0.7;
            p.vx += nx * impulse;
            p.vy += ny * impulse;
            q.vx -= nx * impulse;
            q.vy -= ny * impulse;
          }
        }
      }

      let moving = held !== null;
      for (const b of bodies) {
        b.el.style.transform = `translate3d(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px, 0) rotate(${b.a.toFixed(1)}deg)`;
        if (Math.abs(b.vx) + Math.abs(b.vy) > 0.6 || b.y < h - b.r - 1) moving = true;
      }
      if (visible && moving) raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(step);
    };

    // the box may be drawn scaled (the hero shrinks on scroll), so convert screen to box pixels
    const local = (e: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      const k = rect.width > 0 ? box.clientWidth / rect.width : 1;
      return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k };
    };

    const onDown = (e: PointerEvent) => {
      const toy = (e.target as HTMLElement).closest<HTMLElement>(".toy");
      if (!toy) return;
      held = bodies[els.indexOf(toy)] ?? null;
      if (!held) return;
      e.preventDefault();
      Object.assign(grab, local(e));
      toy.setPointerCapture(e.pointerId);
      toy.classList.add("is-held");
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (held) Object.assign(grab, local(e));
    };
    const onUp = () => {
      held?.el.classList.remove("is-held");
      held = null;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          started = true;
          wake();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(box);

    const onResize = () => {
      w = box.clientWidth;
      h = box.clientHeight;
      if (started) wake();
    };

    box.classList.add("is-live");
    box.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      box.classList.remove("is-live");
      box.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="toybox" ref={ref} aria-hidden>
      {toys.map((t, i) => (
        <div key={i} className="toy" data-cursor="grab">
          {art[t.name]}
        </div>
      ))}
    </div>
  );
}
