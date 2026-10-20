import type { Metadata } from "next";
import { Checks } from "@/app/lab/e/Checks";
import { Nav } from "@/app/lab/e/Nav";

export const metadata: Metadata = {
  title: "E · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="e-main">
        <h1>List 100</h1>
        <Checks />
      </main>
    </>
  );
}
