import type { Metadata } from "next";
import { Nav } from "@/app/lab/o/Nav";
import { Room } from "@/app/lab/o/Room";

export const metadata: Metadata = {
  title: "O · Collier",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" stacked />
      <main>
        <Room />
      </main>
    </>
  );
}
