"use client";

import { useEffect } from "react";

export function Worlds() {
  useEffect(() => {
    const root = document.querySelector(".lab-j");
    const dark = document.querySelector("[data-world='dark']");
    if (!root || !dark) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("is-dark", entry.isIntersecting && entry.intersectionRatio >= 0.32);
      },
      { threshold: [0.32, 0.55, 0.8] },
    );
    io.observe(dark);
    return () => {
      io.disconnect();
      root.classList.remove("is-dark");
    };
  }, []);
  return null;
}
