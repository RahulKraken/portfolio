import type { Metadata } from "next";
import { Nav } from "@/app/lab/i/Nav";
import { Barbell, ProductMini, StringToy } from "@/app/lab/i/Toys";

export const metadata: Metadata = {
  title: "I · Live Paragraphs",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="i-main">
        <h1>I&apos;m Rahul.</h1>
        <p>
          <span className="ph">[opening: who you are, in your voice]</span>
        </p>
        <p>
          I ride a red Ducati Panigale V2 S at MMRT. I lift{" "}
          <Barbell /> — a toy, not his numbers — and I play Gilmour-style on a
          Fender Strat you can <StringToy />. I brew coffee at home. I build{" "}
          <ProductMini />, Pillar, Apex One, and Am I F*cked?
        </p>
        <p>
          <span className="ph">[the rest, in his words]</span>
        </p>
      </main>
    </>
  );
}
