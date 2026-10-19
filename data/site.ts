import { primaryNavigation } from "./navigation";
export const site = {
  brand: "Elvora",
  logo: { src: "/elvora-logo.svg" },
  name: "Abdul Hafeez",
  role: "Web Developer & Chatbot Builder",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.elvoraai.online",
  email: "abdulhafeez@elvoraai.online",
  title: "Web Design & Development by Abdul Hafeez | Elvora",
  description:
    "Abdul Hafeez builds websites and chatbots that answer from your business documents. Explore the Kovo and Solenne concepts or try Veldt’s store assistant.",
  nav: primaryNavigation,
  hero: {
    eyebrow: "WEB DESIGN, DEVELOPMENT & AI CHATBOTS",
    heading: ["I build websites.", "And chatbots that answer from your documents."],
    intro:
      "We build custom websites and AI assistant bots for businesses worldwide.",
    tagline:
      "Make your services clear, help visitors get answers and give them an easy way to contact you. Your chatbot answers questions using the business information you provide.",
    primary: "View Work",
    secondary: "Contact Me",
    note: "Try the Kovo website concept or ask Veldt a delivery question.",
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
    title: "Four website concepts. Try the working pages.",
    description:
      "Kovo has an architecture enquiry form. Solenne has a sample stay planner. Open each concept to test its layout and interactions. All four brands are fictional.",
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
    notFound: "Page not found.",
    missing: "The page you requested could not be found.",
    home: "Return to Elvora",
    title: "The page could not load.",
    description: "Please try again in a moment.",
    retry: "Try again",
  },
  footer: "Independent web development by Abdul Hafeez.",
  ui: {
    skip: "Skip to content",
    home: "Elvora ;  Home",
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
