/** Labelled photo slot. Swap the div for an <img> later; keep the caption. */
export function Slot({
  note,
  className,
  tall,
}: {
  note: string;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div className={`slot2 cap${tall ? " tall" : ""}${className ? ` ${className}` : ""}`}>
      <span>{note}</span>
      <span className="o">Placeholder</span>
    </div>
  );
}
