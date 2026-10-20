import Link from "next/link";
import { Contours } from "@/components/home/Contours";
import { Corner } from "@/components/home/Corner";
import { Craft } from "@/components/home/Craft";
import { LapBoard, LapHud } from "@/components/home/Lap";
import { Proof } from "@/components/home/Proof";
import { Triskelion } from "@/components/home/Triskelion";
import { Mark } from "@/components/Mark";
import { site } from "@/lib/site";

type Print = { src: string; alt: string; ratio: string; cls?: string };

const trackPrints: Print[] = [
  { src: "track-331", alt: "Leaned over at the edge of the grass", ratio: "3 / 2" },
  { src: "track-346", alt: "Knee down on the exit of a corner", ratio: "3 / 2" },
  { src: "pit-044", alt: "The empty pit straight", ratio: "3 / 4" },
];

type Stamp = { src: string; alt: string; ratio: string; value: string; unit: string; tilt: number };

// Off track is a stamp album: one small set for strings, one for coffee
const stampSets: { id: string; name: string; stamps: Stamp[] }[] = [
  {
    id: "strings",
    name: "Strings",
    stamps: [
      { src: "strat-016", alt: "A black guitar with a white scratchplate", ratio: "4 / 3", value: "6", unit: "strings", tilt: -2.5 },
      { src: "strat-019", alt: "The neck and pickups up close", ratio: "3 / 4", value: "22", unit: "frets", tilt: 3 },
    ],
  },
  {
    id: "coffee",
    name: "Coffee",
    stamps: [
      { src: "coffee-023", alt: "Ground coffee in a paper filter, on a scale", ratio: "3 / 4", value: "1", unit: "cup", tilt: 2 },
      { src: "coffee-024", alt: "The same filter, a minute later", ratio: "3 / 4", value: "1", unit: "more", tilt: -3 },
    ],
  },
];

/** A postage stamp: a halftone print inside a perforated paper edge, with its denomination */
function StampCard({ s, i }: { s: Stamp; i: number }) {
  return (
    <figure className="stamp" data-reveal style={{ "--tilt": `${s.tilt}deg`, "--i": i } as React.CSSProperties}>
      <div className="stamp-paper">
        <div className="stamp-face" style={{ aspectRatio: s.ratio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/photos/print/${s.src}.webp`} alt={s.alt} loading="lazy" />
        </div>
        <figcaption className="stamp-value">
          <b>{s.value}</b>
          <span>{s.unit}</span>
        </figcaption>
      </div>
    </figure>
  );
}

/** A round postmark with wavy cancellation lines, slapped across a set */
function Postmark({ name }: { name: string }) {
  const id = `pm-${name.toLowerCase()}`;
  return (
    <svg className="postmark" viewBox="0 0 260 120" aria-hidden>
      <defs>
        <path id={id} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="54" />
      <circle cx="60" cy="60" r="36" />
      <text>
        <textPath href={`#${id}`} startOffset="0">
          {`Off track · ${name} · Off track · ${name} ·`}
        </textPath>
      </text>
      <text className="postmark-mid" x="60" y="66" textAnchor="middle">
        2026
      </text>
      {[38, 52, 66, 80].map((y) => (
        <path key={y} d={`M124 ${y} q12 -8 24 0 t24 0 t24 0 t24 0 t24 0`} />
      ))}
    </svg>
  );
}


/** A halftone print that 'prints in' (its dots grow) the first time it scrolls into view */
function PrintCard({ p, i }: { p: Print; i: number }) {
  return (
    <figure className={`print-card ${p.cls ?? ""}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
      <div className="print-frame" style={{ aspectRatio: p.ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/photos/print/${p.src}.webp`} alt={p.alt} loading="lazy" />
      </div>
    </figure>
  );
}

function ChapterHead({
  top,
  turn,
  id,
  mark,
}: {
  top: string;
  turn: string;
  id?: string;
  mark?: React.ReactNode;
}) {
  return (
    <header className={`chapter-head${mark ? " has-mark" : ""}`} data-reveal id={id}>
      {mark}
      <h2 data-lean>
        {top}
        <span className="serif">{turn}</span>
      </h2>
    </header>
  );
}

export default function HomePage() {
  return (
    <main className="home">
      <div className="loader" aria-hidden>
        <span>
          <Mark />
        </span>
      </div>
      <LapHud />

      {/* The cover: the helmet print on a dark panel. On scroll it shrinks into a card while giant words pass behind it. */}
      <section className="hero" data-scrub>
        <div className="hero-stage">
          <div className="hero-behind" aria-hidden data-lean>
            <p>Tarmac packets iron</p>
            <p className="serif">solder strings coffee</p>
          </div>
          <div className="hero-frame tone on-dark" data-drift>
            <div className="hero-contours">
              <Contours seed={1} />
            </div>
            <h1 className="sr-only">{site.title}</h1>
            <div className="hero-helmet">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/print/helmet.webp" alt="A racing helmet, as a halftone print" width={900} height={1302} />
            </div>
          </div>
        </div>
      </section>

      {/* What I build, then the kind of systems I work on */}
      <div className="bench">
        <Proof />
        <Craft />
      </div>

      {/* On track: one corner as big as the screen, then a few prints */}
      <section className="track" id="track">
        <ChapterHead top="On" turn="track" mark={<Triskelion className="trisk-head" />} />
        <Corner />
        <div className="print-row">
          {trackPrints.map((p, i) => (
            <PrintCard key={p.src} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* Off track: strings and coffee */}
      <section className="off" id="off">
        <ChapterHead top="Off" turn="track" />
        <div className="stamp-album">
          {stampSets.map((set) => (
            <div key={set.id} className={`stamp-set stamp-set-${set.id}`}>
              {set.stamps.map((st, i) => (
                <StampCard key={st.src} s={st} i={i} />
              ))}
              <Postmark name={set.name} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer: a dark panel with a tab, rising out of a red glow */}
      <footer className="outro">
        <div className="outro-panel tone">
          <p className="outro-number" aria-hidden data-drift>
            <Mark outline />
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="outro-helmet outro-bike" src="/photos/print/bike.webp" alt="" loading="lazy" data-drift />
          <nav className="outro-links" aria-label="Pages">
            <a href="#built">Built</a>
            <a href="#craft">Work</a>
            <a href="#track">On track</a>
            <a href="#off">Off track</a>
          </nav>
          <nav className="outro-links outro-links-right" aria-label="Elsewhere">
            <Link href="/ride">Ride</Link>
            <Link href="/notes">Notes</Link>
            <a href={site.github} rel="noreferrer" target="_blank">
              GitHub
            </a>
          </nav>
          <LapBoard />
        </div>
      </footer>
    </main>
  );
}
