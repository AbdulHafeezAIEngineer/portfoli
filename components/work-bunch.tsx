import Image from "next/image";
import Link from "next/link";
import { studio } from "@/data/studio";
import { studies } from "@/data/studies";
import type { ProjectView } from "@/data/projects";
export function WorkBunch({
  projects,
}: {
  projects: ProjectView[];
  standalone?: boolean;
}) {
  const entries = [
    ...studies.map((study) => ({
      id: study.id,
      title: study.name,
      image: study.screenshot,
      href: `/studies/${study.id}`,
      type: study.industry,
    })),
    ...projects
      .slice(0, 4)
      .map((project) => ({
        id: project.id,
        title: project.title,
        image: project.screenshots[0].src,
        href: project.demoUrl,
        type: project.industry,
      })),
  ];
  return (
    <section className="container field-notebook" aria-labelledby="bunch-title">
      <header className="field-section-heading">
        <p className="eyebrow">{studio.bunch.eyebrow}</p>
        <h1 id="bunch-title">{studio.bunch.title}</h1>
        <p>{studio.bunch.intro}</p>
      </header>
      <div className="field-contact-sheet">
        {entries.map((entry, index) => (
          <article key={entry.id}>
            <Link href={entry.href}>
              <Image
                src={entry.image}
                alt={`${entry.title}: browser capture of the fictional interface`}
                width={1440}
                height={1000}
                sizes="(max-width:760px) 100vw, 50vw"
              />
              <span>
                <small>
                  {String(index + 1).padStart(2, "0")} / {entry.type}
                </small>
                <strong>{entry.title} ↗</strong>
              </span>
            </Link>
          </article>
        ))}
      </div>
      <p className="studio-note">{studio.bunch.note}</p>
    </section>
  );
}
