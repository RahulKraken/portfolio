import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/app/lab/j/Nav";
import { Worlds } from "@/app/lab/j/Worlds";
import { slots } from "@/lib/lab/copy";
import { photos } from "@/lib/lab/photos";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "J · Two Worlds",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Worlds />
      <Nav here="home" />
      <main className="j-home">
        <section className="j-world j-light" data-world="light">
          <p className="j-kicker">Building</p>
          <h1>
            <span className="j-thin">{site.name.split(" ")[0]}</span>
            <span className="j-heavy">{site.name.split(" ")[1]}</span>
          </h1>
          <p>
            <span className="ph">[opening: who you are, in your voice]</span>
          </p>
          <p>I build Meusic, Pillar, Apex One, and Am I F*cked?.</p>
          <ul className="j-cards">
            {products.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <span>{p.line}</span>
                <span>{p.status}</span>
              </li>
            ))}
          </ul>
          <p className="j-cue">Life is under this.</p>
        </section>
        <section className="j-world j-life" data-world="dark">
          <p className="j-kicker">Life</p>
          <h2>
            Iron, strings,
            <br />
            riding.
          </h2>
          <p>
            I ride a red Ducati Panigale V2 S at MMRT. I lift. I play
            Gilmour-style on a Fender Strat. I brew coffee at home.
          </p>
          <p>
            <span className="ph">[the rest, in his words]</span>
          </p>
          <div className="j-stills">
            <figure>
              <Image
                src={photos.helmet.src}
                alt={photos.helmet.alt}
                width={photos.helmet.width}
                height={photos.helmet.height}
                sizes="200px"
              />
            </figure>
            <figure>
              <Image
                src={photos.strat017.src}
                alt={photos.strat017.alt}
                width={photos.strat017.width}
                height={photos.strat017.height}
                sizes="200px"
              />
            </figure>
            <figure className="j-slot" role="img" aria-label={slots.squat}>
              {slots.squat}
            </figure>
          </div>
        </section>
      </main>
    </>
  );
}
