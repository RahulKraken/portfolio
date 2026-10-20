import type { Metadata } from "next";
import Link from "next/link";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

const directions = [
  {
    href: "/lab/k",
    key: "K",
    name: "Kit",
    line: "A hall of his gear. Objects drift. A marquee follows the scroll.",
  },
  {
    href: "/lab/l",
    key: "L",
    name: "Reveal",
    line: "Paint a mask to find the image underneath. Then full-bleed chapters.",
  },
  {
    href: "/lab/m",
    key: "M",
    name: "Speed",
    line: "Kinetic type, pictures inside letters, products in a sideways run.",
  },
] as const;

export default function LabIndexPage() {
  return (
    <main className="lab-index" data-lab="index">
      <header className="lab-index-head">
        <span>Lab — comparison only</span>
        <Link href="/">Live site</Link>
      </header>
      <h1>Three visual-first directions</h1>
      <p className="lab-index-lede">
        Home is images, type, and motion. Blog and List 100 stay text, with
        the same craft. H remains at{" "}
        <Link href="/lab/h">/lab/h</Link> as reference. Live site untouched.
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
