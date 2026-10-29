import type { Viewport } from "next";
import FivePrints from "@/components/prints/FivePrints";
import "./prints.css";

export const viewport: Viewport = {
  themeColor: "#183e42",
  colorScheme: "dark",
};

export default function HomePage() {
  return <FivePrints />;
}
