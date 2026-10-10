"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock } from "@/components/Clock";
import { navMain, navMeta } from "@/lib/chapters";
import { site } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className={`nav${open ? " is-open" : ""}`}>
      <Link className="nav-mark" href="/" onClick={close}>
        {site.name}
      </Link>
      <nav className="nav-main" aria-label="Chapters">
        {navMain.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="nav-meta">
        {navMeta.map((item) =>
          "external" in item && item.external ? (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ),
        )}
        <Clock />
      </div>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav id="mobile-nav" className="nav-drawer" aria-label="Mobile">
        {navMain.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>
            {item.label}
          </Link>
        ))}
        {navMeta.map((item) =>
          "external" in item && item.external ? (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href} onClick={close}>
              {item.label}
            </Link>
          ),
        )}
        <Clock />
      </nav>
    </header>
  );
}
