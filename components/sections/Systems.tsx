import { Reveal } from "@/components/Reveal";
import { systems } from "@/lib/site";

export function Systems() {
  return (
    <section className="section" id="systems">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <p className="kicker">Cross-domain systems</p>
            <span className="index">05</span>
          </div>
          <h2 className="display display-lg">
            Instrument everything. Including yourself.
          </h2>
          <p className="lede lede-gap">
            Engineering lives here — as one expression of a broader pattern, not
            the headline. Query systems, a homemade lap timer, a fitness app:
            the same architectural instinct, three rooms.
          </p>
          <ul className="systems">
            {systems.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <a href={item.href} rel="noreferrer" target="_blank">
                    <h3>{item.label}</h3>
                  </a>
                ) : (
                  <h3>{item.label}</h3>
                )}
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
