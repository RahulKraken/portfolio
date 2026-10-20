import type { Metadata } from "next";
import { Nav } from "@/app/lab/e/Nav";
import { Tiles } from "@/app/lab/e/Tiles";

export const metadata: Metadata = {
  title: "E · Playful",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="e-main">
        <h1>
          <span className="ph">[headline: who you are, 6-10 words]</span>
        </h1>
        <p className="e-lede">
          Five parts of the same person. Press them. Photos stay out of the
          way.
        </p>
        <Tiles />
      </main>
    </>
  );
}
