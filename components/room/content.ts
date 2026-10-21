export type RoomItem =
  "work" | "projects" | "travel" | "track" | "music" | "coffee";
export const roomItems: {
  id: RoomItem;
  label: string;
  object: string;
  title: string;
  intro: string;
}[] = [
  {
    id: "work",
    label: "Work",
    object: "MacBook Pro",
    title: "Under the hood.",
    intro:
      "Runtime security for AI agents. The work lives somewhere between the kernel, the network, and what an agent actually does.",
  },
  {
    id: "projects",
    label: "Things I build",
    object: "MacBook Air",
    title: "An itch. A prototype.",
    intro:
      "Guitar solos, training, motorcycle telemetry. Personal projects tend to start with something I want to use myself.",
  },
  {
    id: "travel",
    label: "On the road",
    object: "KTM Duke 390",
    title: "On the road.",
    intro:
      "The Gen 3 Duke 390 in blue and orange. The road bike; the Panigale gets the track days.",
  },
  {
    id: "track",
    label: "On the track",
    object: "Ducati Panigale V2 S",
    title: "On the track.",
    intro:
      "The 2025 Panigale V2 S, onboard and trackside at the Madras International Circuit.",
  },
  {
    id: "music",
    label: "Strings",
    object: "Fender Stratocaster",
    title: "Strings.",
    intro: "A black Stratocaster with a maple neck, through a Boss Katana.",
  },
  {
    id: "coffee",
    label: "Coffee",
    object: "The brew station",
    title: "Coffee.",
    intro:
      "A Hario Switch, an AeroPress, and whatever beans are open this week.",
  },
];
