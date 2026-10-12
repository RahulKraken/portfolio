import Image from "next/image";
import Link from "next/link";
import { art, type ArtName } from "@/components/art";
import { Attack } from "@/components/home/Attack";
import { Contours } from "@/components/home/Contours";
import { Flipbook } from "@/components/home/Flipbook";
import { LapBoard, LapHud } from "@/components/home/Lap";
import { Rail } from "@/components/home/Rail";
import { ToyBox } from "@/components/home/ToyBox";
import { vignettes, type VignetteName } from "@/components/home/Vignettes";
import { Proof } from "@/components/home/Proof";
import { WorkScene } from "@/components/home/WorkScene";
import { Mark } from "@/components/Mark";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

// The statement: plain nouns, every other one set in the serif
const words: { w: string; art?: ArtName }[] = [
  { w: "Tarmac,", art: "cone" },
  { w: "packets,", art: "terminal" },
  { w: "iron,", art: "plate" },
  { w: "solder,", art: "iron" },
  { w: "strings", art: "pick" },
  { w: "&" },
  { w: "coffee.", art: "cup" },
];

type Scatter = { cls: string; speed: number; no: string; ratio: string; print?: string; draw?: ArtName; ground?: "red" | "blue" | "dark" };

const scatter: Scatter[] = [
  { print: "strat-020", ratio: "3 / 2", cls: "s1", speed: 90, no: "03" },
  { draw: "terminal", ground: "dark", ratio: "3 / 4", cls: "s2", speed: 260, no: "04" },
  { draw: "scope", ground: "red", ratio: "3 / 2", cls: "s3", speed: 150, no: "05" },
  { draw: "kettlebell", ground: "dark", ratio: "2 / 3", cls: "s4", speed: 320, no: "06" },
  { draw: "timer", ground: "blue", ratio: "3 / 2", cls: "s5", speed: 60, no: "07" },
  { print: "strat-017", ratio: "4 / 3", cls: "s6", speed: 220, no: "08" },
];

type Built = { draw: VignetteName; title: string; turn: string; line: string };

// The day job: runtime security for AI agents. No names, only what was built.
const atWork: Built[] = [
  { draw: "kernel", title: "Probes in", turn: "the kernel", line: "eBPF on Linux, watching what a process really does." },
  { draw: "encrypted", title: "Encrypted,", turn: "still visible", line: "Reading traffic at the point it is plain, without breaking it." },
  { draw: "tunnel", title: "A tunnel", turn: "on the Mac", line: "Every packet off a laptop through one inspected path." },
  { draw: "traces", title: "Every step,", turn: "traced", line: "Each thing an agent does becomes a span. Ten million traces a day." },
  { draw: "caught", title: "The bad call,", turn: "caught", line: "Judged in context, while the agent is still running." },
  { draw: "platforms", title: "Ten platforms", turn: "in", line: "The same guard, wired into more than ten agent platforms." },
];

type HallItem = { name: string; print?: string; draw?: ArtName };

const hall: HallItem[] = [
  { name: "Helmet", print: "helmet" },
  { name: "Terminal", draw: "terminal" },
  { name: "Plate", draw: "plate" },
  { name: "Guitar", draw: "guitar" },
  { name: "Lap timer", draw: "timer" },
  { name: "Books", draw: "books" },
  { name: "Chip", draw: "chip" },
  { name: "Dripper", draw: "dripper" },
  { name: "Shield", draw: "shield" },
  { name: "Kettlebell", draw: "kettlebell" },
  { name: "Iron", draw: "iron" },
  { name: "Amp", draw: "amp" },
];

type FanCard = { print?: string; draw?: ArtName; ground?: "red" | "blue" | "dark" };

const fan: FanCard[] = [
  { print: "strat-016" },
  { draw: "dripper", ground: "dark" },
  { draw: "shield", ground: "blue" },
  { print: "strat-019" },
  { draw: "plate", ground: "red" },
];


type StickerSpec = {
  art: ArtName;
  /** Position and width as CSS lengths */
  x: string;
  y: string;
  w: string;
  /** Resting rotation in degrees */
  r?: number;
  /** How far it drifts with the pointer (px) and with scroll (vh) */
  drift?: number;
  lift?: number;
  spin?: boolean;
};

