export type Product = {
  id: string;
  name: string;
  line: string;
  /** what it is, in a few words */
  kind: string;
  /** Drop a public URL here later; the card only renders a link when this is set. */
  href?: string;
  hrefLabel?: string;
  draw: "solo" | "coach" | "laptimer" | "plain";
};

export const products: Product[] = [
  {
    id: "meusic",
    name: "Meusic",
    line: "Learn guitar solos: play it, and it breaks the solo down into phrases and notes.",
    kind: "Guitar learning app",
    draw: "solo",
  },
  {
    id: "pillar",
    name: "Pillar",
    line: "An iOS athletic-intelligence app: understand, then advise. Remember and adapt.",
    kind: "iOS training app",
    draw: "coach",
  },
  {
    id: "apex-one",
    name: "Apex One",
    line: "A motorcycle GPS lap timer and telemetry hardware. Deterministic physics first.",
    kind: "Lap timer and telemetry",
    draw: "laptimer",
  },
  {
    id: "am-i-fucked",
    name: "Am I F*cked?",
    line: "A legal-situation navigator. What a real-life situation means, in plain language.",
    kind: "Legal situation guide",
    draw: "plain",
  },
];
