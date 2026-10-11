"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One loop for the whole page; the choreography itself lives in CSS.
 *   [data-reveal]  gets data-in the first time it scrolls into view
 *   [data-scrub]   gets --p, 0→1 as it crosses the viewport
 *   [data-drift]   gets --mx / --my, the eased pointer in −1…1 (parallax)
 *   [data-tilt]    gets --tx / --ty, the pointer inside that element in −1…1
 *   [data-magnet]  same, and is pulled a little toward the pointer
 *   [data-rush]    its CSS animation speeds up with scroll velocity
 * Smooth scrolling comes from Lenis, loaded only when motion is welcome.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-motion");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));

    if (reduce) return () => io.disconnect();

    const all = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(document.querySelectorAll<T>(sel));
    const scrubs = all("[data-scrub]");
    const drifts = all("[data-drift]");
    const rushes = all("[data-rush]");

    const pointer = { x: 0, y: 0, ex: 0, ey: 0 };
    let lastY = window.scrollY;
    let speed = 0;
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of scrubs) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        el.style.setProperty("--p", p.toFixed(4));
      }

      pointer.ex += (pointer.x - pointer.ex) * 0.08;
      pointer.ey += (pointer.y - pointer.ey) * 0.08;
      for (const el of drifts) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) continue;
        el.style.setProperty("--mx", pointer.ex.toFixed(4));
        el.style.setProperty("--my", pointer.ey.toFixed(4));
      }

      // scroll speed winds the marquees up, then lets them settle
      const y = window.scrollY;
      speed += (Math.abs(y - lastY) - speed) * 0.12;
      lastY = y;
      const rate = 1 + Math.min(7, speed / 6);
      for (const el of rushes) {
        for (const a of el.getAnimations()) a.playbackRate = rate;
      }

      const settling =
        Math.abs(pointer.x - pointer.ex) + Math.abs(pointer.y - pointer.ey) > 0.002 || speed > 0.05;
      if (settling) schedule();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    let hot: HTMLElement | null = null;
    const cool = () => {
      hot?.style.removeProperty("--tx");
      hot?.style.removeProperty("--ty");
      hot = null;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-tilt], [data-magnet]") ?? null;
      if (target !== hot) cool();
      if (target) {
        hot = target;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--tx", (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
        target.style.setProperty("--ty", (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
      }
      schedule();
    };

    frame();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer);
    document.documentElement.addEventListener("pointerleave", cool);

    let destroyLenis = () => {};
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: true });
      destroyLenis = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      io.disconnect();
      destroyLenis();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", cool);
    };
  }, [pathname]);

  return null;
}
