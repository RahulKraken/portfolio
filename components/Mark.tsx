import { markBox, markShell, markVisor } from "@/lib/mark";

/** The helmet silhouette. Sized by the font size of whatever it sits in; `outline` draws it as a line only. */
export function Mark({ outline = false, className = "" }: { outline?: boolean; className?: string }) {
  return (
    <svg className={`mark${outline ? " mark-outline" : ""}${className ? ` ${className}` : ""}`} viewBox={markBox} aria-hidden>
      <path fillRule="evenodd" d={`${markShell} ${markVisor}`} />
    </svg>
  );
}
