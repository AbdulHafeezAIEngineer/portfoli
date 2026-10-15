type ProjectPresentation = {
  label: string;
  artwork: boolean;
  visitLabel: string;
  visualNote: string;
};

const featured: Record<string, ProjectPresentation> = {
  elvora: {
    label: "Featured Website",
    artwork: true,
    visitLabel: "Visit Elvora website",
    visualNote: "3D promotional artwork · Explore the website for its current design",
  },
};

export function projectPresentation(id: string): ProjectPresentation {
  return featured[id] || {
    label: "Concept Project",
    artwork: false,
    visitLabel: "Explore the concept site",
    visualNote: "Actual screenshots of an independent concept website",
  };
}
