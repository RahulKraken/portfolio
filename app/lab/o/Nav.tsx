import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/o", label: "Home" },
  { href: "/lab/o/blog", label: "Blog" },
  { href: "/lab/o/list-100", label: "List 100" },
] as const;

export function Nav({
  here,
  stacked = false,
}: {
  here: "home" | "blog" | "list";
  stacked?: boolean;
}) {
  return (
    <header className={stacked ? "o-nav o-nav-stack" : "o-nav"}>
      <Link href="/lab/o" className="o-mark">
        {site.name}
      </Link>
      <nav aria-label="Collier">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/o") ||
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
