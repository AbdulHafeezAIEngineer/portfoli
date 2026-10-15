import { demos } from "./demos";
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
const directions = [
  {
    id: "restaurant",
    title: demos.restaurant.name,
    subtitle: "A slower kind of extraordinary.",
    industry: "Restaurant & Hospitality",
    accent: "#b8c399",
    highlights: [
      "Editorial serif typography",
      "Seasonal food illustrations",
      "Menu-first navigation",
    ],
    description:
      "A fictional seasonal dining concept with an editorial home page, illustrated menu and a considered story section. The screenshots show the actual interactive concept pages built for this portfolio.",
  },
  {
    id: "real-estate",
    title: demos["real-estate"].name,
    subtitle: "Distinctive spaces. Considered living.",
    industry: "Architecture & Real Estate",
    accent: "#a9c4be",
    highlights: [
      "Original architectural vectors",
      "Interactive property filters",
      "Spacious listing presentation",
    ],
    description:
      "A fictional architectural property collection with original vector illustrations, location filtering and a detailed residence feature. Listings and prices are illustrative, with no transactions processed.",
  },
  {
    id: "saas",
    title: demos.saas.name,
    subtitle: "Less busywork. More momentum.",
    industry: "Software & Productivity",
    accent: "#a4e5c3",
    highlights: [
      "Detailed product workspace",
      "Mint-on-midnight palette",
      "Interactive billing selector",
    ],
    description:
      "A fictional team-workspace landing page with a designed dashboard, product-feature section and interactive monthly/yearly price comparison. No signups, subscriptions or billing are processed.",
  },
  {
    id: "store",
    title: demos.store.name,
    subtitle: "Fewer pieces. More possibility.",
    industry: "Fashion & E-commerce",
    accent: "#d4b494",
    highlights: [
      "Original garment illustrations",
      "Editorial collection layout",
      "Interactive demo shopping bag",
    ],
    description:
      "A fictional fashion storefront with sculptural garment illustrations, an editorial collection and an interactive demonstration bag. No physical products are sold, and no checkout or payments are processed.",
  },
];
const views = [
  "Home page desktop",
  "Inner page desktop",
  "Mobile view",
  "Feature / detail section",
];
export const projects: Project[] = directions.map((project) => ({
  ...project,
  stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  demoUrl: Object.hasOwn(demos, project.id) ? `/demo/${project.id}` : "",
  promoPrompt: `Create a premium promotional 3D hero render for the fictional ${project.title} ${project.industry} website: a floating laptop and overlapping phone showing a refined responsive interface, dark midnight studio background, champagne-gold rim lighting, subtle violet atmosphere, realistic metal edges and glass reflections, elegant negative space, ultra-realistic render, 16:10. No claims of client work, no watermarks. The website's visual direction is ${project.highlights.join(", ")}.`,
  screenshots: views.map((title, index) => ({
    src: `/projects/${project.id}-${index + 1}.webp`,
    title,
    alt: `${project.title}: actual ${title.toLowerCase()} screenshot of the fictional concept website`,
  })),
}));
export function getFileProjects(): ProjectView[] {
  return projects.map(({ promoPrompt: _prompt, ...project }) => project);
}
