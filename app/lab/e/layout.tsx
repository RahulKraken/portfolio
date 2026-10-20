import { Outfit } from "next/font/google";
import "./e.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lab-e ${outfit.variable}`} data-lab="e">
      {children}
    </div>
  );
}