/** A drawn object stuck onto a section: it drifts with the pointer and slides with the scroll. */
function Stickers({ items }: { items: StickerSpec[] }) {
  return (
    <>
      {items.map((it, i) => (
        <div
          key={i}
          className={`sticker${it.spin ? " is-spin" : ""}`}
          style={
            {
              "--x": it.x,
              "--y": it.y,
              "--w": it.w,
              "--r": `${it.r ?? 0}deg`,
              "--d": it.drift ?? 20,
              "--s": it.lift ?? 0,
            } as React.CSSProperties
          }
          data-drift
          aria-hidden
        >
          {art[it.art]}
        </div>
      ))}
    </>
  );
}

// The other things, floating around the helmet at different depths
const orbit: StickerSpec[] = [
  { art: "guitar", x: "7%", y: "13%", w: "12vw", r: -16, drift: -46 },
  { art: "chip", x: "25%", y: "12%", w: "7vw", r: 12, drift: 60 },
  { art: "terminal", x: "19%", y: "48%", w: "12vw", r: 7, drift: 30 },
  { art: "pick", x: "10%", y: "62%", w: "3.4vw", r: 28, drift: 80 },
  { art: "kettlebell", x: "68%", y: "12%", w: "8vw", r: 10, drift: 50 },
  { art: "plate", x: "86%", y: "9%", w: "7.5vw", drift: -60, spin: true },
  { art: "amp", x: "78%", y: "38%", w: "12vw", r: -6, drift: -32 },
  { art: "dripper", x: "66%", y: "56%", w: "6.5vw", r: 9, drift: 44 },
];

const cornerStickers: StickerSpec[] = [
  { art: "cone", x: "3%", y: "70%", w: "6vw", r: -10, drift: 40 },
  { art: "flag", x: "88%", y: "8%", w: "8vw", r: 8, drift: -36 },
  { art: "tyres", x: "90%", y: "64%", w: "6vw", r: 6, drift: 30 },
];

const statementStickers: StickerSpec[] = [
  { art: "terminal", x: "3%", y: "56%", w: "12vw", r: -8, lift: 70 },
  { art: "kettlebell", x: "86%", y: "20%", w: "8vw", r: 10, lift: 120 },
  { art: "pick", x: "79%", y: "78%", w: "4vw", r: 30, lift: 180, drift: 40 },
  { art: "tyres", x: "10%", y: "14%", w: "5.5vw", r: 6, lift: 150 },
];

const scatterStickers: StickerSpec[] = [
  { art: "bean", x: "30%", y: "29%", w: "3vw", r: 20, lift: 260, drift: 40 },
  { art: "bean", x: "62%", y: "57%", w: "2.4vw", r: -40, lift: 340, drift: 50 },
  { art: "pick", x: "88%", y: "11%", w: "4vw", r: -18, lift: 200, drift: 36 },
  { art: "cone", x: "4%", y: "61%", w: "5vw", r: 8, lift: 120 },
  { art: "brick", x: "56%", y: "91%", w: "7vw", r: -10, lift: 180 },
  { art: "led", x: "92%", y: "66%", w: "2.6vw", r: 12, lift: 300, drift: 44 },
];

const hallStickers: StickerSpec[] = [
  { art: "tyres", x: "88%", y: "3%", w: "6vw", r: 8, lift: 60 },
  { art: "cup", x: "70%", y: "1.5%", w: "6vw", r: -6, lift: 90 },
  { art: "bean", x: "62%", y: "5%", w: "2.4vw", r: 30, lift: 140, drift: 40 },
];

const fanStickers: StickerSpec[] = [
  { art: "palm", x: "3%", y: "30%", w: "13vw", r: -4, lift: 60 },
  { art: "flag", x: "13%", y: "10%", w: "6vw", r: 6, lift: 110 },
  { art: "tyres", x: "86%", y: "52%", w: "8vw", r: 6, lift: 70 },
  { art: "cone", x: "78%", y: "70%", w: "4.5vw", r: -10, lift: 130, drift: 36 },
  { art: "kettle", x: "80%", y: "12%", w: "11vw", r: 8, lift: 90 },
];

