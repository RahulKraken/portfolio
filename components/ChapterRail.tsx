import Link from "next/link";
import { chapters } from "@/lib/chapters";

export function ChapterRail() {
  const four = chapters.filter((c) => c.id !== "engineering");

  return (
    <nav className="rail" aria-label="Four worlds">
      {four.map((c) => (
        <Link key={c.id} href={`/#${c.id}`} className={`rail-${c.id}`}>
          <div>
            <span className="rail-n">{c.n}</span>
            <span className="rail-kicker">{c.kicker}</span>
          </div>
          <h2>{c.title}</h2>
          <p>{c.rail}</p>
        </Link>
      ))}
    </nav>
  );
}
