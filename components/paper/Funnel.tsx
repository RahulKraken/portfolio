import funnel from "@/lib/funnel.json";

export const sheets = funnel.sheets;

/** Where each chapter's family of sheets starts in the stack */
export const family = { cover: 0, track: 1, strings: 4, coffee: 6, build: 8, end: 10 } as const;

export type Thing = {
  /** A spot from lib/funnel.json: the headland it stands on */
  spot: keyof typeof funnel.spots;
  /** Width in funnel units (the box is 1600 × 1000) */
  w: number;
  src?: string;
  /** or an inline drawing in a 100 × 100 box */
  draw?: React.ReactNode;
  rot?: number;
  href: string;
  label: string;
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/**
 * The paper funnel: twelve lit sheets (rendered by scratchpad funnel.py), each a layer with the things
 * that stand on it. Scrolling (PaperMotion sets --t) dives through the stack: outer sheets rush past
 * first, deeper ones slower, and the next chapter's colour settles in. Below the cover, the funnel first
 * opens out of the page as a small hole and grows.
 */
export function Funnel({
  from,
  land,
  things,
  head = false,
}: {
  from: number;
  /** Colour of the page you land on */
  land: string;
  things: Thing[];
  head?: boolean;
}) {
  const { w: W, h: H } = funnel.box;
  const layers = sheets.map((s, k) => ({ ...s, k })).filter((s) => s.k >= from);
  return (
    <section
      className={`pp-portal${from === 0 ? " is-cover" : ""}`}
      data-portal
      style={{ "--bg": sheets[from].colour, "--land": land } as React.CSSProperties}
    >
      <div className="pp-stage" data-drift>
        <div className="pp-scene">
          {layers
            .slice()
            .reverse()
            .map((s) => {
              const j = s.k - from;
              const mine = things.filter((t) => funnel.spots[t.spot].sheet === s.k);
              return (
                <div
                  key={s.k}
                  className="pp-layer"
                  style={
                    {
                      "--j": j,
                      "--dive": (18 * Math.pow(0.66, j)).toFixed(2),
                      // sheets under the top one only show through its hole; clip their borders so they never peek out
                      clipPath: j > 0 ? "inset(0 3% 3% 3%)" : undefined,
                    } as React.CSSProperties
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pp-sheet" src={`/photos/paper/funnel/sheet-${String(s.k).padStart(2, "0")}.webp`} alt="" />
                  {mine.map((t) => {
                    const at = funnel.spots[t.spot];
                    return (
                      <a
                        key={t.spot}
                        href={t.href}
                        className="pp-thing"
                        aria-label={t.label}
                        style={
                          {
                            left: pct(at.x, W),
                            top: pct(at.y, H),
                            width: pct(t.w, W),
                            "--rot": `${t.rot ?? 0}deg`,
                          } as React.CSSProperties
                        }
                      >
                        {t.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.src} alt="" />
                        ) : (
                          <svg viewBox="0 0 100 100" overflow="visible" aria-hidden>
                            {t.draw}
                          </svg>
                        )}
                        <span className="pp-thing-label">{t.label}</span>
                      </a>
                    );
                  })}
                  {head && s.k === 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="pp-head"
                      src="/photos/paper/portrait.webp"
                      alt=""
                      style={{ left: pct(funnel.head.x, W), top: pct(funnel.head.y, H), width: pct(funnel.head.w, W) }}
                    />
                  ) : null}
                </div>
              );
            })}
        </div>
        <div className="pp-land" aria-hidden />
      </div>
    </section>
  );
}