export default function HomePage() {
  return (
    <main className="home">
      <div className="loader" aria-hidden>
        <span>
          <Mark />
        </span>
      </div>
      <LapHud />

      {/* Hero: the machine on paper. On scroll the page shrinks into a card while giant words pass behind it. */}
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
            <div className="hero-orbit" aria-hidden>
              {orbit.map((o, i) => (
                <div
                  key={o.art}
                  className={`orbit-item${o.spin ? " is-spin" : ""}`}
                  style={
                    { "--x": o.x, "--y": o.y, "--w": o.w, "--r": `${o.r ?? 0}deg`, "--d": o.drift, "--i": i } as React.CSSProperties
                  }
                >
                  {art[o.art]}
                </div>
              ))}
            </div>
            <ToyBox />
            <h1 className="sr-only">
              {site.name}. What I’ve built.
            </h1>
            <div className="hero-helmet">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/print/helmet.webp" alt="A racing helmet, as a halftone print" width={900} height={1302} />
            </div>
            <span className="hero-cue" aria-hidden />
          </div>
        </div>
      </section>

      <Proof />

      {/* Statement: a line drawn by scrolling, then seven words that light up one by one */}
      <section className="statement on-paper" data-scrub data-cursor="pick">
        <Stickers items={statementStickers} />
        <svg className="scribble" viewBox="0 0 1200 300" aria-hidden>
          <path
            pathLength="1"
            d="M-20 250 C140 240 200 60 330 70 C470 80 420 250 560 240 C700 230 690 40 830 50 C960 60 930 210 1040 190 C1120 176 1150 80 1230 20"
          />
        </svg>
        <span className="badge" aria-hidden>
          <Mark />
        </span>
        <p className="statement-text" style={{ "--n": words.length } as React.CSSProperties} data-lean>
          {words.map((word, i) => (
            <span key={word.w} className={i % 2 === 0 ? "serif" : undefined} style={{ "--i": i } as React.CSSProperties}>
              {word.art ? <i className="word-art">{art[word.art]}</i> : null}
              {word.w}{" "}
            </span>
          ))}
        </p>
      </section>

      {/* Prints scattered across the page at different sizes, each drifting at its own speed */}
      <section className="scatter on-paper" data-scrub>
        <Contours seed={3} />
        <Stickers items={scatterStickers} />
        <div className="scatter-sun" aria-hidden data-drift>
          {art.sun}
        </div>
        {scatter.map((s) => (
          <figure key={s.no} className={`scatter-item ${s.cls}`} style={{ "--speed": s.speed } as React.CSSProperties} data-drift>
            <figcaption>No. {s.no}</figcaption>
            <div className={s.ground ? `plate plate-${s.ground}` : undefined} style={{ aspectRatio: s.ratio }} data-reveal>
              {s.print ? (
                <Image src={`/photos/print/${s.print}.webp`} alt="" fill unoptimized sizes="(max-width: 900px) 70vw, 40vw" />
              ) : (
                art[s.draw!]
              )}
            </div>
          </figure>
        ))}
      </section>

      {/* One corner, as big as the screen: scrolling turns the pages */}
      <section className="corner" data-scrub data-cursor="cone">
        <div className="corner-stage" data-drift>
          <Stickers items={cornerStickers} />
          <div className="corner-frame">
            <Flipbook
              base="/photos/print/seq/corner"
              count={28}
              scrub
              width={1500}
              height={1000}
              alt="A rider leaning through one corner, frame by frame"
            />
            <span className="corner-tag">
              One corner <b>28</b>
            </span>
          </div>
        </div>
      </section>

      {/* On track / off track */}
      <section className="split" id="track" data-cursor="cone">
        <Link className="panel panel-on" href="/ride" data-reveal data-tilt>
          <div className="panel-art" aria-hidden>
            {(["flag", "lights", "cone", "tyres"] as ArtName[]).map((name) => (
              <div key={name} className={`float float-${name}`}>
                {art[name]}
              </div>
            ))}
          </div>
          <h2 data-lean>
            On <span className="serif">track</span>
          </h2>
          <span className="panel-go">Ride it</span>
        </Link>
        <a className="panel panel-off" href="#hall" data-reveal data-tilt>
          <div className="panel-art" aria-hidden>
            {(["plate", "guitar", "chip", "dripper", "books"] as ArtName[]).map((name) => (
              <div key={name} className={`float float-${name}`}>
                {art[name]}
              </div>
            ))}
          </div>
          <h2 data-lean>
            Off <span className="serif">track</span>
          </h2>
          <span className="panel-go">The hall</span>
        </a>
        <a className="panel panel-work" href="#engineering" data-reveal data-tilt>
          <div className="panel-art" aria-hidden>
            {(["terminal", "shield", "chip"] as ArtName[]).map((name) => (
              <div key={name} className={`float float-${name}`}>
                {art[name]}
              </div>
            ))}
          </div>
          <h2 data-lean>
            At <span className="serif">work</span>
          </h2>
          <span className="panel-go">The job</span>
        </a>
      </section>

      {/* At work, then after hours: one card per thing built, travelling sideways */}
      <Rail id="engineering" label="Engineering craft, then what I build after hours">
        <span id="work" hidden />
        <header className="rail-title">
          <h2>
            At
            <span className="serif">work</span>
          </h2>
          <p>
            Runtime security for AI agents — eBPF, macOS endpoint security,
            OpenTelemetry, detection engineering. Previously SDE-2 at Palo Alto
            Networks. Team work: the parts I built or led.
          </p>
        </header>
        <div className="built built-wide">
          <Attack>
            <WorkScene />
          </Attack>
        </div>
        {atWork.map((b, i) => (
          <article key={b.draw} className="built" data-tilt>
            <div className="built-art">{vignettes[b.draw]}</div>
            <span className="built-no">{String(i + 1).padStart(2, "0")}</span>
            <h3>
              {b.title}
              {b.turn ? (
                <>
                  {" "}
                  <span className="serif">{b.turn}</span>
                </>
              ) : null}
            </h3>
            <p>{b.line}</p>
          </article>
        ))}
        <header className="rail-title rail-title-after" id="building">
          <h2>
            After
            <span className="serif">hours</span>
          </h2>
          <p>The same four, named. Robots and boards still in the shop.</p>
        </header>
        {products.map((p) => (
          <article key={p.id} className="built built-paper" data-tilt>
            <div className="built-art">{vignettes[p.draw]}</div>
            <span className="built-no">{p.status}</span>
            <h3>{p.name}</h3>
            <p>{p.line}</p>
            {p.href ? (
              <a className="built-link" href={p.href} rel="noreferrer" target="_blank">
                {p.hrefLabel ?? "Open"}
              </a>
            ) : null}
          </article>
        ))}
      </Rail>

      {/* Hall of fame: a dozen things, half printed and half drawn */}
      <section className="hall on-paper" id="hall" data-cursor="plate" data-scrub>
        <p className="hall-number" aria-hidden data-drift>
          12
        </p>
        <Stickers items={hallStickers} />
        <header className="hall-head" data-reveal>
          <h2 data-lean>
            Things
            <span className="serif">hall of fame</span>
          </h2>
        </header>
        <ul className="hall-grid">
          {hall.map((h, i) => (
            <li key={h.name} className="hall-card" data-reveal data-tilt style={{ "--i": i % 4 } as React.CSSProperties}>
              <div className="hall-thing">
                {h.print ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/photos/print/${h.print}.webp`} alt="" loading="lazy" />
                ) : (
                  art[h.draw!]
                )}
              </div>
              <span className="hall-label">
                {h.name} <b>{String(i + 1).padStart(2, "0")}</b>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* A hand of prints, fanned */}
      <section className="fan on-paper" data-scrub data-cursor="pick">
        <p className="fan-number" aria-hidden data-drift>
          <Mark outline />
        </p>
        <Stickers items={fanStickers} />
        <div className="fan-hand" data-drift>
          {fan.map((f, i) => (
            <div
              key={i}
              className={`fan-card${f.ground ? ` plate plate-${f.ground}` : ""}`}
              style={{ "--i": i - (fan.length - 1) / 2 } as React.CSSProperties}
            >
              {f.print ? (
                <Image src={`/photos/print/${f.print}.webp`} alt="" fill unoptimized sizes="(max-width: 900px) 50vw, 22vw" />
              ) : (
                art[f.draw!]
              )}
            </div>
          ))}
        </div>
        <div className="fan-links">
          <a href="#built">Built</a>
          <Link href="/ride">Ride</Link>
          <Link href="/notes">Notes</Link>
          <a href={site.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
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
            <a href="#track">On track</a>
            <a href="#engineering">At work</a>
            <Link href="/ride">Ride</Link>
          </nav>
          <nav className="outro-links outro-links-right" aria-label="Elsewhere">
            <Link href="/notes">Notes</Link>
            <a href={site.github} rel="noreferrer" target="_blank">
              GitHub
            </a>
          </nav>
          <p className="outro-sign">
            <span>{site.name}</span>
            <Mark />
          </p>
          <LapBoard />
          <ToyBox />
        </div>
      </footer>
    </main>
  );
}
