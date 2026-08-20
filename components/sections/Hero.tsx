import { LapTrace } from "@/components/graphics/LapTrace";
import { identities, site } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="shell">
        <p className="hero-coords">
          <span>{site.coordinates.lat}</span>
          <span>{site.coordinates.lon}</span>
          <span>{site.coordinates.label} · session</span>
        </p>
        <h1>{site.target}</h1>
        <div className="hero-sub">
          <span className="circuit">Target — not a title</span>
          <span className="aside">A lap line as a signature.</span>
        </div>
        <div className="hero-trace">
          <LapTrace draw />
        </div>
        <nav className="identities" aria-label="Identities">
          {identities.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <span className="scroll-hint">Scroll</span>
    </section>
  );
}
