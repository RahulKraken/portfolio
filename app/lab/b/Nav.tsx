import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/b", label: "Home" },
  { href: "/lab/b/notes", label: "Notes" },
  { href: "/lab/b/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "notes" | "list" }) {
  return (
    <header className="b-nav">
      <Link className="b-brand" href="/lab/b">
        {site.name}
      </Link>
      <nav aria-label="Direction B">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/b") ||
              (here === "notes" && l.href.endsWith("/notes")) ||
              (here === "list" && l.href.endsWith("/list-100"))
                ? "page"
                : undefined
            }
          >
            {l.label}
          </Link>
        ))}
        <Link className="b-lab" href="/lab">
          Lab
        </Link>
      </nav>
    </header>
  );
}
