import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/d", label: "Home" },
  { href: "/lab/d/blog", label: "Blog" },
  { href: "/lab/d/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="d-nav">
      <Link href="/lab/d">{site.name}</Link>
      <nav aria-label="Letter">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/d") ||
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
