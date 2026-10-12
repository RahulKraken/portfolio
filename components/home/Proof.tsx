import { Mark } from "@/components/Mark";
import { vignettes } from "@/components/home/Vignettes";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export function Proof() {
  return (
    <section className="proof on-paper" id="built" data-cursor="iron">
      <header className="proof-head" data-reveal>
        <p className="proof-kicker">
          <Mark />
          First person
        </p>
        <h2 data-lean>
          What I’ve
          <span className="serif">built</span>
        </h2>
        <p className="proof-lede">
          I’m {site.name}. These are mine — named, in progress, not a vibe. I keep
          the day job at the domain: runtime security for AI agents. Previously
          SDE-2 at Palo Alto Networks.
        </p>
      </header>
      <ul className="proof-grid">
        {products.map((p, i) => (
          <li key={p.id} className="proof-card" data-reveal data-tilt style={{ "--i": i } as React.CSSProperties}>
            <div className="proof-art" aria-hidden>
              {vignettes[p.draw]}
            </div>
            <span className="proof-status">{p.status}</span>
            <h3>{p.name}</h3>
            <p>{p.line}</p>
            {p.href ? (
              <a className="proof-link" href={p.href} rel="noreferrer" target="_blank">
                {p.hrefLabel ?? "Open"}
              </a>
            ) : (
              <span className="proof-slot">URL — slot</span>
            )}
          </li>
        ))}
      </ul>
      <p className="proof-sign">
        <span className="proof-sign-name">{site.name}</span>
        <a href={site.github} rel="noreferrer" target="_blank">
          GitHub
        </a>
      </p>
    </section>
  );
}
