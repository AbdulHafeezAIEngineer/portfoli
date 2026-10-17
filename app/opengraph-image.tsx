import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import palette from "@/data/theme-tokens.json";

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
          background: palette.dark.background,
          padding: "70px 80px",
          color: palette.dark.text,
          borderBottom: `8px solid ${palette.dark.accent}`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: palette.dark.accentHover,
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
          <span>
            {site.hero.heading.slice(1).join(" ")}
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: palette.dark.muted }}>
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
