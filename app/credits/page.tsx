import type { Metadata } from "next";
import { creditNote, credits } from "@/lib/credits";

export const metadata: Metadata = {
  title: "Credits",
  description: "Atmosphere images, licenses, and original diagrams.",
};

export default function CreditsPage() {
  return (
    <main className="page">
      <h1>Credits</h1>
      <p className="lede">{creditNote}</p>
      <div className="credits">
        {credits.map((c) => (
          <article className="credit" key={c.usedFor}>
            <h2>{c.usedFor}</h2>
            <p>
              {c.title} — {c.author}
            </p>
            <p>
              <a href={c.source} rel="noreferrer" target="_blank">
                {c.source}
              </a>
            </p>
            <p>{c.license}</p>
          </article>
        ))}
        <article className="credit">
          <h2>Type</h2>
          <p>Bebas Neue, Instrument Serif, Figtree, IBM Plex — Google Fonts.</p>
        </article>
      </div>
    </main>
  );
}
