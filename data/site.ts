import { primaryNavigation } from "./navigation";
export const site = {
  brand: "Elvora",
  logo: { src: "/elvora-logo.svg" },
  name: "Abdul Hafeez",
  role: "Web Developer & Chatbot Builder",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.elvoraai.online",
  email: "abdulhafeez@elvoraai.online",
  title: "Elvora — Thoughtful websites. Built with intention.",
  description:
    "Elvora is Abdul Hafeez's portfolio for website design, web development and optional chatbot integrations. Explore original work, the tools behind it and the process from idea to launch.",
  nav: primaryNavigation,
  hero: {
    eyebrow: "INDEPENDENT DEVELOPER · BUILT WITH INTENTION",
    heading: ["Thoughtful websites.", "Built with intention."],
    intro:
      "Elvora is my space for original websites, thoughtful interfaces and the craft behind them. Explore the work, see the tools and process, and find a direction for your own project.",
    tagline:
      "I'm Abdul Hafeez. Design, code and careful testing lead every build. I use a practical development stack, with AI assistance for selected tasks.",
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
      "Four original concepts. Four distinct worlds. Bespoke websites for hospitality, electric mobility, private care and architecture—built to explore, not just look at.",
    tabs: [
      {
        id: "web",
        title: "Web Development",
        detail: "04 bespoke concept websites",
      },
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
      "Actual browser captures of all four custom demos · Desktop, details and mobile views",
    disclaimer:
      "Independent concept projects with fictional brands, original illustrations and generated imagery. No client commissions or real bookings, sales or clinical services are implied.",
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
    gallerySingleHelp: "Press Esc to close · Open the website to explore more",
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
