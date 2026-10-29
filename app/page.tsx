import type { Viewport } from "next";
import { preload } from "react-dom";
import FivePrints from "@/components/prints/FivePrints";
import { PRINTS } from "@/lib/prints";
import "./prints.css";

export const viewport: Viewport = {
  themeColor: "#183e42",
  colorScheme: "dark",
};

export default function HomePage() {
  preload(PRINTS[0].poster, { as: "image" });
  return <FivePrints />;
}
