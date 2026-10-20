import type { Metadata } from "next";
import { Line } from "@/app/lab/g/Line";
import { Nav } from "@/app/lab/g/Nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "G · One Line",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="g-home">
        <Line />
        <h1>
          <span className="g-thin">{site.name.split(" ")[0]}</span>
          <span className="g-heavy">{site.name.split(" ")[1]}</span>
        </h1>
        <p>
          <span className="ph">[opening: who you are, in your voice]</span>
        </p>
        <section>
          <h2>On track</h2>
          <p>
            I ride a red Ducati Panigale V2 S at MMRT. The stroke on the left
            is a racing line, not a photograph of the bike.
          </p>
        </section>
        <section>
          <h2>A string</h2>
          <p>
            I play Gilmour-style on a Fender Strat. Mid-page the same line
            starts to vibrate. I brew coffee at home. I lift.
          </p>
        </section>
        <section>
          <h2>A check</h2>
          <p>
            I build Meusic, Pillar, Apex One, and Am I F*cked?. On List 100 the
            line is the stroke that crosses a done row.
          </p>
        </section>
        <p>
          <span className="ph">[the rest, in his words]</span>
        </p>
      </main>
    </>
  );
}
