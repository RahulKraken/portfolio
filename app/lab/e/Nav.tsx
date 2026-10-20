import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/e", label: "Home" },
  { href: "/lab/e/blog", label: "Blog" },
  { href: "/lab/e/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="e-nav">
      <Link href="/lab/e">{site.name}</Link>
      <nav aria-label="Playful">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/e") ||
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
