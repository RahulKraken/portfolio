import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List 100",
  description: "100 as shorthand for meaningful repetition — not a leaderboard.",
};

const lit = [
  { i: 0, label: "laps" },
  { i: 12, label: "songs" },
  { i: 27, label: "sessions" },
  { i: 41, label: "boards" },
  { i: 63, label: "projects" },
  { i: 88, label: "reps" },
  { i: 99, label: "100" },
];

export default function List100Page() {
  const marked = new Set(lit.map((x) => x.i));
  const labels = Object.fromEntries(lit.map((x) => [x.i, x.label]));

  return (
    <main className="page">
      <h1>List 100</h1>
      <p className="lede">
        He uses “100” as shorthand for meaningful repetition: 100 laps, 100
        projects. Expertise comes from doing the thing enough times that the
        instrument starts talking back. This is not a completed list of 100
        feats. It is the reminder.
      </p>
      <div className="grid-100" aria-hidden>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className={`cell-100${marked.has(i) ? " is-on" : ""}`}>
            {labels[i] ?? ""}
          </div>
        ))}
      </div>
      <p className="lede">
        The actual 100 — what belongs on it, what doesn’t — is still his to
        fill. Until then the grid stays mostly empty on purpose.
      </p>
    </main>
  );
}
