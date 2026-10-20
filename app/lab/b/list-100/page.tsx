import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/app/lab/b/Nav";
import { catNo, list100, pad3, sampleDoneCount } from "@/lib/lab/list100";

export const metadata: Metadata = {
  title: "B · List 100",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="list" />
      <main className="b-text">
        <header className="b-text-head">
          <p className="b-kicker">List 100</p>
          <h1>
            {pad3(sampleDoneCount)}
            <span> / 100</span>
          </h1>
          <p className="b-flag">
            Sample data · {sampleDoneCount} marked done for layout. Not his list.
          </p>
        </header>
        <ol className="b-list">
          {list100.map((item) => (
            <li
              key={item.n}
              className={item.done ? "is-done" : "is-open"}
            >
              {item.done && item.photo ? (
                <div className="b-thumb">
                  <Image
                    src={item.photo.src}
                    alt={item.photo.alt}
                    width={item.photo.width}
                    height={item.photo.height}
                    sizes="72px"
                  />
                </div>
              ) : (
                <span className="b-thumb-empty" aria-hidden />
              )}
              <span className="b-no">{catNo(item.n)}</span>
              <span className="b-title">{item.title}</span>
              <span className="b-status">
                {item.done ? (
                  <span className="ph">{item.doneDate}</span>
                ) : (
                  "Open"
                )}
              </span>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
