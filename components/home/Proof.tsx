import { vignettes } from "@/components/home/Vignettes";
import { products } from "@/lib/products";

export function Proof() {
  return (
    <section className="proof on-dark" id="built" data-cursor="iron">
      <header className="proof-head" data-reveal>
        <h2 data-lean>
          What I’ve
          <span className="serif">built</span>
        </h2>
      </header>
      <ul className="proof-grid">
        {products.map((p, i) => (
          <li key={p.id} className="proof-card" data-reveal style={{ "--i": i } as React.CSSProperties}>
            <span className="proof-no" aria-hidden>
              P/N {String(i + 1).padStart(3, "0")}
            </span>
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
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
