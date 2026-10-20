import type { Metadata } from "next";
import { Checklist } from "@/app/lab/f/Checklist";
import { Nav } from "@/app/lab/f/Nav";

export const metadata: Metadata = {
  title: "F · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="f-main">
        <header className="f-intro">
          <h1>List 100</h1>
        </header>
        <Checklist />
      </main>
    </>
  );
}
