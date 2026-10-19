"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getImageProps } from "next/image";
import { concepts } from "@/data/concepts";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";
import { TextReveal } from "./text-reveal";
import Gallery from "./project-gallery";

export function Work({ projects }: { projects: ProjectView[] }) {
  const router = useRouter();
  useEffect(() => {
    for (const item of projects) {
      if (!item.demoUrl.startsWith("/demo/")) continue;
      router.prefetch(item.demoUrl);
      const slug = item.demoUrl.slice("/demo/".length) as keyof typeof concepts;
      if (!Object.hasOwn(concepts, slug)) continue;
      const { props } = getImageProps({
        src: concepts[slug].image,
        alt: "",
        fill: true,
        sizes: ["solenne", "vanta"].includes(slug)
          ? "100vw"
          : "(max-width:700px) 100vw, 70vw",
      });
      const image = new window.Image();
      image.fetchPriority = "low";
      image.decoding = "async";
      image.sizes = props.sizes || "100vw";
      image.srcset = props.srcSet || "";
      image.src = props.src;
    }
  }, [projects, router]);
  const [project, setProject] = useState<ProjectView | null>(null);
  return (
    <section
      id="work"
      className="container work-section"
      aria-labelledby="work-title"
    >
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">WEBSITE CONCEPTS / WORKING DEMOS</p>
            <TextReveal as="h1" id="work-title" text={site.work.title} />
          </div>
          <p>{site.work.description}</p>
        </div>
      </Reveal>
      <div className="projects-grid curated-projects-grid">
        {projects.map((item) => (
          <Reveal key={item.id}>
            <ProjectCard project={item} />
            <button
              className="project-screenshots-link"
              aria-haspopup="dialog"
              aria-label={`View screenshots: ${item.title}`}
              onClick={() => setProject(item)}
            >
              View screenshots <ArrowUpRight size={13} aria-hidden="true" />
            </button>
          </Reveal>
        ))}
      </div>
      <p className="work-disclaimer">
        {site.work.disclaimer}
        <br />
        <span>{site.work.screenshotNote}</span>
      </p>
      {project && (
        <Gallery project={project} onClose={() => setProject(null)} />
      )}
    </section>
  );
}
