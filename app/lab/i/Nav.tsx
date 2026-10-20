import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/i", label: "Home" },
  { href: "/lab/i/blog", label: "Blog" },
  { href: "/lab/i/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="i-nav">
      <Link href="/lab/i">{site.name}</Link>
      <nav aria-label="Live Paragraphs">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/i") ||
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
