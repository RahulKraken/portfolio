import type { Metadata } from "next";
import { Ride } from "@/components/Ride";
import { openGraphSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ride",
  description:
    "A scroll-through ride in screenprints: a track day, the kit, and a Stratocaster.",
  alternates: { canonical: "/ride" },
  openGraph: {
    ...openGraphSite,
    url: "/ride",
    description:
      "A scroll-through ride in screenprints: a track day, the kit, and a Stratocaster.",
  },
};

export default function RidePage() {
  return (
    <main>
      <Ride />
    </main>
  );
}
