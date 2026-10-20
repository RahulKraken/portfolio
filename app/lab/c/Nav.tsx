import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/lab/c", label: "Home" },
  { href: "/lab/c/notes", label: "Notes" },
  { href: "/lab/c/list-100", label: "List 100" },
] as const;

export function Nav({ here }: { here: "home" | "notes" | "list" }) {
  return (
    <header className="c-nav">
      <Link className="c-brand" href="/lab/c">
        {site.name}
      </Link>
      <nav aria-label="Direction C">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              (here === "home" && l.href === "/lab/c") ||
              (here === "notes" && l.href.endsWith("/notes")) ||
              (here === "list" && l.href.endsWith("/list-100"))
                ? "page"
                : undefined
            }
          >
            {l.label}
          </Link>
        ))}
        <Link className="c-lab" href="/lab">
          Lab
        </Link>
      </nav>
    </header>
  );
}
