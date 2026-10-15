import Link from "next/link";
import { site } from "@/data/site";
export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <p className="eyebrow">404 / {site.brand}</p>
      <h1>{site.errors.notFound}</h1>
      <p>{site.errors.missing}</p>
      <Link className="button button-gold" href="/">
        {site.errors.home}
      </Link>
    </main>
  );
}
