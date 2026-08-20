export const site = {
  name: "Rahul Kumar",
  shortName: "Rahul",
  email: "r.rahul4511@gmail.com",
  location: "Bengaluru",
  locationCode: "BLR",
  github: "https://github.com/RahulKraken",
  pillar: "https://github.com/RahulKraken/pillar.ai",
  url: "https://rahulkraken.com",
  description:
    "Rider, self-taught builder, musician, self-built person. A personal site — not a resume.",
  coordinates: {
    label: "MMRT",
    lat: "13.008° N",
    lon: "79.987° E",
  },
  target: "Sub-2:05",
} as const;

export const identities = [
  { href: "#track", label: "rider" },
  { href: "#systems", label: "maker" },
  { href: "#craft", label: "musician" },
  { href: "#self", label: "self-built" },
] as const;

export const hudSections = [
  { id: "hero", label: "HERO" },
  { id: "pattern", label: "PATTERN" },
  { id: "track", label: "TRACK" },
  { id: "craft", label: "CRAFT" },
  { id: "systems", label: "SYSTEMS" },
  { id: "self", label: "ORIGIN" },
  { id: "trajectory", label: "VECTOR" },
] as const;

export const quotes = {
  stopwatch: "The stopwatch never lies.",
  ear: "The ear gets there for free. The hands bill you for every rep.",
  pipeline: "Owning the pipeline beats renting someone else’s dashboard.",
  partner: "A book with no partner is a fact with no frame.",
  barbell: "A middle-tier anything is the worst version of a purchase.",
  privacy: "Privacy is power.",
} as const;

export const learningDomains = [
  "lifting",
  "table tennis",
  "engineering",
  "guitar",
  "riding",
] as const;

export const machines = [
  { name: "Panigale V2S", role: "Track" },
  { name: "KTM 390 Duke", role: "Road" },
] as const;

export const telemetry = [
  { k: "TARGET", v: "2:05.00" },
  { k: "CIRCUITS", v: "MMRT · ARUANI" },
  { k: "GPS", v: "NEO-M8N · 10 Hz" },
  { k: "IMU", v: "MPU6050 · 6-AXIS" },
  { k: "LOG", v: "CSV ON-BIKE" },
  { k: "COST", v: "< $35" },
] as const;

export const crafts = [
  {
    id: "guitar",
    label: "Guitar",
    kicker: "Phrase by phrase",
    body: "Gilmour. Pink Floyd. I learned the Let It Be solo — every note correct. It didn’t sound like the recording. The notes are the floor, not the ceiling. Bends, vibrato, the timing of an attack: none of that is in the tab. All of it is the actual solo.",
  },
  {
    id: "coffee",
    label: "Coffee",
    kicker: "Variables, repeats, a log",
    body: "AeroPress. Beans from Black Baza and Subko. Same attention as a lap: one thing changed at a time, the rest held still, the result tasted rather than declared.",
  },
  {
    id: "writing",
    label: "Writing",
    kicker: "Mechanism and stakes",
    body: "A reading list where every book has a partner — one for how the system works, one for what happens when it doesn’t. Eighteen topics, semiconductors to shipping, with Seeing Like a State sitting above the lot.",
  },
] as const;

export const systems: {
  id: string;
  label: string;
  body: string;
  href?: string;
}[] = [
  {
    id: "honeycomb",
    label: "Honeycomb, pointed at a person",
    body: "Deploy markers applied to a life instead of a service. A change in fuel or training logged between two snapshots. Population-level questions and per-person questions, asked separately — the same instinct that queries production, pointed at a human.",
  },
  {
    id: "timer",
    label: "A lap timer that is a pipeline",
    body: "ESP32, IMU, 10 Hz GPS. Dumb and fast on the bike — raw CSV, no dashboard. After the session, a script reconstructs the line, computes lean, geofences the splits. The question that week decides the query. A $900 box would have decided it for me.",
  },
  {
    id: "pillar",
    label: "Pillar",
    href: "https://github.com/RahulKraken/pillar.ai",
    body: "A fitness app on one idea: everyone is an athlete. Not a form — a conversation that quietly becomes structured data. The same instrumentation, this time of training, fuel, and recovery.",
  },
] as const;
