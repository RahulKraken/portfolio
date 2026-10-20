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
    title: "Take the long way.",
    intro:
      "The blue-and-orange Duke. For the roads between places, and finding a reason to get out.",
  },
  {
    id: "track",
    label: "On the track",
    object: "Ducati Panigale V2 S",
    title: "One more lap.",
    intro:
      "The 2025 Panigale V2 S. A different kind of concentration, somewhere between the braking marker and the exit.",
  },
  {
    id: "music",
    label: "Strings",
    object: "Fender Stratocaster",
    title: "Six strings. No rush.",
    intro:
      "A black Strat, a maple neck, and a Boss Katana. Pink Floyd belongs here.",
  },
  {
    id: "coffee",
    label: "Coffee",
    object: "The brew station",
    title: "A small daily ritual.",
    intro:
      "Different beans, a Hario Switch, an AeroPress. A little time spent making a good cup.",
  },
];
