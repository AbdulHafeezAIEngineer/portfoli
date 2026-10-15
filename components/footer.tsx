import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";

export function Footer({ brand }: { brand: string }) {
  return (
    <footer className="container footer">
      <a href="#top" className="wordmark" aria-label={`${brand}. — Home`}>
        {brand}
        <span aria-hidden="true">.</span>
      </a>
      <p>
        © {new Date().getFullYear()} {brand}
      </p>
      <p>{site.footer}</p>
      <BackToTop />
    </footer>
  );
}
