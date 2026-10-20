import type { Metadata } from "next";
import Link from "next/link";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const directions = [
  {
    href: "/lab/a",
    key: "A",
    name: "Index",
    line: "Off-white catalogue. One red, used for done.",
  },
  {
    href: "/lab/b",
    key: "B",
    name: "Cinematic",
    line: "Dark photography. Type sits on the picture.",
  },
  {
    href: "/lab/c",
    key: "C",
    name: "Editorial",
    line: "Warm paper, serif statement, chaptered list.",
  },
] as const;

export default function LabIndexPage() {
  return (
    <main className="lab-index" data-lab="index">
      <header className="lab-index-head">
        <span>Lab · comparison only</span>
        <Link href="/">Live site</Link>
      </header>
      <h1>Three directions</h1>
      <p className="lab-index-lede">
        Home, Notes, and List 100 for each. Not indexed. Existing routes are
        untouched.
      </p>
      <ul className="lab-index-list">
        {directions.map((d) => (
          <li key={d.key}>
            <Link href={d.href}>
              <span className="lab-index-key">{d.key}</span>
              <span className="lab-index-name">{d.name}</span>
              <span className="lab-index-line">{d.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="lab-index-foot">noindex · sample data on List 100</p>
    </main>
  );
}
