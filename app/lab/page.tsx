import type { Metadata } from "next";
import Link from "next/link";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const directions = [
  {
    href: "/lab/g",
    key: "G",
    name: "One Line",
    line: "A single stroke is the identity. It draws the racing line, a string, a check.",
  },
  {
    href: "/lab/h",
    key: "H",
    name: "The Sentence",
    line: "One huge sentence. Key nouns open into small pictures.",
  },
  {
    href: "/lab/i",
    key: "I",
    name: "Live Paragraphs",
    line: "A calm bio with working toys in the words. Chip-style archive.",
  },
  {
    href: "/lab/j",
    key: "J",
    name: "Two Worlds",
    line: "Light for building, dark for life. Scroll flips the page.",
  },
] as const;

export default function LabIndexPage() {
  return (
    <main className="lab-index" data-lab="index">
      <header className="lab-index-head">
        <span>Lab — comparison only</span>
        <Link href="/">Live site</Link>
      </header>
      <h1>Four new directions</h1>
      <p className="lab-index-lede">
        Home is who he is. Blog and List 100 are in the nav. Photos stay
        supporting. The live site is untouched.
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
