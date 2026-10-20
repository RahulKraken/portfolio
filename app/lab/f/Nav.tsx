import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/f", label: "Home" },
  { href: "/lab/f/blog", label: "Blog" },
  { href: "/lab/f/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="f-nav">
      <Link href="/lab/f">{site.name}</Link>
      <nav aria-label="Crafted">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/f") ||
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
