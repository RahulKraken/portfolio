import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./isolate.css";

const news = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-news",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Lab", template: "%s · Lab" },
  description: "Design exploration. Not indexed. Comparison only.",
  robots: { index: false, follow: false, nocache: true },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className={`lab-root ${news.variable}`}>{children}</div>;
}
