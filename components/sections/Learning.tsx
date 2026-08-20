import { LearningCurve } from "@/components/graphics/LearningCurve";
import { Reveal } from "@/components/Reveal";
import { learningDomains } from "@/lib/site";

export function Learning() {
  return (
    <section className="section" id="pattern">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <p className="kicker">The learning pattern</p>
            <span className="index">02</span>
          </div>
          <h2 className="display display-xl">
            Gestation. Click. Slope.
          </h2>
          <div className="lede">
            <p>
              Every skill I’ve kept has the same shape. A long stretch of
              correct-but-lifeless output. Then a click. Then the slope goes
              vertical.
            </p>
            <p>
              Squats went this way. Table tennis went this way. Engineering,
              guitar, track. Knowing the shape doesn’t shorten the wait. It just
              means I’m not confused about which phase I’m in.
            </p>
          </div>
          <ul className="domains">
            {learningDomains.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <div className="curve-wrap">
            <LearningCurve />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
