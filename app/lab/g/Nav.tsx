import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/g", label: "Home" },
  { href: "/lab/g/blog", label: "Blog" },
  { href: "/lab/g/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="g-nav">
      <Link href="/lab/g">{site.name}</Link>
      <nav aria-label="One Line">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/g") ||
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
