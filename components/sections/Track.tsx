import { LapTrace } from "@/components/graphics/LapTrace";
import { Reveal } from "@/components/Reveal";
import { machines, telemetry } from "@/lib/site";

export function Track() {
  return (
    <section className="section" id="track">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <p className="kicker">Track &amp; machine</p>
            <span className="index">03</span>
          </div>
          <div className="track-grid">
            <div>
              <ul className="machines">
                {machines.map((m) => (
                  <li key={m.name}>
                    <div className="name">{m.name}</div>
                    <div className="role">{m.role}</div>
                  </li>
                ))}
              </ul>
              <div className="lede">
                <p>
                  Sessions at MMRT and Aruani Grid. The target is sub-2:05 —
                  a vector, not a souvenir. Comfort first, then speed. The
                  stopwatch is the only critic that doesn’t flinch.
                </p>
                <p>
                  A commercial GPS lap timer costs more than the entire DIY
                  rig will ever cost in parts, twice over. Garmin built a car
                  dashboard and bolted it onto a motorcycle. I needed lap
                  splits, corner speed, a GPS overlay, and lean angle.
                </p>
                <p className="muted">
                  At 120 km/h a 5 Hz fix is 6.6 metres of blindness. That’s
                  not a rounding error. That’s the resolution of the dataset.
                  The NEO-M8N does 10 Hz. That was the whole decision.
                </p>
              </div>
            </div>
            <div>
              <div className="plate" aria-label="Telemetry">
                {telemetry.map((row) => (
                  <div className="plate-row" key={row.k}>
                    <span>{row.k}</span>
                    <span>{row.v}</span>
                  </div>
                ))}
              </div>
              <div className="track-trace">
                <LapTrace draw ghost />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
