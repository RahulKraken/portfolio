import { PhotoSlot } from "@/components/PhotoSlot";
import { about } from "@/lib/chapters";

export function About() {
  return (
    <section className="about" id="about">
      <div>
        <p className="about-kicker">Patna → Bengaluru</p>
        <h2>{about.heading}</h2>
        <p>{about.lede}</p>
        <p>
          <em>{about.italic}</em>
        </p>
        <p className="about-close">
          I take a red Ducati to a closed circuit, chase a 200 kg squat, learn
          Gilmour on a Strat, and build products and hardware.{" "}
          <strong>Engineering is one of the chapters. It is not the book.</strong>
        </p>
      </div>
      <PhotoSlot
        alt="Portrait of Rahul Kumar"
        caption="Send a portrait — track leathers, bar, Strat, or the bench. Not stock."
      />
    </section>
  );
}
