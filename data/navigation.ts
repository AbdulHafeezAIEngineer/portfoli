/** Public page map shared by navigation, the home directory and sitemap. */
export const portfolioPages = {
  websites: {
    href: "/ai-websites",
    label: "AI Websites",
    description:
      "Explore original website concepts, responsive previews and the thinking behind each interface.",
  },
  bots: {
    href: "/ai-bots",
    label: "AI Bots",
    description:
      "Explore website chatbots, conversational demos and optional voice experiences.",
  },
  embedding: {
    href: "/ai-bots#embed-methods",
    label: "How I Embed Bots",
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
      "From curiosity about Python and AI to independent web development and building Elvora.",
  },
  domains: {
    href: "/technical-domains",
    label: "Technical Domains",
    description:
      "The engineering behind the interface: frontend, APIs, data, deployment and conversational AI.",
  },
  skills: {
    href: "/skills",
    label: "Skills & Tools",
    description:
      "The practical skills, development tools and AI workflows behind Elvora's projects.",
  },
  certificates: {
    href: "/certificates",
    label: "Certificates",
    description:
      "Explore Abdul Hafeez's learning and certificates, with full-size document previews.",
  },
  process: {
    href: "/ai-websites#workflow",
    label: "How I Build",
    description:
      "How I build websites with my own creativity, design judgment and carefully guided AI tools.",
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
  "domains",
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
  "#work": "/ai-websites",
  "#work-bunch": "/bunch-of-work",
  "#ai-bots": "/ai-bots",
  "#embed-methods": "/ai-bots#embed-methods",
  "#experience": "/about",
  "#journey": "/journey",
  "#fundamentals": "/technical-domains",
  "#skills": "/skills",
  "#creative-toolkit": "/skills",
  "#certification": "/certificates",
  "#workflow": "/ai-websites#workflow",
  "#testimonials": "/testimonials",
  "#faq": "/contact#faq",
  "#contact": "/contact",
};
