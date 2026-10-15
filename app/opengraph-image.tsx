import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A12",
          padding: "70px 80px",
          color: "#f7f6f2",
          borderBottom: "8px solid #D4AF37",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#D4AF37",
            letterSpacing: 4,
          }}
        >
          {site.brand.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            letterSpacing: -3,
            lineHeight: 1.1,
          }}
        >
          <span>{site.hero.heading[0]}</span>
          <span style={{ color: "#D4AF37" }}>
            {site.hero.heading.slice(1).join(" ")}
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a8a8b8" }}>
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
