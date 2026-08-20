import { ImageResponse } from "next/og";
import { site, thesis } from "@/lib/site";

export const alt = `${site.name} — ${thesis}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ecebe6",
          color: "#141414",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5c5c56",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {site.name.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 52,
            lineHeight: 1.2,
            letterSpacing: -1,
            maxWidth: 900,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {thesis}
        </div>
        <div
          style={{
            height: 2,
            width: 120,
            background: "#0c6b54",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
