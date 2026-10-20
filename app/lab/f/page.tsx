import type { Metadata } from "next";
import { Currently } from "@/app/lab/f/Currently";
import { Nav } from "@/app/lab/f/Nav";
import { Products } from "@/app/lab/f/Products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "F · Crafted",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="f-main">
        <header className="f-intro">
          <h1>{site.name}</h1>
          <p>
            <span className="ph">[headline: who you are, 6-10 words]</span>
          </p>
          <p>
            Track days on a red Ducati Panigale V2 S at MMRT. Lifting. Gilmour-style
            on a Fender Strat. Coffee at home. Building Meusic, Pillar, Apex One,
            and Am I F*cked?.
          </p>
        </header>
        <Currently />
        <Products />
      </main>
    </>
  );
}
