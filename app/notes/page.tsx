import type { Metadata } from "next";
import Link from "next/link";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Essays and working notes, including the GPS lap-timer piece.",
};

export default function NotesPage() {
  return (
    <main className="page">
      <h1>Notes</h1>
      <p className="lede">
        Writing from the previous site lives here. The long-form essay that
        used to be the homepage — the DIY GPS lap timer versus AiM and Garmin —
        is the first one.
      </p>
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
    </main>
  );
}
