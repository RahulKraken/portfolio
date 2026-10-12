export type Product = {
  id: string;
  name: string;
  line: string;
  status: string;
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
    status: "Launching in public beta soon",
    draw: "solo",
  },
  {
    id: "pillar",
    name: "Pillar",
    line: "An iOS athletic-intelligence app: understand, then advise. Remember and adapt.",
    status: "In progress",
    draw: "coach",
  },
  {
    id: "apex-one",
    name: "Apex One",
    line: "A motorcycle GPS lap timer and telemetry hardware. Deterministic physics first.",
    status: "Working name · in design",
    draw: "laptimer",
  },
  {
    id: "am-i-fucked",
    name: "Am I F*cked?",
    line: "A legal-situation navigator. What a real-life situation means, in plain language.",
    status: "Prototype",
    draw: "plain",
  },
];
