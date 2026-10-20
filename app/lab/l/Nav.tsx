import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/l", label: "Home" },
  { href: "/lab/l/blog", label: "Blog" },
  { href: "/lab/l/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="l-nav">
      <Link href="/lab/l">{site.name}</Link>
      <nav aria-label="Reveal">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/l") ||
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
