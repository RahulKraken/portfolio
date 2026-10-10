import { site } from "@/lib/site";

export type ChapterId =
  | "track"
  | "strength"
  | "music"
  | "building"
  | "engineering";

export type Chapter = {
  id: ChapterId;
  n: string;
  kicker: string;
  title: string;
  rail: string;
  subtitle: string;
  href: string;
  /** CSS custom properties live on [data-chapter] */
  theme: "track" | "strength" | "music" | "building" | "engineering";
};

export const chapters: Chapter[] = [
  {
    id: "track",
    n: "01",
    kicker: "Not a racer",
    title: "Track",
    rail: "Red Panigale. Closed circuit.",
    subtitle: "Tarmac tells you the truth in tenths.",
    href: "/track",
    theme: "track",
  },
  {
    id: "strength",
    n: "02",
    kicker: "Beltless",
    title: "Strength",
    rail: "160 kg beltless. Chasing 200.",
    subtitle: "Depth is a skill. The bar is the instrument.",
    href: "/strength",
    theme: "strength",
  },
  {
    id: "music",
    n: "03",
    kicker: "No gigs",
    title: "Music",
    rail: "Gilmour. Strat. Four days a week.",
    subtitle: "The notes are not the recording.",
    href: "/music",
    theme: "music",
  },
  {
    id: "building",
    n: "04",
    kicker: "Physics first",
    title: "Building",
    rail: "Build, ship, learn.",
    subtitle: "Don’t trust an instrument until you’ve built it.",
    href: "/building",
    theme: "building",
  },
  {
    id: "engineering",
    n: "05",
    kicker: "One chapter",
    title: "Engineering",
    rail: "Systems, packets, traces.",
    subtitle: "The job is a chapter. It is not the book.",
    href: "/engineering",
    theme: "engineering",
  },
];

export const navMain = [
  { href: "/#track", label: "Track" },
  { href: "/#strength", label: "Strength" },
  { href: "/#music", label: "Music" },
  { href: "/#building", label: "Building" },
  { href: "/#engineering", label: "Engineering" },
  { href: "/#contact", label: "Contact" },
] as const;

export const navMeta = [
  { href: "/notes", label: "Blog" },
  { href: "/list-100", label: "List 100" },
  { href: "/cv.pdf", label: "CV", external: true },
] as const;

export const about = {
  heading: site.name,
  lede: "I grew up in Patna. I built a life on purpose — the racetrack, the squat bar, the guitar, the workbench. Those are the places the mind goes quiet.",
  italic:
    "The same obsession runs through all of them: repetition, feedback, mastery. Tenths. Kilos. Notes. Then it shows up in what I ship.",
  close:
    "I take a red Ducati to a closed circuit, chase a 200 kg squat, learn Gilmour on a Strat, and build products and hardware. Engineering is one of the chapters. It is not the book.",
};

export const trackCopy = {
  now: "2:22",
  nowMeta: "Now · MMRT",
  target: "To sub-2:00 · not there yet",
  paragraphs: [
    "Track-day rider, not a racer. No licences, no results list — just closed circuits and a stopwatch that does not care what you meant to do.",
    "A red 2025 Ducati Panigale V2 S (Öhlins NIX30/STX46, Brembo Stylema, Supercorsa SP) arrived 11 January 2026. Everyday bike is a 2024 KTM 390 Duke. Before that, an Aprilia RS 457.",
    "Circuits: Madras International Circuit (MMRT), Kari Motor Speedway, CoASTT. Times at MMRT moved from about 2:30 toward the low 2:20s. The targets are sub-2:05, then sub-2:00 — targets, not claims.",
    "California Superbike School Level 1. The work is body position, peg loading, countersteering, lines, consistency. Marc Márquez is the rider he studies. The long list of tracks he wants to ride — Isle of Man TT, Mugello, Misano, Assen, Spa, Silverstone — is still a list.",
    "The knee-down puzzle turned out to be partly the leather suit. Removing the liners opened the hips by about 15 degrees. Tarmac is like that: the obvious story is rarely the whole instrument.",
  ],
  note: {
    href: "/notes/built-it-himself",
    label: "Note — the GPS lap timer",
  },
};

