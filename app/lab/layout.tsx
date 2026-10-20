import type { Metadata } from "next";
import { Instrument_Serif, Newsreader } from "next/font/google";
import "./isolate.css";

const news = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-news",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Lab", template: "%s · Lab" },
  description: "Design exploration. Not indexed. Comparison only.",
  robots: { index: false, follow: false, nocache: true },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lab-root ${news.variable} ${instrument.variable}`}>
      {children}
    </div>
  );
}
