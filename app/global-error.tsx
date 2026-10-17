"use client";
import { site } from "@/data/site";
import palette from "@/data/theme-tokens.json";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: palette.dark.background,
          color: palette.dark.text,
          fontFamily: "system-ui",
          padding: 40,
        }}
      >
        <main>
          <h1>{site.errors.title}</h1>
          <p>{site.errors.description}</p>
          <button onClick={reset}>{site.errors.retry}</button>
        </main>
      </body>
    </html>
  );
}
