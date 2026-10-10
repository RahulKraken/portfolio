"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let killed = false;
    let cleanup = () => {};

    (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;

      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.12,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const heroLines = document.querySelectorAll("[data-hero-line]");
      gsap.fromTo(
        heroLines,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.08, ease: "power3.out", delay: 0.08 },
      );

      document.querySelectorAll<HTMLElement>("[data-world]").forEach((el) => {
        const img = el.querySelector(".world-bg img");
        const arts = el.querySelectorAll("[data-draw]");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.1 },
            {
              yPercent: 6,
              scale: 1.04,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
        arts.forEach((art) => {
          gsap.fromTo(
            art,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 70%", end: "top 20%", scrub: true },
            },
          );
        });
      });

      cleanup = () => {
        gsap.ticker.remove(ticker);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      killed = true;
      cleanup();
    };
  }, []);

  return children;
}
