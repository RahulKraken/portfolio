import type { Metadata } from "next";
import { Hall, Marquee } from "@/app/lab/k/Hall";
import { Nav } from "@/app/lab/k/Nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "K · Kit",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="k-home">
        <h1>
          <span className="k-thin">{site.name.split(" ")[0]}</span>
          <span className="k-heavy">{site.name.split(" ")[1]}</span>
        </h1>
        <p className="k-voice">
          <span className="ph">[opening: who you are, in your voice]</span>
        </p>
        <Marquee />
        <Hall />
      </main>
    </>
  );
}
