import type { Metadata } from "next";
import { Nav } from "@/app/lab/a/Nav";
import { groupNotes, labNotes } from "@/lib/lab/notes";

export const metadata: Metadata = {
  title: "A · Notes",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labNotes();
  const groups = groupNotes(items);

  return (
    <>
      <Nav here="notes" />
      <main className="a-main">
        <section className="a-grid a-hero-copy">
          <p className="a-kicker">Notes</p>
          <h1>Index</h1>
          {usingSample ? (
            <p className="a-flag">
              Sample layout · 0 published. Rows are placeholders.
            </p>
          ) : null}
        </section>
        <div className="a-notes">
          {groups.map((g) => (
            <section key={g.year} className="a-grid a-year">
              <h2>{g.year}</h2>
              <ul>
                {g.items.map((n) => (
                  <li key={n.slug}>
                    <span>{n.sample ? <span className="ph">{n.title}</span> : n.title}</span>
                    <span className="a-note-meta">
                      {n.sample ? <span className="ph">{n.date}</span> : n.date}
                      {n.sample ? " — sample" : ` — ${n.chapter}`}
                    </span>
                    <p>{n.sample ? <span className="ph">{n.dek}</span> : n.dek}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
