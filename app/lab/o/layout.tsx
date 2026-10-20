import { Caveat, Overpass } from "next/font/google";
import "./o.css";

const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-hand",
  display: "swap",
});

const overpass = Overpass({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-overpass",
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lab-o ${hand.variable} ${overpass.variable}`} data-lab="o">
      {children}
    </div>
  );
}