export const strengthCopy = {
  now: "160",
  nowMeta: "kg beltless back squat",
  target: "Chasing 200",
  lifts: [
    { label: "Beltless back squat", value: "160 kg" },
    { label: "Paused front squat", value: "100 kg · 3×3" },
    { label: "Deadlift", value: "140 kg × 3" },
    { label: "Row", value: "110 kg × 5" },
  ],
  paragraphs: [
    "Serious recreational lifting. The numbers are self-reported, not a meet total. Deep, controlled squats are treated as a skill. Mobility, here, means strength at end range.",
    "He doesn’t run a standard program as gospel. A template is someone else’s week. The log is the instrument — stalled load, sleep against session, what this week actually said.",
  ],
  note: {
    href: "/notes/built-it-himself#lifting",
    label: "Note — template vs log",
  },
};

export const musicCopy = {
  now: "4–5",
  nowMeta: "days a week",
  target: "No gigs · no releases",
  paragraphs: [
    "Fender Player II Stratocaster, plus acoustic. Gilmour and Pink Floyd are the north star. Currently working the Stairway to Heaven solo. Plays four or five days a week.",
    "Nothing is released. Nothing is performed. The standard is the recording, not a tab: bends, vibrato, the attack relative to the beat. The published notes are someone else’s instrument.",
  ],
  note: {
    href: "/notes/built-it-himself#guitar",
    label: "Note — Let It Be, then Dylan",
  },
};

export const buildingCopy = {
  now: "Ship",
  nowMeta: "Build · ship · learn",
  target: "Paying users, then scale",
  products: [
    {
      name: "Pillar",
      line: "Personal athletic intelligence for iOS. “Everyone is an athlete.” Understand, then advise. Remember and adapt. A calm companion for goals, training, fuel and recovery — not dashboards and streaks. SwiftUI, Go, Cloud Run, Postgres, Gemini. Near-term; status still to confirm.",
      href: site.pillar,
    },
    {
      name: "Meusic",
      line: "Learn guitar solos by what they’re made of: isolate the guitar, transcribe, break a solo into phrases, whole → parts → whole, fretboard, looping, slowdown. Born from the same struggle as the Strat section. Next.js, a Python audio engine, Chrome extension.",
    },
    {
      name: "Apex One",
      line: "Working name. A motorcycle GPS lap timer and data logger — GNSS, IMU, custom PCB, display, enclosure — meant to grow into a telemetry ecosystem, then an AI riding engineer. Deterministic physics first. AI to explain where time was gained or lost.",
      href: "/notes/built-it-himself",
    },
    {
      name: "Am I F*cked?",
      line: "A legal-situation navigator that explains what a real-life situation means, in plain language. Prototype. Name as he’d say it; publish-approval still open.",
    },
    {
      name: "Caloreee",
      line: "AI nutrition logging for iOS. Earlier prototype.",
    },
  ],
  paragraphs: [
    "Also in the shop: custom robotics, Gazebo, PCB design, AI-agent orchestration. The startup order is build, ship, learn, get paying users, refine, then scale. Funding is an instrument, not an achievement.",
    "Adrian Newey’s How to Build a Car was bought with first internship money, when he briefly wanted to build a car — before motorcycles took over. Same itch: understand how the thing works, then make one.",
  ],
  note: {
    href: "/notes/built-it-himself",
    label: "Note — DIY GPS vs AiM and Garmin",
  },
};

export const engineeringCopy = {
  now: "Runtime",
  nowMeta: "AI-agent security",
  target: "Team work, not a solo myth",
  paragraphs: [
    "Founding engineer at Straiker.ai, which builds runtime security for AI agents. Previously SDE-2 at Palo Alto Networks. Engineering career since about 2021.",
    "The work spans eBPF-based Linux instrumentation and encrypted-traffic visibility, macOS endpoint and networking (PacketTunnelProvider, privileged helpers), OpenTelemetry agent tracing, and contextual detection of prompt injection, tool misuse, data exfiltration and excessive agency. Ten-plus enterprise integrations (Copilot Studio, Bedrock, OpenAI Enterprise, Gemini Enterprise). Systems processing 10M+ traces a day. Team-level work he contributed to and led parts of — not a one-man product sheet.",
    "He moves between layers: product behaviour, distributed architecture, OS internals, packets, hardware, physics. The through-line is the same as the track and the bar: measure it yourself.",
  ],
};

export const contactCopy = {
  line: "Say the thing. No form, no funnel.",
  photoTodo: "Portrait, track, bar, Strat, workbench — still to slot.",
};
