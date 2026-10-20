import type { Metadata } from "next";
import Link from "next/link";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const directions = [
  {
    href: "/lab/n",
    key: "N",
    name: "Larose",
    line: "Centered display type, hover-invert rows, images that follow the cursor.",
  },
  {
    href: "/lab/o",
    key: "O",
    name: "Collier",
    line: "An explorable room. Hover or tap an object to open that part of his life.",
  },
] as const;

export default function LabIndexPage() {
  return (
    <main className="lab-index" data-lab="index">
      <header className="lab-index-head">
        <span>Lab — comparison only</span>
        <Link href="/">Live site</Link>
      </header>
      <h1>Two visual-first directions</h1>
      <p className="lab-index-lede">
        Home is type, objects, and motion. Blog and List 100 stay text, with
        the same craft. Earlier rounds remain at{" "}
        <Link href="/lab/k">/lab/k</Link>, <Link href="/lab/l">/lab/l</Link>,{" "}
        <Link href="/lab/m">/lab/m</Link>, and <Link href="/lab/h">/lab/h</Link>.
        Live site untouched.
      </p>
      <ul className="lab-index-list">
        {directions.map((d) => (
          <li key={d.key}>
            <Link href={d.href}>
              <span>{d.key}</span>
              <span className="lab-index-name">{d.name}</span>
              <span className="lab-index-line">{d.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="lab-index-foot">Not indexed. List 100 is sample data.</p>
    </main>
  );
}
