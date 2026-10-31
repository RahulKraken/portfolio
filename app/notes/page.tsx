import type { Metadata } from "next";
import Link from "next/link";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Notes by Rahul Kumar.",
  // TODO(rahul): drop noindex and re-add to sitemap when the first note ships
  robots: { index: false, follow: true },
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  return (
    <main className="page">
      <h1>Notes</h1>
      {notes.length ? (
        <ul className="notes-list">
          {notes.map((n) => (
            <li key={n.slug}>
              <Link href={`/notes/${n.slug}`}>
                <h2>{n.title}</h2>
                <p>{n.dek}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="lede">Nothing here yet.</p>
      )}
    </main>
  );
}
