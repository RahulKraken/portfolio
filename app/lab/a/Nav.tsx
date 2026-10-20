import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/a", label: "Home" },
  { href: "/lab/a/notes", label: "Notes" },
  { href: "/lab/a/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "notes" | "list" }) {
  return (
    <header className="a-nav">
      <Link className="a-brand" href="/lab/a">
        {site.name}
      </Link>
      <nav aria-label="Direction A">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/a") ||
              (here === "notes" && l.href.endsWith("/notes")) ||
              (here === "list" && l.href.endsWith("/list-100"))
                ? "page"
                : undefined
            }
          >
            {l.label}
          </Link>
        ))}
        <Link className="a-lab" href="/lab">
          Lab
        </Link>
      </nav>
    </header>
  );
}
