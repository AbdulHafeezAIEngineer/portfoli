export const experience = {
  eyebrow: "03 / THE PERSON BEHIND ELVORA",
  title: "About Me",
  lead: "2+ years of experience. Thoughtful use of AI. An understanding of the full stack.",
  paragraphs: [
    "I'm Abdul Hafeez, the developer behind Elvora. With more than two years of experience, I work on websites and AI chatbot experiences that bring business ideas into a practical, usable form. I've invested a great deal of time in learning how to work with AI tools: understanding their strengths, recognizing their limits, and improving the results through clear direction and careful review.",
    "It's easy to think that anyone can ask AI to build a website and receive a professional product. Getting a useful first draft is only the beginning. A strong result needs a well-structured prompt, the right context, sensible design decisions, and repeated testing. My contribution is in shaping the requirements, checking the generated work, and refining the details until the experience feels considered and works as intended.",
    "I also believe in understanding what runs beneath the interface. Frontend code shapes how people interact with a website; backend logic handles requests and business rules; a database stores and organizes information; and deployment, security, and maintenance keep the product available and protected. AI can assist with each layer, but making them work together still takes technical understanding, judgment, and responsibility.",
  ],
  factsLabel: "HOW I WORK",
  factsNote:
    "Time spent learning the tools matters. The real value comes from the decisions, checks, and refinements made along the way.",
  facts: [
    {
      label: "Experience",
      value: "More than two years of experience, with time dedicated to learning and working with AI tools.",
    },
    {
      label: "Prompting with purpose",
      value: "Clear goals, relevant context, and specific constraints help turn a broad idea into useful output.",
    },
    {
      label: "Engineering beyond the prompt",
      value:
        "Review the frontend, backend, data flow, and deployment together, then test and refine the complete experience.",
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
