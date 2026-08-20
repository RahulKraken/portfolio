import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.target}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0b0a08",
          color: "#ebe4d6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8a8378",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>{site.name.toUpperCase()}</span>
          <span>{site.locationCode}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 148,
              lineHeight: 0.85,
              letterSpacing: -6,
              fontFamily: "Times New Roman, serif",
            }}
          >
            {site.target}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#d4a35a",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            MMRT · TARGET
          </div>
        </div>
        <div
          style={{
            height: 2,
            width: "100%",
            background: "#d4a35a",
            opacity: 0.85,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
