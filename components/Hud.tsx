"use client";

import { useEffect, useState } from "react";
import { hudSections, site } from "@/lib/site";

export function Hud() {
  const [active, setActive] = useState(hudSections[0].label);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ids = hudSections.map((s) => s.id);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);

      let current = hudSections[0].label;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.38) {
          current = hudSections.find((s) => s.id === id)?.label ?? current;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="progress" style={{ width: `${progress * 100}%` }} />
      <header className="hud">
        <a className="hud-left" href="#hero">
          {site.name}
        </a>
        <span className="hud-mid">{site.locationCode}</span>
        <span className="hud-right">{active}</span>
      </header>
    </>
  );
}
