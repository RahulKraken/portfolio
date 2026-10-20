import type { Metadata } from "next";
import { Chapters } from "@/app/lab/l/Chapters";
import { Nav } from "@/app/lab/l/Nav";
import { Reveal } from "@/app/lab/l/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "L · Reveal",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="l-home">
        <section className="l-hero">
          <Reveal />
          <h1>
            <span className="l-thin">{site.name.split(" ")[0]}</span>
            <span className="l-heavy">{site.name.split(" ")[1]}</span>
          </h1>
        </section>
        <Chapters />
      </main>
    </>
  );
}
