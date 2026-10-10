import Link from "next/link";
import type { Chapter } from "@/lib/chapters";
import {
  buildingCopy,
  engineeringCopy,
  musicCopy,
  strengthCopy,
  trackCopy,
} from "@/lib/chapters";

export function ChapterBody({ chapter }: { chapter: Chapter }) {
  return (
    <div className="chapter-body" data-theme={chapter.theme}>
      <div className="copy">{bodyFor(chapter.id)}</div>
    </div>
  );
}

function NoteLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="note-link" href={href}>
      {label} →
    </Link>
  );
}

function bodyFor(id: Chapter["id"]) {
  if (id === "track") {
    return (
      <>
        {trackCopy.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <NoteLink href={trackCopy.note.href} label={trackCopy.note.label} />
      </>
    );
  }
  if (id === "strength") {
    return (
      <>
        <ul className="lifts">
          {strengthCopy.lifts.map((l) => (
            <li key={l.label}>
              <span>{l.label}</span>
              <strong>{l.value}</strong>
            </li>
          ))}
        </ul>
        {strengthCopy.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <NoteLink href={strengthCopy.note.href} label={strengthCopy.note.label} />
      </>
    );
  }
  if (id === "music") {
    return (
      <>
        {musicCopy.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <NoteLink href={musicCopy.note.href} label={musicCopy.note.label} />
      </>
    );
  }
  if (id === "building") {
    return (
      <>
        <ul className="products">
          {buildingCopy.products.map((p) => (
            <li key={p.name}>
              <strong>{p.name}</strong>
              <p>
                {p.line}{" "}
                {"href" in p && p.href ? (
                  <a href={p.href} rel="noreferrer" target="_blank">
                    Source
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
        {buildingCopy.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <NoteLink href={buildingCopy.note.href} label={buildingCopy.note.label} />
      </>
    );
  }
  return (
    <>
      {engineeringCopy.paragraphs.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
    </>
  );
}
