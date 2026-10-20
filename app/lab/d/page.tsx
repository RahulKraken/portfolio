import type { Metadata } from "next";
import { Nav } from "@/app/lab/d/Nav";
import { Peek } from "@/app/lab/d/Peek";
import { slots } from "@/lib/lab/copy";
import { photos } from "@/lib/lab/photos";

export const metadata: Metadata = {
  title: "D · Letter",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="d-letter">
        <p>I&apos;m Rahul.</p>
        <p>
          <span className="ph">[opening: who you are, in your voice]</span>
        </p>
        <p>
          I ride a red Ducati <Peek photo={photos.track337}>Panigale</Peek> V2 S
          at MMRT. I <Peek slot={slots.squat}>lift</Peek>. I play Gilmour-style
          on a Fender <Peek photo={photos.strat016}>Strat</Peek>. I brew{" "}
          <Peek slot={slots.coffee}>coffee</Peek> at home. I build Meusic,
          Pillar, Apex One, and Am I F*cked?.
        </p>
        <p>
          <span className="ph">[the rest, in his words]</span>
        </p>
        <p className="d-hint">
          Hover or tap the underlined words. Photos stay small, and some are
          still empty slots.
        </p>
      </main>
    </>
  );
}
