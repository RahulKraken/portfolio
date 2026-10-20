import type { Metadata } from "next";
import Link from "next/link";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const directions = [
  {
    href: "/lab/d",
    key: "D",
    name: "Letter",
    line: "A note. Photos hide until you find them.",
  },
  {
    href: "/lab/e",
    key: "E",
    name: "Playful",
    line: "Color fields. One tile per part of his life.",
  },
  {
    href: "/lab/f",
    key: "F",
    name: "Crafted",
    line: "Like a small product. Interactive, precise.",
  },
] as const;

export default function LabIndexPage() {
  return (
    <main className="lab-index" data-lab="index">
      <header className="lab-index-head">
        <span>Lab — comparison only</span>
        <Link href="/">Live site</Link>
      </header>
      <h1>Three new directions</h1>
      <p className="lab-index-lede">
        Home is who he is. Blog is a real page. Photos stay supporting. The
        live site is untouched.
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
