import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
const trials: Record<string, string> = {
  solenne: "Try the suite filters and sample stay planner.",
  vanta: "Compare models and change the car finish.",
  aster: "Choose a service and plan a sample visit.",
  kovo: "Filter projects and fill a sample architecture brief.",
};
export function ProjectCard({ project }: { project: ProjectView }) {
  return (
    <article className="field-project">
      <Link
        className="field-project-image"
        href={project.demoUrl || `/work/${project.id}`}
        aria-label={`Explore website: ${project.title}`}
      >
        <Image
          src={project.screenshots[0].src}
          alt={project.screenshots[0].alt}
          width={1440}
          height={1000}
          sizes="(max-width:760px) 100vw, 55vw"
        />
        <span>
          Open concept <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </Link>
      <div className="field-project-meta">
        <span className="eyebrow">{project.industry} / FICTIONAL BRAND</span>
        <h2>{project.title}</h2>
        <p>{trials[project.id] || project.description}</p>
        <Link href={`/work/${project.id}`}>
          Read the build notes <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
