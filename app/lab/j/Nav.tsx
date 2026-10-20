"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/j", label: "Home" },
  { href: "/lab/j/blog", label: "Blog" },
  { href: "/lab/j/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  const router = useRouter();
  const path = usePathname();
  const [wipe, setWipe] = useState(false);

  function go(href: string, e: MouseEvent<HTMLAnchorElement>) {
    if (href === path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    setWipe(true);
    window.setTimeout(() => {
      router.push(href);
      setWipe(false);
    }, 420);
  }

  return (
    <>
      <header className="j-nav">
        <Link href="/lab/j" onClick={(e) => go("/lab/j", e)}>
          {site.name}
        </Link>
        <nav aria-label="Two Worlds">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => go(l.href, e)}
              aria-current={
                (here === "home" && l.href === "/lab/j") ||
                (here === "blog" && l.href.endsWith("/blog")) ||
                (here === "list" && l.href.endsWith("/list-100"))
                  ? "page"
                  : undefined
              }
            >
              {l.label}
            </Link>
          ))}
          <Link href="/lab">Lab</Link>
        </nav>
      </header>
      <div className={`j-wipe${wipe ? " is-on" : ""}`} aria-hidden />
    </>
  );
}
