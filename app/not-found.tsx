import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Not found" };

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
