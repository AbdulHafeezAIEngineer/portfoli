"use client";
import { site } from "@/data/site";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0a12",
          color: "#f3f1eb",
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
