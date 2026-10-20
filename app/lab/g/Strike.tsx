"use client";

export function Strike({ on }: { on: boolean }) {
  return (
    <svg className={`g-strike${on ? " is-on" : ""}`} viewBox="0 0 240 16" aria-hidden>
      <path d="M4 9 C 48 3, 96 13, 140 6 S 200 12, 236 7" pathLength={1} />
    </svg>
  );
}
