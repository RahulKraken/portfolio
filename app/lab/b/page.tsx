import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/app/lab/b/Nav";
import { headline, slots } from "@/lib/lab/copy";
import { photos } from "@/lib/lab/photos";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "B · Cinematic",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main>
        <section className="b-hero">
          <Image
            src={photos.track338.src}
            alt={photos.track338.alt}
            fill
            priority
            sizes="100vw"
            className="b-cover"
          />
          <div className="b-hero-copy">
            <p className="b-hud">
              <span>MMRT</span>
              <span>Panigale V2 S</span>
            </p>
            <h1>
              <span className="ph">{headline}</span>
            </h1>
            <p className="b-hero-meta">{site.name}</p>
            <Link className="b-story" href="/lab/b/notes">
              Notes
            </Link>
          </div>
        </section>

        <section className="b-band" id="track">
          <Image
            src={photos.track337.src}
            alt={photos.track337.alt}
            fill
            sizes="100vw"
            className="b-cover"
          />
          <div className="b-band-copy">
            <h2>Track</h2>
            <p className="b-cap">Panigale V2 S — MMRT</p>
          </div>
        </section>

        <section className="b-band b-band-slot" id="iron">
          <div className="b-empty" role="img" aria-label={slots.squat}>
            {slots.squat}
          </div>
          <div className="b-band-copy">
            <h2>Iron</h2>
            <p className="b-cap">
              <span className="ph">[caption: lifting]</span>
            </p>
          </div>
        </section>

        <section className="b-band" id="strings">
          <Image
            src={photos.strat020.src}
            alt={photos.strat020.alt}
            fill
            sizes="100vw"
            className="b-cover"
          />
          <div className="b-band-copy">
            <h2>Strings</h2>
            <p className="b-cap">Gilmour-style on a Fender Strat</p>
          </div>
        </section>

        <section className="b-band b-band-build" id="build">
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            sizes="100vw"
            className="b-cover"
          />
          <div className="b-band-copy">
            <h2>Build</h2>
            <ul className="b-products">
              {products.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <span>{p.line}</span>
                </li>
              ))}
            </ul>
            <p className="b-cap">{slots.apex}</p>
          </div>
        </section>
      </main>
    </>
  );
}
