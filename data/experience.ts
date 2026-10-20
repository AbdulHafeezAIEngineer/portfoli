export const experience = {
  eyebrow: "ABOUT ABDUL HAFEEZ",
  title: "An independent developer.\nA thoughtful approach to the web.",
  lead: "Design judgment. Practical engineering. A human eye for the details.",
  paragraphs: [
    "I'm Abdul Hafeez, the developer behind Elvora. My curiosity about Python and how the web works grew into a passion for development. Through hands-on projects, agency work and independent development, I've learned to turn ideas into practical digital experiences. Today, I'm bringing that curiosity into a startup of my own.",
    "AI is a powerful tool, but having access to it is only the beginning. Using it well takes experience, clear instructions and the judgment to question, test and improve what it produces. A convincing first draft still needs someone who understands how a website actually works.",
    "I bring an understanding of the frontend, backend, databases and deployment, together with practical coding foundations. That knowledge helps me guide the tools, connect the pieces and refine the details. Combined with my own creativity and careful testing, it lets me turn your idea into a polished, useful website. AI supports selected tasks; the direction, decisions and final review stay with me.",
  ],
  fundamentals: {
    eyebrow: "THE ENGINEERING BEHIND THE INTERFACE",
    title: "Technical domains.",
    description:
      "A considered interface needs a solid foundation. From the first interaction to the data behind it, here are the pieces I bring together.",
    blocks: [
      {
        id: "frontend",
        title: "Web & Interfaces",
        description:
          "Responsive, accessible interfaces that bring an idea to life across mobile and desktop.",
        tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        lines: [
          "Structure clear, semantic interfaces.",
          "Adapt layouts to screens and input methods.",
          "Make navigation and forms accessible.",
          "Keep loading and interaction responsive.",
        ],
      },
      {
        id: "backend",
        title: "APIs & Integrations",
        description:
          "Connect websites to useful services, with validated requests and clear error handling.",
        tags: ["API routes", "Server actions", "Input validation"],
        lines: [
          "Validate requests on the server.",
          "Design APIs and server actions with clear contracts.",
          "Keep credentials outside browser code.",
          "Handle permissions, limits, and failures.",
        ],
      },
      {
        id: "database",
        title: "Data & Structure",
        description:
          "Organize product information with clear schemas and controlled access to private records.",
        tags: ["Data modeling", "Prisma", "PostgreSQL"],
        lines: [
          "Choose a schema that matches the product.",
          "Keep data consistent and queries efficient.",
          "Plan migrations, backups, and recovery.",
          "Control access to private records.",
        ],
      },
      {
        id: "deployment",
        title: "Deployment & Care",
        description:
          "Take a website from development to a connected domain, with server-side secrets and abuse protection.",
        tags: ["Vercel", "Git", "HTTPS", "Rate limiting"],
        lines: [
          "Build and release through repeatable steps.",
          "Use HTTPS and secure secret management.",
          "Monitor errors, usage, and availability.",
          "Maintain dependencies and abuse protection.",
        ],
      },
      {
        id: "ai",
        title: "Chatbots & Assistants",
        description:
          "Make business information easier to explore with custom website chatbots, carefully guided prompts and optional voice interaction.",
        tags: ["Botpress", "OpenAI API", "Business FAQs", "Web Speech API"],
        lines: [
          "Provide useful context.",
          "Test answers and handle uncertainty.",
        ],
      },
    ],
    closing:
      "If you don't understand these fundamentals, how will your website actually run, scale, and stay secure?",
  },
} as const;
