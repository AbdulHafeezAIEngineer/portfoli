export const experience = {
  eyebrow: "ABOUT ABDUL HAFEEZ",
  title: "An independent developer.\nA thoughtful approach to AI.",
  lead: "Independent developer. Thoughtful AI. A human eye for the details.",
  paragraphs: [
    "I'm Abdul Hafeez, the developer behind Elvora. My curiosity about Python and AI grew into a passion for web development. Through hands-on projects, agency work and independent development, I've learned to turn ideas into practical digital experiences. Today, I'm bringing that curiosity into a startup of my own.",
    "I believe AI is a powerful tool, but access alone doesn't create professional work. The result depends on clear prompts, the right context, design judgment and patient testing. I've invested time in understanding how to guide these tools, check what they produce and refine the details until the work feels considered.",
    "That means understanding the full stack: the frontend people use, the backend that handles requests, the database that keeps information organized, and the deployment and security that keep it running. My role is to connect those pieces with intention—not simply accept the first AI-generated draft.",
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
