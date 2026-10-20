import Image from "next/image";
import Link from "next/link";
import { Flipbook } from "@/components/home/Flipbook";
import { Funnel, family, sheets, type Thing } from "@/components/paper/Funnel";
import { PaperMotion } from "@/components/paper/PaperMotion";
import { PaperAmp, PaperChip, PaperCone, PaperFlag, PaperGuitar } from "@/components/paper/drawings";
import { products } from "@/lib/products";
import { site } from "@/lib/site";
import "./paper.css";

/** A paper laptop, for the build chapter (100 × 100 box) */
const PaperLaptop = (
  <g className="pp-drawn">
    <path d="M18 30 H82 V74 H18 Z" fill="#1d2433" />
    <path d="M22 34 H78 V70 H22 Z" fill="#2c4f9e" />
    <path d="M27 42 L35 48 L27 54" fill="none" stroke="#f6efe2" strokeWidth="3" />
    <rect x="38" y="52" width="16" height="3" fill="#f6efe2" />
    <path d="M8 76 H92 L86 84 H14 Z" fill="#cfd5df" />
  </g>
);

// Each thing stands on a headland of its chapter's sheets, and clicking it goes there
const things: Thing[] = [
  { spot: "1l", w: 112, src: "/photos/paper/helmet.webp", rot: -8, href: "#track", label: "Track" },
  { spot: "1r", w: 200, src: "/photos/paper/bike.webp", rot: 5, href: "#track", label: "Track" },
  { spot: "2l", w: 44, draw: PaperCone, rot: -6, href: "#track", label: "Track" },
  { spot: "3r", w: 58, draw: PaperFlag, rot: 6, href: "#track", label: "Track" },
  { spot: "4l", w: 112, draw: PaperGuitar, href: "#strings", label: "Strings" },
  { spot: "5r", w: 64, draw: PaperAmp, rot: 3, href: "#strings", label: "Strings" },
  { spot: "6l", w: 58, src: "/photos/paper/dripper.webp", href: "#coffee", label: "Coffee" },
  { spot: "7r", w: 52, src: "/photos/paper/mug.webp", href: "#coffee", label: "Coffee" },
  { spot: "8r", w: 62, draw: PaperLaptop, href: "#build", label: "Build" },
  { spot: "9l", w: 32, draw: PaperChip, rot: -10, href: "#build", label: "Build" },
];

const colour = (f: keyof typeof family) => sheets[family[f]].colour;
const chapterStyle = (f: keyof typeof family, ink: string) => ({ "--bg": colour(f), "--ink": ink }) as React.CSSProperties;

