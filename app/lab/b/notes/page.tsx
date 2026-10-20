import type { Metadata } from "next";
import { Nav } from "@/app/lab/b/Nav";
import { groupNotes, labNotes } from "@/lib/lab/notes";

export const metadata: Metadata = {
  title: "B · Notes",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labNotes();
  const groups = groupNotes(items);

  return (
    <>
      <Nav here="notes" />
      <main className="b-text">
        <header className="b-text-head">
          <p className="b-kicker">Notes</p>
          <h1>Index</h1>
          {usingSample ? (
            <p className="b-flag">Sample layout · 0 published.</p>
          ) : null}
        </header>
        {groups.map((g) => (
          <section key={g.year} className="b-year">
            <h2>{g.year}</h2>
            <ul>
              {g.items.map((n) => (
                <li key={n.slug}>
                  <h3>{n.sample ? <span className="ph">{n.title}</span> : n.title}</h3>
                  <p className="b-meta">
                    {n.sample ? <span className="ph">{n.date}</span> : n.date}
                  </p>
                  <p>{n.sample ? <span className="ph">{n.dek}</span> : n.dek}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
