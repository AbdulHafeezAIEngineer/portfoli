import palette from "@/data/theme-tokens.json";
import type { PresetConfig } from "shaders/js";

export const shaderPages = [
  "websites",
  "bots",
  "collection",
  "about",
  "testimonials",
  "contact",
] as const;
export type ShaderPage = (typeof shaderPages)[number];
export type ShaderTheme = "dark" | "light";

/** Derive every scene color from the site's one palette, including the bounds. */
export function mixShaderColor(a: string, b: string, amount: number) {
  return (
    "#" +
    [1, 3, 5]
      .map((offset) => {
        const start = parseInt(a.slice(offset, offset + 2), 16);
        const end = parseInt(b.slice(offset, offset + 2), 16);
        return Math.round(start + (end - start) * amount)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

export function pageShaderColors(page: ShaderPage, theme: ShaderTheme) {
  const p = palette[theme],
    n = palette.neutral;
  if (page === "testimonials")
    return theme === "dark"
      ? { low: n.ink, high: mixShaderColor(n.charcoal, n.slate, 0.3) }
      : { low: n.paper, high: mixShaderColor(n.paper, n.silver, 0.1) };
  return theme === "dark"
    ? {
        low: mixShaderColor(n.black, p.accent, 0.18),
        high: mixShaderColor(n.black, p.accent, 0.4),
      }
    : { low: p.background, high: mixShaderColor(p.background, p.accent, 0.08) };
}

/** Real SDK generators, with a final duotone that bounds every background pixel. */
export function pageShaderPreset(
  page: ShaderPage,
  theme: ShaderTheme,
): PresetConfig {
  const n = palette.neutral;
  const { low, high } = pageShaderColors(page, theme);
  const satin = {
    type: "Satin",
    props: {
      color: n.slate,
      highlightColor: n.white,
      foldCount: 4,
      foldDepth: 0.6,
      foldWidth: 0.3,
      speed: 0.18,
      breeze: 0.25,
      gloss: 0.08,
      bloom: 0,
      sheen: 0.3,
      weave: 0.03,
      foldDirection: 125,
    },
  };
  const noise = { type: "SimplexNoise", props: { scale: 1.8, speed: 0.08 } };
  const scenes: Record<ShaderPage, PresetConfig["components"]> = {
    websites: [
      noise,
      {
        type: "ContourLines",
        props: {
          levels: 7,
          lineWidth: 1.2,
          softness: 0.2,
          colorMode: "custom",
          lineColor: n.white,
          backgroundColor: n.black,
          opacity: 0.22,
        },
      },
    ],
    bots: [
      satin,
      {
        type: "DotGrid",
        props: {
          color: n.white,
          density: 20,
          dotSize: 0.06,
          speed: 0.05,
          twinkle: 0.2,
          opacity: 0.3,
        },
      },
    ],
    collection: [
      noise,
      {
        type: "Strands",
        props: {
          stops: [
            { color: n.silver, position: 0 },
            { color: n.white, position: 1 },
          ],
          lineCount: 6,
          lineWidth: 0.025,
          softness: 0.1,
          spread: 0.7,
          speed: 0.15,
          amplitude: 1.3,
          colorSpeed: 0,
          colorVariance: 0,
          opacity: 0.8,
        },
      },
    ],
    about: [satin],
    testimonials: [
      { type: "SolidColor", props: { color: n.black } },
      {
        type: "SimplexNoise",
        props: { scale: 1.2, speed: 0.035, opacity: 0.2 },
      },
      {
        type: "FloatingParticles",
        props: {
          particleColor: n.white,
          count: 100,
          particleSize: 0.3,
          softness: 0.08,
          speed: 0.035,
          angle: 15,
          speedVariance: 0.2,
          angleVariance: 40,
          randomness: 0.12,
          twinkle: 0.15,
          cursorStrength: 0,
        },
      },
    ],
    contact: [
      {
        type: "StudioBackground",
        props: {
          color: n.silver,
          keyColor: n.white,
          fillColor: n.paper,
          backColor: n.white,
          keyIntensity: 45,
          fillIntensity: 20,
          backIntensity: 25,
          brightness: 15,
          ambientIntensity: 40,
          ambientSpeed: 0.15,
          vignette: 15,
        },
      },
    ],
  };
  return {
    components: [
      ...scenes[page],
      {
        type: "Duotone",
        props: { colorA: low, colorB: high, blend: 0.45, colorSpace: "linear" },
      },
    ].map((component, index) => ({
      ...component,
      id: `page-${page}-${index}`,
    })),
  };
}
