import { ImageResponse } from "next/og";
import { markBox, markShell, markVisor } from "@/lib/mark";
import { site } from "@/lib/site";

export const alt = site.title;
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox={markBox} width="346" height="500">
          <path fill="#ff5a3c" fillRule="evenodd" d={`${markShell} ${markVisor}`} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
