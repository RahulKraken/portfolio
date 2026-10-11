import type { Metadata } from "next";
import { Ride } from "@/components/Ride";

export const metadata: Metadata = { title: "Ride" };

export default function RidePage() {
  return (
    <main>
      <Ride />
    </main>
  );
}
