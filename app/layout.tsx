import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { Eyes } from "@/components/home/Eyes";
import { Motion } from "@/components/home/Motion";
import { Nav } from "@/components/Nav";
import { SiteChrome } from "@/components/SiteChrome";
import { site } from "@/lib/site";
import "./globals.css";
import "./home.css";
import "./ride.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Width axis: the expanded italic cut is the site's one loud voice
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// The high-contrast serif that trades lines with the heavy sans
const serif = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.title}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} ${serif.variable}`}
    >
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteChrome>
          <Nav />
        </SiteChrome>
        <div id="content">{children}</div>
        <SiteChrome>
          <Motion />
          <Eyes />
          <Cursor />
        </SiteChrome>
      </body>
    </html>
  );
}
