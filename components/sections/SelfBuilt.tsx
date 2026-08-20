import { BarPath } from "@/components/graphics/BarPath";
import { Reveal } from "@/components/Reveal";

export function SelfBuilt() {
  return (
    <section className="section" id="self">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <p className="kicker">The self-built thread</p>
            <span className="index">06</span>
          </div>
          <div className="self-grid">
            <div>
              <h2 className="display display-lg">
                Buy once. Keep forever.
              </h2>
              <div className="lede">
                <p>
                  Lower-middle-class origin. The rest was built: financially,
                  physically, professionally, technically. The intensity in
                  every other section has a source. This is it.
                </p>
                <p>
                  A barbell, not a spread — baseline functional gear on one
                  end, gold-standard on the other, nothing deliberately bought
                  in the middle. Not cheap enough to be a non-decision, not
                  good enough to be the last one you make: skip it.
                </p>
              </div>
              <ul className="pillars pillars-follow">
                <li>
                  Financially
                  <strong>Self-funded</strong>
                </li>
                <li>
                  Physically
                  <strong>Self-trained</strong>
                </li>
                <li>
                  Professionally
                  <strong>Self-taught</strong>
                </li>
                <li>
                  Technically
                  <strong>Self-instrumented</strong>
                </li>
              </ul>
            </div>
            <BarPath />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
