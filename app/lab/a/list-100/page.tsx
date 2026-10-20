import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/app/lab/a/Nav";
import { TickStrip } from "@/app/lab/a/TickStrip";
import { catNo, itemId, list100, sampleDoneCount } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "A · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="a-main">
        <section className="a-grid a-list-head">
          <p className="a-kicker">List 100</p>
          <h1>Catalogue</h1>
          <p className="a-flag">
            Sample data · {sampleDoneCount}/100 marked done for layout. Not his
            list.
          </p>
        </section>
        <div className="a-grid">
          <TickStrip />
        </div>
        <ol className="a-cat">
          {list100.map((item) =>
            item.done ? (
              <li
                key={item.n}
                id={itemId(item.n)}
                className="a-row is-done"
              >
                <details>
                  <summary>
                    <span className="a-no">{catNo(item.n)}</span>
                    <span className="a-title">{item.title}</span>
                    <span className="a-dot" aria-hidden />
                    <span className="a-date">
                      <span className="ph">{item.doneDate}</span>
                    </span>
                  </summary>
                  <div className="a-expand">
                    {item.photo ? (
                      <div className="a-expand-photo">
                        <Image
                          src={item.photo.src}
                          alt={item.photo.alt}
                          width={item.photo.width}
                          height={item.photo.height}
                          sizes="(max-width: 720px) 100vw, 420px"
                        />
                      </div>
                    ) : (
                      <div className="a-slot">Photo: not in the archive</div>
                    )}
                    <p>
                      <span className="ph">{item.note}</span>
                    </p>
                  </div>
                </details>
              </li>
            ) : (
              <li
                key={item.n}
                id={itemId(item.n)}
                className="a-row is-open"
              >
                <div className="a-row-inner">
                  <span className="a-no">{catNo(item.n)}</span>
                  <span className="a-title">{item.title}</span>
                  <span className="a-date">Open</span>
                </div>
              </li>
            ),
          )}
        </ol>
      </main>
    </>
  );
}
