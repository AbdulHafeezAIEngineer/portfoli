export const experience = {
  eyebrow: "03 / A CONSIDERED APPROACH",
  title: "My Experience With AI Tools",
  lead: "Turning AI output into production-quality work.",
  description:
    "The idea that AI can build everything on its own overlooks the work behind a professional result: structured prompts, validation, testing, and refinement. The quality comes from how the output is directed, checked, and improved.",
  factsLabel: "PERSONAL EXAMPLES",
  factsNote:
    "Only verified details belong here. No years of experience, client counts, or testimonials have been supplied.",
  facts: [
    {
      label: "Tools I have actually used",
      value: "[PLACEHOLDER] Add the AI tools you have personally used.",
    },
    {
      label: "A real workflow example",
      value: "[PLACEHOLDER] Describe your task, prompts, and own contribution.",
    },
    {
      label: "Validation and refinement",
      value:
        "[PLACEHOLDER] Add a factual example of what you tested and improved.",
    },
  ],
  process: [
    {
      title: "Structure the prompt",
      description:
        "Define the goal, context, constraints, and expected result before generating.",
    },
    {
      title: "Validate the output",
      description:
        "Check assumptions, facts, requirements, and the behavior behind the interface.",
    },
    {
      title: "Test the behavior",
      description:
        "Exercise real user flows, edge cases, accessibility, and failure states.",
    },
    {
      title: "Refine with intent",
      description:
        "Resolve what testing reveals and improve clarity, reliability, and usability.",
    },
  ],
  fundamentals: {
    eyebrow: "THE ENGINEERING BEHIND THE INTERFACE",
    title: "Beyond AI: Full-Stack Understanding",
    description:
      "A polished screen is one part of a working product. These fundamentals explain what needs to happen behind it.",
    blocks: [
      {
        id: "frontend",
        title: "Frontend",
        lines: [
          "Structure clear, semantic interfaces.",
          "Adapt layouts to screens and input methods.",
          "Make navigation and forms accessible.",
          "Keep loading and interaction responsive.",
        ],
      },
      {
        id: "backend",
        title: "Backend",
        lines: [
          "Validate requests on the server.",
          "Design APIs and server actions with clear contracts.",
          "Keep credentials outside browser code.",
          "Handle permissions, limits, and failures.",
        ],
      },
      {
        id: "database",
        title: "Database",
        lines: [
          "Choose a schema that matches the product.",
          "Keep data consistent and queries efficient.",
          "Plan migrations, backups, and recovery.",
          "Control access to private records.",
        ],
      },
      {
        id: "deployment",
        title: "Deployment / Security",
        lines: [
          "Build and release through repeatable steps.",
          "Use HTTPS and secure secret management.",
          "Monitor errors, usage, and availability.",
          "Maintain dependencies and abuse protection.",
        ],
      },
    ],
    closing:
      "If you don't understand these fundamentals, how will your website actually run, scale, and stay secure?",
  },
} as const;
