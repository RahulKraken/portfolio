import type { Metadata } from "next";
import { Nav } from "@/app/lab/c/Nav";
import { labNotes } from "@/lib/lab/notes";

export const metadata: Metadata = {
  title: "C · Notes",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labNotes();

  return (
    <>
      <Nav here="notes" />
      <main className="c-read">
        <p className="c-kicker">Notes</p>
        <h1>From the desk</h1>
        {usingSample ? (
          <p className="c-flag">Sample layout · 0 published. Rows are placeholders.</p>
        ) : null}
        <ol className="c-essays">
          {items.map((n) => (
            <li key={n.slug}>
              <p className="c-essay-date">
                {n.sample ? <span className="ph">{n.date}</span> : n.date}
              </p>
              <h2>{n.sample ? <span className="ph">{n.title}</span> : n.title}</h2>
              <p>{n.sample ? <span className="ph">{n.dek}</span> : n.dek}</p>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
