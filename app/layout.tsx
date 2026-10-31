import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import { LegacyChrome } from "@/components/LegacyChrome";
import { openGraphSite, site } from "@/lib/site";
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
  // www: the apex 307s to www, and crawlers need absolute www URLs on og/twitter tags
  metadataBase: new URL("https://www.rahulkraken.com"),
  title: { default: site.title, template: `%s · ${site.title}` },
  description: site.description,
  openGraph: openGraphSite,
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  colorScheme: "light",
  viewportFit: "cover",
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
        <div id="content">{children}</div>
        <LegacyChrome />
      </body>
    </html>
  );
}
