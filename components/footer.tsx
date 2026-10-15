import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";
import { BrandMark } from "./brand-mark";

export function Footer({ brand }: { brand: string }) {
  return (
    <footer className="container footer">
      <a href="#top" className="wordmark" aria-label={`${brand} — Home`}>
        <BrandMark brand={brand} />
      </a>
      <p>
        © {new Date().getFullYear()} {brand}
      </p>
      <p>{site.footer}</p>
      <BackToTop />
    </footer>
  );
}
