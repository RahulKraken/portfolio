"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { homeCopy } from "@/lib/home";
import { site } from "@/lib/site";

export function HomeNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav className={`v5-chapters xs${open ? " is-open" : ""}`} aria-label="Chapters">
        {homeCopy.nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <button
          type="button"
          className="v5-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="v5-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "≡"}
        </button>
      </nav>
      <div id="v5-menu" className={`v5-menu${open ? " is-open" : ""}`} hidden={!open}>
        <button type="button" className="v5-menu-close" onClick={() => setOpen(false)} aria-label="Close menu">
          ×
        </button>
        {homeCopy.menu.map((item) =>
          item.href.startsWith("/") ? (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ) : (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ),
        )}
        <a href={site.github} rel="noreferrer" target="_blank" onClick={() => setOpen(false)}>
          GitHub
        </a>
      </div>
    </>
  );
}
