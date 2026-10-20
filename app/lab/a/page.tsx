import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/app/lab/a/Nav";
import { currently, headline } from "@/lib/lab/copy";
import { photos } from "@/lib/lab/photos";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "A · Index",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="a-main">
        <section className="a-grid a-hero-copy">
          <p className="a-kicker">Index</p>
          <h1>
            <span className="ph">{headline}</span>
          </h1>
        </section>

        <figure className="a-bleed">
          <Image
            src={photos.track338.src}
            alt={photos.track338.alt}
            width={photos.track338.width}
            height={photos.track338.height}
            priority
            sizes="100vw"
          />
          <figcaption>
            <span>Panigale V2 S — MMRT</span>
            <span>01</span>
          </figcaption>
        </figure>

        <section className="a-grid a-section" aria-labelledby="currently">
          <h2 id="currently" className="a-kicker">
            Currently
          </h2>
          <ul className="a-current">
            {currently.map((row) => (
              <li key={row.id} className="a-current-row">
                <span className="a-current-label">{row.label}</span>
                {row.photo ? (
                  <div className="a-thumb">
                    <Image
                      src={row.photo.src}
                      alt={row.photo.alt}
                      width={row.photo.width}
                      height={row.photo.height}
                      sizes="120px"
                    />
                  </div>
                ) : (
                  <div className="a-slot" role="img" aria-label={row.slot}>
                    {row.slot}
                  </div>
                )}
                <p>
                  {row.line ?? <span className="ph">{row.placeholder}</span>}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="a-grid a-section" aria-labelledby="built">
          <h2 id="built" className="a-kicker">
            Spec
          </h2>
          <ul className="a-spec">
            {products.map((p) => (
              <li key={p.id}>
                <span className="a-spec-name">{p.name}</span>
                <span className="a-spec-line">{p.line}</span>
                <span className="a-spec-status">{p.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="a-grid a-foot">
        <span>{site.name}</span>
        <a href={site.github} rel="noreferrer" target="_blank">
          GitHub
        </a>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </footer>
    </>
  );
}
