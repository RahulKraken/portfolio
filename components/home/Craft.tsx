import { craft } from "@/lib/craft";

export function Craft() {
  return (
    <section className="craft on-dark" id="craft" aria-label="Engineering">
      <header className="craft-head">
        <h2>
          Engineering
          <span className="serif">kinds of systems</span>
        </h2>
      </header>
      <ul className="craft-grid">
        {craft.map((item) => (
          <li key={item.id} className="craft-card">
            <h3>{item.label}</h3>
            <p>{item.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
