import { Great_Vibes } from "next/font/google";
import "./n.css";

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lab-n ${script.variable}`} data-lab="n">
      {children}
    </div>
  );
}
