"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/m", label: "Home" },
  { href: "/lab/m/blog", label: "Blog" },
  { href: "/lab/m/list-100", label: "List 100" },
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
      <header className="m-nav">
        <Link href="/lab/m" onClick={(e) => go("/lab/m", e)}>
          {site.name}
        </Link>
        <nav aria-label="Speed">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => go(l.href, e)}
              aria-current={
                (here === "home" && l.href === "/lab/m") ||
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
      <div className={`m-wipe${wipe ? " is-on" : ""}`} aria-hidden />
    </>
  );
}
