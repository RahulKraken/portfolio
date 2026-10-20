import type { Metadata } from "next";
import { Gallery } from "@/app/lab/n/Gallery";
import { Nav } from "@/app/lab/n/Nav";
import { Statement } from "@/app/lab/n/Statement";

export const metadata: Metadata = {
  title: "N · Larose",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main>
        <Statement />
        <Gallery />
      </main>
    </>
  );
}
