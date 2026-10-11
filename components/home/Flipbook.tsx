"use client";

import { useEffect, useRef } from "react";

type FlipbookProps = {
  /** Frames live at `${base}-00.webp`, `${base}-01.webp`, … */
  base: string;
  count: number;
  fps?: number;
  alt: string;
  /** Scroll turns the pages instead of a clock: frame 0 → last across the pinned stretch of the nearest [data-scrub] */
  scrub?: boolean;
  width?: number;
  height?: number;
};

/** A burst of prints played back and forth like a flipbook, only while it is on screen. */
export function Flipbook({ base, count, fps = 12, alt, scrub = false, width = 900, height = 600 }: FlipbookProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frames: HTMLImageElement[] = [];
    let timer = 0;
    let step = 0;
    let raf = 0;
    let shown = -1;
    const section = scrub ? canvas.closest<HTMLElement>("[data-scrub]") : null;

    const draw = (i: number) => {
      const img = frames[i];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const load = () => {
      if (frames.length) return;
      for (let i = 0; i < count; i++) {
        const img = new window.Image();
        if (section) img.onload = () => i === wanted() && draw(i);
        else if (i === Math.floor(count / 2)) img.onload = () => draw(i);
        img.src = `${base}-${String(i).padStart(2, "0")}.webp`;
        frames[i] = img;
      }
    };

    // how far through the pinned stretch we are, as a frame number
    const wanted = () => {
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const q = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      return Math.round(q * (count - 1));
    };
    const turn = () => {
      raf = 0;
      const i = wanted();
      if (i === shown) return;
      shown = i;
      draw(i);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(turn);
    };

    const play = () => {
      if (timer || reduce) return;
      timer = window.setInterval(() => {
        // ping-pong: 0 → last → 0
        const span = (count - 1) * 2;
        const t = step++ % span;
        draw(t < count ? t : span - t);
      }, 1000 / fps);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          if (section) {
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
          } else play();
        } else {
          window.removeEventListener("scroll", onScroll);
          window.clearInterval(timer);
          timer = 0;
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [base, count, fps, scrub]);

  return <canvas ref={ref} className="flipbook" width={width} height={height} role="img" aria-label={alt} />;
}
