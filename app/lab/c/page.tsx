import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/app/lab/c/Nav";
import { editorialGrid, headline } from "@/lib/lab/copy";
import { photos } from "@/lib/lab/photos";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "C · Editorial",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="c-main">
        <p className="c-kicker">A study in</p>
        <h1 className="c-hed">
          <span className="ph">{headline}</span>
        </h1>

        <p className="c-who">
          Rahul Kumar rides a red Ducati Panigale V2 S at MMRT
          <Image
            className="c-inline"
            src={photos.track337.src}
            alt={photos.track337.alt}
            width={photos.track337.width}
            height={photos.track337.height}
            sizes="120px"
          />
          He lifts
          <span className="c-inline-slot" role="img" aria-label="Photo: squat, side-on">
            Photo: squat
          </span>
          plays Gilmour-style on a Fender Strat
          <Image
            className="c-inline"
            src={photos.strat016.src}
            alt={photos.strat016.alt}
            width={photos.strat016.width}
            height={photos.strat016.height}
            sizes="140px"
          />
          brews coffee at home
          <span className="c-inline-slot" role="img" aria-label="Photo: pour-over, overhead">
            Photo: coffee
          </span>
          and builds his own products. Engineering is how they get made, not
          the headline.{" "}
          <span className="ph">[sentence: the rest, in his words]</span>
        </p>

        <section className="c-grid-wrap" aria-labelledby="stills">
          <h2 id="stills" className="c-kicker">
            Stills
          </h2>
          <ul className="c-grid">
            {editorialGrid.map((fig) => (
              <li key={fig.caption}>
                {fig.kind === "photo" ? (
                  <figure>
                    <div className="c-frame">
                      <Image
                        src={fig.photo.src}
                        alt={fig.photo.alt}
                        width={fig.photo.width}
                        height={fig.photo.height}
                        sizes="(max-width: 720px) 50vw, 25vw"
                      />
                    </div>
                    <figcaption>
                      <strong>{fig.caption}</strong>
                      <span>{fig.kicker}</span>
                    </figcaption>
                  </figure>
                ) : (
                  <figure>
                    <div className="c-frame c-frame-slot" role="img" aria-label={fig.slot}>
                      {fig.slot}
                    </div>
                    <figcaption>
                      <strong>{fig.caption}</strong>
                      <span>{fig.kicker}</span>
                    </figcaption>
                  </figure>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="c-built" aria-labelledby="built">
          <h2 id="built" className="c-kicker">
            Built
          </h2>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <h3>{p.name}</h3>
                <p>{p.line}</p>
                <span>{p.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="c-foot">
        <div className="c-foot-meta">
          <Link href="/lab/c/notes">Notes</Link>
          <Link href="/lab/c/list-100">List 100</Link>
          <a href={site.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
          <span>{site.name}</span>
        </div>
        <p className="c-wordmark" aria-hidden>
          rahul
        </p>
      </footer>
    </>
  );
}
