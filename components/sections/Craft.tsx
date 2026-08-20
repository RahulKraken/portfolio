import { BloomCurve } from "@/components/graphics/BloomCurve";
import { Fretboard } from "@/components/graphics/Fretboard";
import { PairMarks } from "@/components/graphics/PairMarks";
import { Reveal } from "@/components/Reveal";
import { crafts } from "@/lib/site";

const motifs = {
  guitar: <Fretboard />,
  coffee: <BloomCurve />,
  writing: <PairMarks />,
} as const;

export function Craft() {
  return (
    <section className="section" id="craft">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <p className="kicker">Craft in parallel</p>
            <span className="index">04</span>
          </div>
          <h2 className="display display-lg">
            The same attention. Different rooms.
          </h2>
          <div className="craft-grid">
            {crafts.map((c) => (
              <article className="craft-card" key={c.id}>
                <span className="kicker">{c.kicker}</span>
                <h3>{c.label}</h3>
                <p>{c.body}</p>
                {motifs[c.id]}
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
