import { concepts, type ConceptSlug } from "./concepts";
export type Screenshot = { src: string; title: string; alt: string };
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  description: string;
  stack: string[];
  accent: string;
  demoUrl: string;
  highlights: string[];
  promoPrompt: string;
  screenshots: Screenshot[];
};
export type ProjectView = Omit<Project, "promoPrompt">;
const views = [
  "Home page desktop",
  "Collection / inner page",
  "Mobile view",
  "Feature / design details",
];
export const projects: Project[] = (Object.keys(concepts) as ConceptSlug[]).map(
  (id) => {
    const concept = concepts[id];
    return {
      id,
      title: concept.name,
      subtitle: concept.subtitle,
      industry: concept.industry,
      description: concept.description,
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      accent: concept.accent,
      demoUrl: `/demo/${id}`,
      highlights: [...concept.highlights],
      promoPrompt: `A premium 3D promotional composition for the fictional ${concept.name} ${concept.industry} website: a laptop and phone showing the actual supplied page screenshots, dark studio, champagne rim lighting and refined materials. Concept project, no client-work claims.`,
      screenshots: views.map((title, index) => ({
        src: `/projects/${id}-${index + 1}.webp`,
        title,
        alt: `${concept.name}: actual browser capture of the ${title.toLowerCase()} from the fictional custom concept website`,
      })),
    };
  },
);
export function getFileProjects(): ProjectView[] {
  return projects.map((project) => {
    const { promoPrompt, ...view } = project;
    void promoPrompt;
    return view;
  });
}
