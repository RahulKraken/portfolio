import type { Metadata } from "next";
import RoomExperience from "@/components/room/RoomExperience";
import "../room.css";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Step inside Rahul Kumar’s studio. Engineering, personal projects, motorcycles, guitar, and a good cup of coffee.",
};

export default function RoomPage() {
  return <RoomExperience />;
}
