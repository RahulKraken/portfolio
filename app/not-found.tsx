import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <h1>Not here.</h1>
      <p className="lede">
        That URL isn’t on this site.{" "}
        <Link href="/">Back to the book.</Link>
      </p>
    </main>
  );
}
