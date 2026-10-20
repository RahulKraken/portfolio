import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/k", label: "Home" },
  { href: "/lab/k/blog", label: "Blog" },
  { href: "/lab/k/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "blog" | "list" }) {
  return (
    <header className="k-nav">
      <Link href="/lab/k">{site.name}</Link>
      <nav aria-label="Kit">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/k") ||
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
