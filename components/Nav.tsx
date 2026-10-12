"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/Mark";
import { site } from "@/lib/site";

const links = [
  { href: "/#built", label: "Built" },
  { href: "/#track", label: "On track" },
  { href: "/#engineering", label: "At work" },
  { href: "/#hall", label: "Hall of fame" },
  { href: "/ride", label: "Ride" },
  { href: "/notes", label: "Notes" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="nav">
        <Link className="nav-mark" href="/" aria-label={`${site.name} — Home`} onClick={() => setOpen(false)}>
          <Mark />
          <span className="nav-name">{site.name}</span>
        </Link>
        <div className="nav-tools">
          <Link className="nav-pill" href="/#built" data-magnet>
            Built
          </Link>
          <button
            type="button"
            className="nav-burger"
            data-magnet
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <nav id="menu" className={`menu${open ? " is-open" : ""}`} aria-label="Menu" inert={!open}>
        {links.map((l, i) => (
          <Link key={l.href} href={l.href} style={{ "--i": i } as React.CSSProperties} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <a
          href={site.github}
          rel="noreferrer"
          target="_blank"
          style={{ "--i": links.length } as React.CSSProperties}
        >
          GitHub
        </a>
      </nav>
    </>
  );
}
