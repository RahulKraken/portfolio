import type { Line } from "@/lib/home";

/** Small marker for copy that still needs real words. */
export function Todo() {
  return <span className="pc">TODO</span>;
}

export function Copy({ line }: { line: Line }) {
  if (!line.text) return line.todo ? <Todo /> : null;
  return (
    <>
      {line.text}
      {line.todo && line.text !== "TODO" ? (
        <>
          {" "}
          <Todo />
        </>
      ) : null}
    </>
  );
}

export function Headline({
  lines,
  className,
  as: Tag = "h2",
}: {
  lines: readonly [Line, Line];
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const [a, b] = lines;
  const marked = (a.todo && a.text !== "TODO") || (b.todo && b.text !== "TODO");
  return (
    <Tag className={className}>
      {a.text}
      {a.text && b.text ? <br /> : null}
      {b.text ? <em>{b.text}</em> : null}
      {marked ? (
        <>
          {" "}
          <Todo />
        </>
      ) : null}
    </Tag>
  );
}
