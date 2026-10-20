import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/n", label: "Home" },
  { href: "/lab/n/blog", label: "Blog" },
  { href: "/lab/n/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="n-nav">
      <Link href="/lab/n">{site.name}</Link>
      <nav aria-label="Larose">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/n") ||
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
