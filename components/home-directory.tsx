import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolioPages } from "@/data/navigation";

const chapters = [
  { id: "websites", note: "Original concepts. Real interfaces.", number: "01" },
  { id: "bots", note: "Conversations, made useful.", number: "02" },
  {
    id: "collection",
    note: "Different worlds. One point of view.",
    number: "03",
  },
  { id: "about", note: "The person behind the pixels.", number: "04" },
  {
    id: "process",
    note: "From a first idea to the final detail.",
    number: "05",
  },
  {
    id: "testimonials",
    note: "Perspectives on working together.",
    number: "06",
  },
] as const;

export function HomeDirectory() {
  return (
    <section
      className="container home-directory"
      aria-labelledby="directory-title"
    >
      <div className="directory-heading">
        <div>
          <p className="eyebrow">EXPLORE ELVORA</p>
          <h2 id="directory-title">A little more direction.</h2>
        </div>
        <p>
          The work, the process and the person behind it. Each with a space of
          its own.
        </p>
      </div>
      <div className="directory-grid">
        {chapters.map(({ id, note, number }) => (
          <Link
            className="directory-card"
            key={id}
            href={portfolioPages[id].href}
          >
            <span className="directory-number">{number} /</span>
            <h3>{portfolioPages[id].label}</h3>
            <p>{note}</p>
            <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div className="directory-end">
        <Link href="/services">
          Explore services <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <Link href="/contact">
          Have a project in mind? Let’s talk.{" "}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
