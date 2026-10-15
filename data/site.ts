const deploymentDomain =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const netlifyUrl =
  process.env.NETLIFY === "true"
    ? process.env.URL || process.env.DEPLOY_PRIME_URL
    : undefined;

export const site = {
  brand: "Elvora",
  logo: { src: "/elvora-logo.svg" },
  name: "Abdul Hafeez",
  role: "AI Chatbot & Web Developer",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    netlifyUrl ||
    (deploymentDomain
      ? `https://${deploymentDomain}`
      : "http://localhost:3000"),
  email: "buildwithelvora@gmail.com",
  title: "Elvora — Thoughtful websites. Intelligent experiences.",
  description:
    "Elvora is Abdul Hafeez's portfolio for thoughtful websites, AI chatbot concepts, and voice experiences. Explore the work and start a conversation.",
  nav: [
    { label: "Work", href: "#work" },
    { label: "AI Bots", href: "#ai-bots" },
    { label: "About Me", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Certification", href: "#certification" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "INDEPENDENT DEVELOPER · BUILT WITH INTENTION",
    heading: ["Thoughtful websites.", "Intelligent", "experiences."],
    intro:
      "I'm Abdul Hafeez — an AI chatbot and web developer turning business ideas into considered digital experiences.",
    tagline:
      "I can train an AI chatbot on your custom data, add voice functionality, and embed it directly on your website.",
    primary: "View Work",
    secondary: "Contact Me",
    note: "A little design. A lot of possibility.",
    portrait: "/portrait-placeholder.svg",
    portraitAlt:
      "Abstract portrait placeholder for Abdul Hafeez; personal photo coming soon",
    portraitLabel: "THE PERSON BEHIND THE PIXELS",
    portraitCaption: "A developer's mind. A designer's eye.",
    portraitStatus: "Portrait placeholder",
    floatingLabel: "HUMAN IDEAS. DIGITAL CRAFT.",
  },
  expertise: ["Web development", "AI chatbots", "Voice experiences"],
  work: {
    eyebrow: "01 / SELECTED EXPLORATIONS",
    title: "Ideas, brought to the browser.",
    description:
      "Four industries. Four distinct directions. A collection of self-initiated concepts exploring what your next website could feel like.",
    tabs: [
      { id: "web", title: "Web Development", detail: "04 concept projects" },
      {
        id: "bots",
        title: "AI Chatbot Services",
        detail: "01 custom bot · 03 AI demos",
      },
    ],
    concept: "Concept Project",
    view: "View Project",
    gallery: "screenshot gallery",
    screenshotNote:
      "Actual screenshots of the fictional demo sites · Explore all four views",
    disclaimer:
      "Independent concept projects. No client commissions or affiliations are implied.",
  },
  errors: {
    notFound: "This page took a different path.",
    missing: "The page you requested could not be found.",
    home: "Return to Elvora",
    title: "Something interrupted the experience.",
    description: "Please try again in a moment.",
    retry: "Try again",
  },
  footer: "Designed with care. Built with intention.",
  ui: {
    skip: "Skip to content",
    home: "Elvora — Home",
    menuOpen: "Open navigation",
    menuClose: "Close navigation",
    light: "Switch to light theme",
    dark: "Switch to dark theme",
    back: "Back to top",
    close: "Close gallery",
    previous: "Previous screenshot",
    next: "Next screenshot",
    galleryHelp:
      "Use arrow keys to browse · Esc to close · Swipe on touch screens",
    loading: "Loading portfolio",
    loadingImage: "Loading screenshot",
    imageError: "Screenshot unavailable. Choose another thumbnail.",
    show: "Show",
    screenshot: "Screenshot",
    of: "of",
    stack: "BUILT WITH",
    highlights: "DESIGN HIGHLIGHTS",
    demo: "Explore the concept site",
    placeholder: "CONCEPT PREVIEW",
  },
} as const;
