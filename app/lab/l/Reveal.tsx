"use client";

import { useEffect, useRef } from "react";
import { photos } from "@/lib/lab/photos";

const TOP = photos.strat019;
const UNDER = photos.helmet;

function cover(img: HTMLImageElement, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let dw = w;
  let dh = h;
  let dx = 0;
  let dy = 0;
  if (ir > cr) {
    dw = h * ir;
    dx = (w - dw) / 2;
  } else {
    dh = w / ir;
    dy = (h - dh) / 2;
  }
  return { dx, dy, dw, dh };
}

export function Reveal() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = new Image();
    const under = new Image();
    top.src = TOP.src;
    under.src = UNDER.src;

    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    const off = document.createElement("canvas");
    const o = off.getContext("2d");
    if (!mctx || !o) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let dirty = true;
    let raf = 0;
    let drawing = false;

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mask.width = off.width = canvas.width;
      mask.height = off.height = canvas.height;
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.clearRect(0, 0, w, h);
      dirty = true;
    };

    const paint = (x: number, y: number) => {
      const r = Math.max(70, Math.min(w, h) * 0.12);
      const g = mctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(0,0,0,0.85)");
      g.addColorStop(0.55, "rgba(0,0,0,0.35)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      mctx.globalCompositeOperation = "source-over";
      mctx.fillStyle = g;
      mctx.beginPath();
      mctx.arc(x, y, r, 0, Math.PI * 2);
      mctx.fill();
      dirty = true;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!dirty) return;
      if (!top.complete) return;
      dirty = false;
      ctx.clearRect(0, 0, w, h);
      if (under.complete) {
        const b = cover(under, w, h);
        ctx.drawImage(under, b.dx, b.dy, b.dw, b.dh);
      }
      if (reduce) {
        ctx.globalAlpha = 0.45;
        const t = cover(top, w, h);
        ctx.drawImage(top, t.dx, t.dy, t.dw, t.dh);
        ctx.globalAlpha = 1;
        return;
      }
      const t = cover(top, w, h);
      o.globalCompositeOperation = "copy";
      o.drawImage(top, t.dx, t.dy, t.dw, t.dh);
      o.globalCompositeOperation = "destination-out";
      o.drawImage(mask, 0, 0, w, h);
      ctx.drawImage(off, 0, 0, w, h);
    };

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const down = (e: PointerEvent) => {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      const p = pos(e);
      paint(p.x, p.y);
    };
    const move = (e: PointerEvent) => {
      if (!drawing && e.pointerType === "mouse") {
        const p = pos(e);
        paint(p.x, p.y);
        return;
      }
      if (!drawing) return;
      const p = pos(e);
      paint(p.x, p.y);
    };
    const up = () => {
      drawing = false;
    };

    size();
    top.onload = () => {
      dirty = true;
    };
    under.onload = () => {
      dirty = true;
    };
    window.addEventListener("resize", size);
    if (!reduce) {
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="l-reveal"
      aria-label="Strat in front. Move or drag to reveal the helmet underneath."
    />
  );
}
