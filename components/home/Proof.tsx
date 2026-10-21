import { Mark } from "@/components/Mark";
import { vignettes } from "@/components/home/Vignettes";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export function Proof() {
  return (
    <section className="proof on-dark" id="built" data-cursor="iron">
      <header className="proof-head" data-reveal>
        <p className="proof-kicker">
          <Mark />
          First person
        </p>
        <h2 data-lean>
          What I’ve
          <span className="serif">built</span>
        </h2>
        <p className="proof-lede">Things I’m building, on my own time.</p>
      </header>
      <ul className="proof-grid">
        {products.map((p, i) => (
          <li key={p.id} className="proof-card" data-reveal style={{ "--i": i } as React.CSSProperties}>
            <span className="proof-no" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="proof-art" aria-hidden>
              {vignettes[p.draw]}
            </div>
            <span className="proof-status">{p.kind}</span>
            <h3>{p.name}</h3>
            <p>{p.line}</p>
            {p.href ? (
              <a className="proof-link" href={p.href} rel="noreferrer" target="_blank">
                {p.hrefLabel ?? "Open"}
              </a>
            ) : null}
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
