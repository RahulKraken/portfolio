import { ImageResponse } from "next/og";
import { markBox, markShell, markVisor } from "@/lib/mark";
import { site } from "@/lib/site";

export const alt = `${site.name} — What I’ve built`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#232733",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <svg viewBox={markBox} width="220" height="318">
          <path fill="#ff5a3c" fillRule="evenodd" d={`${markShell} ${markVisor}`} />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            color: "#fbf6ec",
            fontStyle: "italic",
            letterSpacing: "-0.03em",
          }}
        >
          {site.name}
        </div>
      </div>
    ),
    { ...size },
  );
}
