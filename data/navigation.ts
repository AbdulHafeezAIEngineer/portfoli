/** Public page map shared by navigation, the home directory and sitemap. */
export const portfolioPages = {
  websites: {
    href: "/websites",
    label: "Websites",
    description:
      "Custom website design and development for businesses worldwide. Clear service pages, mobile-friendly layouts and simple ways for customers to contact you.",
  },
  bots: {
    href: "/ai-bots",
    label: "AI Agents",
    description:
      "Custom AI agents for your website, using your business information. Help customers find answers about your products, services and policies.",
  },
  embedding: {
    href: "/ai-bots#embed-methods",
    label: "How I Embed Agents",
    description:
      "How chatbots connect to websites, from embedded widgets to custom API integrations.",
  },
  collection: {
    href: "/bunch-of-work",
    label: "Bunch of Work",
    description:
      "A larger, immersive collection of Elvora's original website concepts and interface studies.",
  },
  about: {
    href: "/about",
    label: "About Me",
    description: "Meet Abdul Hafeez, the independent developer behind Elvora.",
  },
  journey: {
    href: "/journey",
    label: "My Journey",
    description:
      "From curiosity about Python and the web to independent web development and building Elvora.",
  },
  domains: {
    href: "/websites#fundamentals",
    label: "Technical Domains",
    description:
      "The engineering behind the interface: frontend, APIs, data, deployment and conversational AI.",
  },
  skills: {
    href: "/skills",
    label: "Skills & Tools",
    description:
      "The development tools, engineering practices and integrations behind Elvora's projects.",
  },
  certificates: {
    href: "/certificates",
    label: "Certificates",
    description:
      "Explore Abdul Hafeez's learning and certificates, with full-size document previews.",
  },
  process: {
    href: "/websites#workflow",
    label: "How I Build",
    description:
      "How I build websites with design judgment, a practical development stack and testing on mobile and desktop.",
  },
  testimonials: {
    href: "/testimonials",
    label: "Testimonials",
    description:
      "Client perspectives on design, development and working with Elvora.",
  },
  services: {
    href: "/services",
    label: "Services",
    description:
      "Website development, conversational AI and practical integrations built around your project.",
  },
  contact: {
    href: "/contact",
    label: "Contact",
    description:
      "Start a conversation with Elvora about a website, chatbot or digital experience.",
  },
} as const;
export type PortfolioPage = keyof typeof portfolioPages;
export const aboutPages = [
  "about",
  "journey",
  "skills",
  "certificates",
] as const;
export const primaryNavigation = [
  { href: "/", label: "Home" },
  portfolioPages.websites,
  portfolioPages.bots,
  portfolioPages.collection,
  portfolioPages.about,
  portfolioPages.testimonials,
  portfolioPages.contact,
];
export const legacySections: Record<string, string> = {
  "#services": "/services",
  "#work": "/websites",
  "#work-bunch": "/bunch-of-work",
  "#ai-bots": "/ai-bots",
  "#embed-methods": "/ai-bots#embed-methods",
  "#experience": "/about",
  "#journey": "/journey",
  "#fundamentals": "/websites#fundamentals",
  "#skills": "/skills",
  "#creative-toolkit": "/skills",
  "#certification": "/certificates",
  "#workflow": "/websites#workflow",
  "#testimonials": "/testimonials",
  "#faq": "/contact#faq",
  "#contact": "/contact",
};
