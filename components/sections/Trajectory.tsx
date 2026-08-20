import { CopyEmail } from "@/components/CopyEmail";
import { LapTrace } from "@/components/graphics/LapTrace";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Trajectory() {
  return (
    <section className="section" id="trajectory">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <p className="kicker">Trajectory</p>
            <span className="index">07</span>
          </div>
          <h2 className="display display-xl">
            A vector. Not drift.
          </h2>
          <div className="lede">
            <p>
              This is a deliberate phase of input-accumulation — Staff or
              Principal IC, or a founder track. The same pattern as the lap:
              long quiet work, then a slope that only looks sudden from
              outside.
            </p>
          </div>
          <CopyEmail />
          <div className="closing-trace">
            <LapTrace draw={false} ghost={false} />
          </div>
        </Reveal>
      </div>
      <div className="shell">
        <footer className="footer">
          <span>
            {site.name} · {site.location}
          </span>
          <a href={site.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </footer>
      </div>
    </section>
  );
}