function Window({
  src,
  alt,
  ratio,
  caption,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  ratio: string;
  caption?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`pp-window ${className}`} data-reveal>
      <div className="pp-cut" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill unoptimized priority={priority} sizes="(max-width: 900px) 100vw, 60vw" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function ChapterHead({ no, title, line }: { no: string; title: string; line: string }) {
  return (
    <header className="pp-head-block" data-reveal>
      <p className="pp-kicker">
        <span>{no}</span> {title}
      </p>
      <h2>{title}</h2>
      <p className="pp-stand">{line}</p>
    </header>
  );
}

export default function HomePage() {
  return (
    <main className="pp" data-at="cover">
      <PaperMotion />
      <h1 className="sr-only">{site.name}</h1>

      {/* Cover: the yellow sheet, with every chapter showing through the funnel into the head */}
      <Funnel from={family.cover} land={colour("track")} things={things} head />

      {/* 02 Track */}
      <section className="pp-chapter" id="track" data-chapter="track" style={chapterStyle("track", "#14253f")}>
        <ChapterHead no="02" title="Track" line="Weekends at the circuit, chasing a cleaner line through the same few corners." />
        <div className="pp-grid">
          <Window className="span-wide" src="/photos/paper/track-wide.webp" alt="Leaned over through a fast corner" ratio="3 / 2" caption="Turn one, again." priority />
          <Window className="span-tall" src="/photos/paper/pit-straight.webp" alt="The empty pit straight under a grey sky" ratio="3 / 4" caption="The pit straight, before the bikes." />
          <Window className="span-small" src="/photos/paper/track-kerb.webp" alt="Leaning over the kerb on the exit of a corner" ratio="3 / 2" caption="Over the kerb." />
        </div>
        <div className="pp-corner" data-scrub>
          <div className="pp-corner-stage">
            <div className="pp-window pp-corner-window">
              <div className="pp-cut" style={{ aspectRatio: "3 / 2" }}>
                <Flipbook base="/photos/paper/corner" count={28} scrub width={1400} height={933} alt="One corner, frame by frame" />
              </div>
              <figcaption>One corner, twenty-eight frames. Scroll to ride it.</figcaption>
            </div>
          </div>
        </div>
      </section>

      <Funnel from={family.track} land={colour("strings")} things={things} />

      {/* 03 Strings */}
      <section className="pp-chapter" id="strings" data-chapter="strings" style={chapterStyle("strings", "#1d2b22")}>
        <ChapterHead no="03" title="Strings" line="A black guitar, a small amp, and solos learned one phrase at a time." />
        <div className="pp-grid">
          <Window className="span-wide" src="/photos/paper/strat-wide.webp" alt="A black guitar with a white scratchplate" ratio="3 / 2" caption="Three pickups, five positions." />
          <Window className="span-tall" src="/photos/paper/strat-body.webp" alt="The bridge and pickups up close" ratio="2 / 3" caption="Up close." />
          <aside className="pp-note span-small" data-reveal>
            <p className="pp-kicker">Built for this</p>
            <h3>Meusic</h3>
            <p>{products[0].line}</p>
            <a href="#build">See Build</a>
          </aside>
        </div>
      </section>

      <Funnel from={family.strings} land={colour("coffee")} things={things} />

      {/* 04 Coffee */}
      <section className="pp-chapter" id="coffee" data-chapter="coffee" style={chapterStyle("coffee", "#2a160d")}>
        <ChapterHead no="04" title="Coffee" line="Pour-over most mornings. Weighed to the gram, poured slowly." />
        <div className="pp-grid pp-grid-coffee">
          <Window className="span-tall" src="/photos/paper/coffee-pour.webp" alt="Ground coffee in a paper filter on a scale" ratio="2 / 3" caption="The bloom." />
          <Window className="span-tall" src="/photos/paper/coffee-bloom.webp" alt="The same filter, a minute later" ratio="2 / 3" caption="A minute later." />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pp-cutout" src="/photos/paper/mug.webp" alt="" data-reveal />
        </div>
      </section>

      <Funnel from={family.coffee} land={colour("build")} things={things} />

      {/* 05 Build */}
      <section className="pp-chapter is-dark" id="build" data-chapter="build" style={chapterStyle("build", "#f6efe2")}>
        <ChapterHead no="05" title="Build" line="Runtime security for AI agents by day. Four things of my own after hours." />
        <ol className="pp-products">
          {products.map((p, i) => (
            <li key={p.id} className="pp-product" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className="pp-product-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.name}</h3>
              <p>{p.line}</p>
              <span className="pp-product-status">{p.status}</span>
            </li>
          ))}
        </ol>
      </section>

      <Funnel from={family.build} land={colour("end")} things={things} />

      {/* The last page */}
      <footer className="pp-chapter is-dark pp-end" data-chapter="end" style={chapterStyle("end", "#f6efe2")}>
        <p className="pp-masthead pp-masthead-end">{site.name}</p>
        <nav className="pp-end-links" aria-label="Elsewhere">
          <a href={site.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
          <Link href="/notes">Notes</Link>
          <Link href="/ride">Ride</Link>
        </nav>
        <p className="pp-colophon">Issue 01 · Autumn 2026 · Cut from paper and photographs</p>
      </footer>
    </main>
  );
}
