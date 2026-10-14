import Image from "next/image";
import Link from "next/link";
import { HomeNav } from "@/components/home/HomeNav";
import { Copy, Headline, Todo } from "@/components/home/Todo";
import { Slot } from "@/components/home/Slot";
import { homeCopy as copy } from "@/lib/home";
import { site } from "@/lib/site";
import "./v5.css";

function Lab({ children }: { children: React.ReactNode }) {
  return <div className="lab cap o">{children}</div>;
}

export default function HomePage() {
  return (
    <main className="v5">
      <header className="hero">
        <div className="grid" aria-hidden />
        <span className="plus" style={{ left: "calc(100% / 6 * 1 - 6px)", top: 214 }} />
        <span className="plus" style={{ left: "calc(100% / 6 * 5 - 6px)", top: 214 }} />
        <span className="plus" style={{ left: "calc(100% / 6 * 1 - 6px)", top: 654 }} />
        <span className="plus" style={{ left: "calc(100% / 6 * 5 - 6px)", top: 654 }} />
        <span className="plus" style={{ left: "calc(100% / 6 * 3 - 6px)", top: 434 }} />
        {copy.hero.ghost.text ? <div className="ghost">{copy.hero.ghost.text}</div> : null}
        <Link className="brand" href="/">
          {copy.brand}
        </Link>
        <HomeNav />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="por" src={copy.hero.portrait.src} alt={copy.hero.portrait.alt} />
        <h1 className="sr-only">{site.name}</h1>
        <p className="xs intro">
          <Copy line={copy.hero.intro} />
        </p>
        <a className="thumb" href={copy.hero.thumb.href}>
          <Image
            src={copy.hero.thumb.src}
            alt={copy.hero.thumb.alt}
            width={150}
            height={120}
            priority
            unoptimized
            style={{ objectPosition: "50% 40%" }}
          />
          <div className="c xs">
            <span>◎ {copy.hero.thumb.kicker}</span>
            <span>{copy.hero.thumb.path}</span>
          </div>
        </a>
        <div className="xs year">{copy.hero.year}</div>
        <Headline className="big" lines={copy.hero.headline} as="p" />
        <a className="talk" href={copy.hero.now.href}>
          <Image
            src={copy.hero.now.src}
            alt={copy.hero.now.alt}
            width={62}
            height={62}
            unoptimized
            style={{ objectPosition: "60% 30%" }}
          />
          <div className="xs talk-copy">
            {copy.hero.now.label}
            <b>{copy.hero.now.name}</b>
          </div>
          <span className="ar" aria-hidden>
            ↗
          </span>
        </a>
      </header>

      <div className="ed">
        <section className="index" data-reveal>
          <div className="w">
            <span className="pill2 cap">
              <i />
              {copy.intro.kicker}
            </span>
            <p className="ser index-line">
              <Copy line={copy.intro.line} />
            </p>
          </div>
        </section>

        <section className="chap" id={copy.track.id} data-reveal>
          <div className="w">
            <div className="cols track-grid">
              <div className="track-copy">
                <Lab>{copy.track.label}</Lab>
                <Headline className="ser h" lines={copy.track.headline} />
                <p className="cap chap-dek">
                  <Copy line={copy.track.dek} />
                </p>
              </div>
              <div className="track-pic">
                <figure className="fig">
                  <Image
                    src={copy.track.photo.src}
                    alt={copy.track.photo.alt}
                    width={1600}
                    height={1066}
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 60vw"
                    style={{ objectPosition: "55% 45%" }}
                  />
                </figure>
                <div className="cap fig-cap">
                  <span>{copy.track.caption.text}</span>
                  <span>
                    <Copy line={copy.track.meta} />
                  </span>
                </div>
              </div>
              <div className="track-more">
                <ul className="strip" aria-label={copy.track.sequence.caption.text}>
                  {copy.track.sequence.frames.map((src) => (
                    <li key={src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" />
                    </li>
                  ))}
                </ul>
                <ul className="gear">
                  {copy.track.gear.map((g) => (
                    <li key={g.caption}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.src} alt="" />
                      <span className="cap">{g.caption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="chap" id={copy.iron.id} data-reveal>
          <div className="w">
            <div className="cols iron-grid">
              <Slot note={copy.iron.slot} tall />
              <div className="iron-copy">
                <Lab>{copy.iron.label}</Lab>
                <Headline className="ser h h-xl" lines={copy.iron.headline} />
                <p className="small">
                  <Copy line={copy.iron.dek} />
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="chap" id={copy.strings.id} data-reveal>
          <div className="w">
            <div className="cols strings-grid">
              <div className="strings-copy">
                <Lab>{copy.strings.label}</Lab>
                <Headline className="ser h" lines={copy.strings.headline} />
                <p className="small">
                  <Copy line={copy.strings.dek} />
                </p>
              </div>
              <Slot note={copy.strings.slot} tall />
            </div>
          </div>
        </section>

        <section className="chap coffee" id={copy.coffee.id} data-reveal>
          <div className="w">
            <Lab>{copy.coffee.label}</Lab>
            <Slot note={copy.coffee.slot} className="coffee-slot" />
            <Headline className="ser h" lines={copy.coffee.headline} />
            <p className="cap chap-dek">
              <Copy line={copy.coffee.dek} />
            </p>
          </div>
        </section>

        <section className="chap" id={copy.build.id} data-reveal>
          <div className="w">
            <div className="cols build-grid">
              <div className="build-copy">
                <Lab>{copy.build.label}</Lab>
                <p className="small">
                  <Copy line={copy.build.dek} />
                </p>
              </div>
              <ul className="list">
                {copy.build.items.map((item) => (
                  <li key={item.name} className="it">
                    <span className="ser">{item.italic ? <em>{item.name}</em> : item.name}</span>
                    <span className="cap">
                      {item.line.text ? `[ ${item.line.text} ]` : <Todo />}
                    </span>
                  </li>
                ))}
              </ul>
              <Slot note={copy.build.slot} className="build-slot" />
            </div>
          </div>
        </section>

        <footer className="chap close">
          <div className="w">
            <Headline className="ser h h-close" lines={copy.close.headline} />
            <div className="cap close-bar">
              <span>{copy.close.domain}</span>
              <span className="close-links">
                {copy.close.elsewhere.map((item, i) => (
                  <span key={item.label}>
                    {i > 0 ? " · " : null}
                    {item.href ? (
                      <a href={item.href} rel="noreferrer" target="_blank">
                        {item.label}
                      </a>
                    ) : (
                      <>
                        {item.label} <Todo />
                      </>
                    )}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
