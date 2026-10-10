import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Life is curated here`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#100e0c",
          color: "#f3eee4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8a8276",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          PATNA → BENGALURU
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            lineHeight: 0.85,
            letterSpacing: -2,
            textTransform: "uppercase",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontWeight: 800,
          }}
        >
          <span>Life is</span>
          <span style={{ color: "#c41e32" }}>curated</span>
          <span>here.</span>
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: "ui-serif, Georgia, serif",
            fontStyle: "italic",
          }}
        >
          {site.name}
        </div>
      </div>
    ),
    { ...size },
  );
}
