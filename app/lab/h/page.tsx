import type { Metadata } from "next";
import { Nav } from "@/app/lab/h/Nav";
import { Sentence } from "@/app/lab/h/Sentence";

export const metadata: Metadata = {
  title: "H · The Sentence",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="h-main">
        <Sentence />
        <p className="h-now">
          Now. <span className="ph">[what you are on, in your voice]</span> I
          build Meusic, Pillar, Apex One, and Am I F*cked?. I ride a red Ducati
          Panigale V2 S at MMRT. I lift. I play Gilmour-style on a Fender Strat.
          I brew coffee at home.
        </p>
      </main>
    </>
  );
}
