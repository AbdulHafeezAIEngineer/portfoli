"use client";
import { site } from "@/data/site";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="error-page">
      <p className="eyebrow">{site.brand}</p>
      <h1>{site.errors.title}</h1>
      <p>{site.errors.description}</p>
      <button className="button button-gold" onClick={reset}>
        {site.errors.retry}
      </button>
    </main>
  );
}
