export const experience = {
  "eyebrow": "ABOUT ABDUL HAFEEZ",
  "title": "I’m Abdul Hafeez.\nI build what you see here.",
  "lead": "I started Elvora after watching Nafay’s videos. I now build websites and custom-data chatbots.",
  "paragraphs": [
    "I’ve followed Nafay since his “Unreal Engine 5: Easy Car Render for Beginners” tutorial. Watching someone explain their process made me want to build and show my own work.",
    "The portfolio contains four fictional website concepts and six interface studies. Kovo explores an architecture project enquiry. Solenne includes a sample stay planner. They demonstrate interfaces, not paid client results.",
    "For chatbots, I keep each business’s information separate. Try Veldt with a delivery question and check its source policy. I use AI in development, then review the code and test the behaviour myself."
  ],
  "fundamentals": {
    "eyebrow": "THE ENGINEERING BEHIND THE INTERFACE",
    "title": "Technical domains.",
    "description": "The Kovo form, the Solenne stay planner and this site’s chat route depend on the code behind the page. Here is what I work with.",
    "blocks": [
      {
        "id": "frontend",
        "title": "Web & Interfaces",
        "description": "Responsive, accessible interfaces that bring an idea to life across mobile and desktop.",
        "tags": [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS"
        ],
        "lines": [
          "Structure clear, semantic interfaces.",
          "Adapt layouts to screens and input methods.",
          "Make navigation and forms accessible.",
          "Keep loading and interaction responsive."
        ]
      },
      {
        "id": "backend",
        "title": "APIs & Integrations",
        "description": "Connect websites to useful services, with validated requests and clear error handling.",
        "tags": [
          "API routes",
          "Server actions",
          "Input validation"
        ],
        "lines": [
          "Validate requests on the server.",
          "Design APIs and server actions with clear contracts.",
          "Keep credentials outside browser code.",
          "Handle permissions, limits, and failures."
        ]
      },
      {
        "id": "database",
        "title": "Data & Structure",
        "description": "Organize product information with clear schemas and controlled access to private records.",
        "tags": [
          "Data modeling",
          "Prisma",
          "PostgreSQL"
        ],
        "lines": [
          "Choose a schema that matches the product.",
          "Keep data consistent and queries efficient.",
          "Plan migrations, backups, and recovery.",
          "Control access to private records."
        ]
      },
      {
        "id": "deployment",
        "title": "Deployment & Care",
        "description": "Take a website from development to a connected domain, with server-side secrets and abuse protection.",
        "tags": [
          "Vercel",
          "Git",
          "HTTPS",
          "Rate limiting"
        ],
        "lines": [
          "Build and release through repeatable steps.",
          "Use HTTPS and secure secret management.",
          "Monitor errors, usage, and availability.",
          "Maintain dependencies and abuse protection."
        ]
      },
      {
        "id": "ai",
        "title": "Chatbots & Assistants",
        "description": "Make business information easier to explore with custom website chatbots, carefully guided prompts and optional voice interaction.",
        "tags": [
          "Botpress",
          "OpenAI API",
          "Business FAQs",
          "Web Speech API"
        ],
        "lines": [
          "Provide useful context.",
          "Test answers and handle uncertainty."
        ]
      }
    ],
    "closing": "The chat demos show these pieces working together. You can also inspect their sample knowledge."
  }
} as const;
