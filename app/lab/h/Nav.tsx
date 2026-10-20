import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/h", label: "Home" },
  { href: "/lab/h/blog", label: "Blog" },
  { href: "/lab/h/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="h-nav">
      <Link href="/lab/h">{site.name}</Link>
      <nav aria-label="The Sentence">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/h") ||
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
  );
}
