## data/admin.ts

``````typescript
export const adminContent = {
  title: "Elvora Studio",
  subtitle: "Portfolio management",
  loginTitle: "Welcome back.",
  loginDescription: "Sign in to manage your portfolio.",
  email: "Admin email",
  password: "Password",
  code: "Authenticator code (if enabled)",
  signIn: "Sign in",
  signOut: "Sign out",
  signingIn: "Signing in…",
  loginError: "Unable to sign in. Check your details or try again later.",
  save: "Save changes",
  create: "Create record",
  remove: "Delete record",
  deleteConfirm: "Delete this record? This cannot be undone.",
  cancel: "Cancel",
  new: "New record",
  loading: "Loading…",
  error:
    "The request could not be completed. Check your settings and try again.",
  saved: "Saved.",
  deleted: "Deleted.",
  up: "Move up",
  down: "Move down",
  edit: "Edit",
  empty: "No records yet.",
  upload: "Upload project images",
  uploadHelp:
    "JPEG, PNG or WebP. Maximum 4 images per upload, 3 MB each; files are decoded and re-encoded on the server.",
  uploadSuccess: "Images uploaded. Save the record to keep the image order.",
  jsonHelp:
    "Use valid JSON for arrays and structured configuration. Image order follows the screenshots array.",
  security: "Security",
  currentPassword: "Current password",
  newPassword: "New password",
  passwordRule:
    "14+ characters with uppercase, lowercase, number and symbol; at most 72 UTF-8 bytes.",
  changePassword: "Change password",
  changed: "Password changed. Sign in again.",
  twoFactor: "Two-factor authentication",
  setup: "Set up authenticator",
  confirm: "Enable two-factor",
  disable: "Disable two-factor",
  ticket: "Setup ticket",
  setupHelp:
    "Add this secret to your authenticator, then enter its six-digit code. Keep your setup secret private.",
  setupSecret: "Authenticator secret",
  enabled: "Two-factor enabled. Sign in again.",
  disabled: "Two-factor disabled. Sign in again.",
  dashboard: "Dashboard",
  total: "Records",
  back: "View portfolio",
  noSecrets: "Never put passwords, private keys or tokens in content fields.",
  read: "Mark read",
  unread: "Mark unread",
  delivery: "Delivery status",
  retention:
    "Chat logging is off by default. Enabling it requires appropriate user notice and a retention policy. Delete stored messages when no longer needed.",
  reorderHelp: "Move buttons save the order immediately.",
  published: "Published",
  uploading: "Uploading…",
  originWarning:
    "Set the actual public site origin and private database/auth settings before using production admin.",
  fields: {
    id: "ID / slug",
    title: "Title",
    subtitle: "Short subtitle",
    industry: "Industry",
    description: "Description",
    stack: "Tech stack (JSON array)",
    accent: "Accent hex color",
    demoUrl: "Local concept URL",
    highlights: "Design highlights (JSON array)",
    screenshots: "Images (ordered JSON array)",
    name: "Name",
    tags: "Tags (JSON array)",
    method: "Embed method",
    kind: "Bot kind",
    welcome: "Welcome message",
    starters: "Suggested prompts (JSON array)",
    note: "Disclosure / note",
    config: "Public connection configuration (JSON)",
    systemPrompt: "System prompt (server only)",
    category: "Category",
    issuer: "Issuer",
    dateLabel: "Displayed date",
    issuedAt: "Verified date (YYYY-MM-DD or blank)",
    image: "Image URL",
    alt: "Accessible image description",
    isPlaceholder: "Placeholder image",
    published: "Published",
    brand: "Brand",
    email: "Public email",
    chatLogging: "Store chat logs (explicit opt-in)",
    order: "Order",
  },
  resources: [
    { id: "projects", label: "Projects" },
    { id: "bots", label: "Bots" },
    { id: "skills", label: "Skills" },
    { id: "certificates", label: "Certificates" },
    { id: "settings", label: "Site settings" },
    { id: "inbox", label: "Contact inbox" },
    { id: "chatlogs", label: "Chat logs" },
    { id: "audit", label: "Audit log" },
  ],
} as const;
export const adminFields: Record<
  string,
  { key: string; type: "text" | "long" | "json" | "boolean" | "number" }[]
> = {
  projects: [
    { key: "id", type: "text" },
    { key: "title", type: "text" },
    { key: "subtitle", type: "text" },
    { key: "industry", type: "text" },
    { key: "description", type: "long" },
    { key: "stack", type: "json" },
    { key: "accent", type: "text" },
    { key: "demoUrl", type: "text" },
    { key: "highlights", type: "json" },
    { key: "screenshots", type: "json" },
    { key: "published", type: "boolean" },
  ],
  bots: [
    { key: "id", type: "text" },
    { key: "name", type: "text" },
    { key: "description", type: "long" },
    { key: "tags", type: "json" },
    { key: "method", type: "text" },
    { key: "kind", type: "text" },
    { key: "welcome", type: "long" },
    { key: "starters", type: "json" },
    { key: "note", type: "long" },
    { key: "config", type: "json" },
    { key: "systemPrompt", type: "long" },
    { key: "published", type: "boolean" },
  ],
  skills: [
    { key: "id", type: "text" },
    { key: "name", type: "text" },
    { key: "category", type: "text" },
    { key: "published", type: "boolean" },
  ],
  certificates: [
    { key: "id", type: "text" },
    { key: "title", type: "text" },
    { key: "issuer", type: "text" },
    { key: "dateLabel", type: "text" },
    { key: "issuedAt", type: "text" },
    { key: "description", type: "long" },
    { key: "image", type: "text" },
    { key: "alt", type: "text" },
    { key: "isPlaceholder", type: "boolean" },
    { key: "published", type: "boolean" },
  ],
  settings: [
    { key: "brand", type: "text" },
    { key: "email", type: "text" },
    { key: "title", type: "text" },
    { key: "description", type: "long" },
    { key: "chatLogging", type: "boolean" },
  ],
};
export const adminDefaults: Record<string, Record<string, unknown>> = {
  projects: {
    id: "",
    title: "",
    subtitle: "",
    industry: "",
    description: "",
    stack: ["Next.js", "TypeScript"],
    accent: "#d4af37",
    demoUrl: "/demo/restaurant",
    highlights: [],
    screenshots: [],
    published: false,
  },
  bots: {
    id: "",
    name: "",
    description: "",
    tags: [],
    method: "api",
    kind: "custom",
    welcome: "Hello. How can I help?",
    starters: [],
    note: "",
    config: null,
    systemPrompt: "",
    published: false,
  },
  skills: { id: "", name: "", category: "Web interfaces", published: true },
  certificates: {
    id: "",
    title: "",
    issuer: "[PLACEHOLDER]",
    dateLabel: "[PLACEHOLDER]",
    issuedAt: "",
    description: "",
    image: "/certificates/prompt-engineering-placeholder.png",
    alt: "Certificate image",
    isPlaceholder: true,
    published: false,
  },
  settings: {
    brand: "Elvora",
    email: "buildwithelvora@gmail.com",
    title: "",
    description: "",
    chatLogging: false,
  },
};
``````

## data/bots.ts

``````typescript
export type EmbedMethod = "iframe" | "script" | "api";
export type DemoBotId = "support" | "booking" | "voice";
export type BotId = string;
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type RealBotConfig =
  | { method: "iframe"; url: string }
  | {
      method: "script";
      src: string;
      mountId: string;
      attributes: Record<string, string>;
      integrity?: string;
    }
  | {
      method: "api";
      endpoint: string;
      requestField: "messages" | "message";
      responsePath: string;
      authHeader: "Authorization" | "x-api-key";
      authPrefix: string;
    };

// Edit this ONE object when your real embed details are available. Never put keys here.
// iframe: { method: "iframe", url: "https://your-provider.com/embed/your-bot" }
// script: { method: "script", src: "https://your-provider.com/widget.js", mountId: "bot-root", attributes: { "data-bot-id": "your-public-bot-id" } }
// api: { method: "api", endpoint: "https://your-provider.com/chat", requestField: "messages", responsePath: "reply", authHeader: "Authorization", authPrefix: "Bearer " }
export const realBotConfig: RealBotConfig = { method: "iframe", url: "" };

export type Bot = {
  id: BotId;
  name: string;
  description: string;
  tags: string[];
  method: EmbedMethod;
  kind: "real" | "demo" | "custom";
  configured: boolean;
  welcome: string;
  starters: string[];
  note: string;
};
export const chatPolicy = {
  maxInput: 1000,
  maxMessages: 11,
  maxContext: 6000,
  maxReply: 4000,
} as const;

export function getFileBots(): Bot[] {
  const configured =
    realBotConfig.method === "iframe"
      ? Boolean(realBotConfig.url)
      : realBotConfig.method === "script"
        ? Boolean(realBotConfig.src)
        : Boolean(realBotConfig.endpoint);
  return [
    {
      id: "real",
      name: "Abdul's AI Assistant",
      description:
        "My real chatbot, ready to connect through a hosted iframe, an isolated script widget, or your own API.",
      tags: ["Custom knowledge", "Website integration", "Real bot"],
      method: realBotConfig.method,
      kind: "real",
      configured,
      welcome: "",
      starters: [],
      note: "The provider manages this bot's conversation and data handling.",
    },
    {
      id: "support",
      name: "Cedar Support",
      description:
        "A helpful first point of contact for Cedar & Co., a fictional homewares company. Ask about delivery, returns, or products.",
      tags: ["Customer support", "Company knowledge", "AI demo"],
      method: "api",
      kind: "demo",
      configured: true,
      welcome:
        "Hi, I'm Cedar's demo support assistant. Ask me about our fictional homewares store, shipping, or returns. Please don't share personal or order details.",
      starters: [
        "What is your return policy?",
        "How long does delivery take?",
        "How do I care for ceramics?",
      ],
      note: "Fictional company. No real orders, account access, or human handoff.",
    },
    {
      id: "booking",
      name: "Meetly Booking",
      description:
        "Explore a friendly appointment flow: choose a sample service, discuss a time, and review a simulated booking summary.",
      tags: ["Appointment flow", "Sample availability", "AI demo"],
      method: "api",
      kind: "demo",
      configured: true,
      welcome:
        "Let's try a demo appointment for Meetly Studio. Would you like a 30-minute website consultation or an AI chatbot discovery call? This is a simulation and won't reserve a real appointment.",
      starters: [
        "I'd like a website consultation.",
        "What sample times can I choose?",
        "How does the demo booking work?",
      ],
      note: "Simulation only. No calendar integration, real reservation, or confirmation email.",
    },
    {
      id: "voice",
      name: "Aura Voice",
      description:
        "Speak a question, review the transcript, and hear the AI reply. Voice input and playback use your browser's Web Speech API.",
      tags: ["Speech to text", "Text to speech", "AI demo"],
      method: "api",
      kind: "demo",
      configured: true,
      welcome:
        "Hi, I'm Aura. Type a question or use the microphone, review your transcript, then press Send. I can explain website and chatbot ideas in plain English.",
      starters: [
        "How could a chatbot help my business?",
        "What can a voice assistant do?",
        "Explain website chatbot integration.",
      ],
      note: "Voice availability varies by browser. Text chat always remains available.",
    },
    ...additionalBots.map(({ card, connection }) => ({
      ...card,
      method: connection.method,
      configured:
        connection.method === "iframe"
          ? !!connection.url
          : connection.method === "script"
            ? !!connection.src
            : !!connection.endpoint,
    })),
  ];
}

export const botContent = {
  eyebrow: "02 / AI CHATBOT SERVICES",
  title: "Better conversations. Built right in.",
  description:
    "Try three focused AI demos, and explore how a custom assistant can become part of your own website.",
  try: "Try Live Demo",
  real: "REAL BOT",
  demo: "INTERACTIVE DEMO",
  pending: "Connection pending",
  methods: {
    iframe: "Iframe embed",
    script: "Script widget",
    api: "Custom UI · API",
  },
  privacy:
    "Demo messages are sent to the AI provider. Avoid confidential information. Chat history resets on reload. If conversation logging is enabled, messages are also retained securely for review; avoid personal or confidential information.",
  budget:
    "Demos have usage limits. Appointment bookings are simulated. External embeds follow their provider's policies.",
  embedTitle: "How I Embed Bots",
  embedDescription:
    "Three ways to meet your visitors where they already are. The right approach depends on the control and integration your business needs.",
  pros: "Works well for",
  cons: "Trade-offs",
  usedBy: "USED HERE BY",
  example: "Illustrative integration code",
  integrationEyebrow: "INTEGRATION / THREE APPROACHES",
  unusedMethod: "No bot currently uses this method.",
  chat: {
    close: "Close chat",
    clear: "Clear conversation",
    send: "Send message",
    input: "Your message",
    placeholder: "Ask a question…",
    thinking: "Thinking",
    you: "You",
    transcript: "Conversation",
    emptyRealTitle: "This connection is being prepared.",
    emptyReal:
      "My real chatbot will appear here once its connection is ready. In the meantime, try Cedar Support, Meetly Booking, or Aura Voice.",
    embedLoading: "Loading the bot provider…",
    embedNote:
      "The embedded provider controls its chat interface and message history. If it cannot load here, its embedding permissions may need updating.",
    embedTitle: "Live chatbot",
    error: "The reply could not be loaded. Your message is ready to retry.",
    invalidReply:
      "The service returned an unreadable reply. Please try again later.",
    limit: "characters",
    shortened:
      "This reply reached its length limit. Ask a follow-up for more detail.",
    voice: {
      start: "Start voice input",
      stop: "Stop voice input",
      listening: "Listening… speak, then review the transcript before sending.",
      speaking: "Reading the reply aloud",
      playback: "Read replies aloud",
      stopPlayback: "Stop reading",
      replay: "Read last reply",
      unsupported:
        "Voice input isn't available in this browser. You can still type; try a browser that supports speech recognition over HTTPS.",
      noPlayback:
        "Spoken replies aren't supported here. Replies are still displayed as text.",
      privacy:
        "Your browser may send audio to its speech service. Microphone input is added as editable text and is never sent automatically.",
      denied:
        "Microphone access was denied. Allow microphone access in your browser settings, or type instead.",
      noSpeech:
        "No speech was detected. Please try again or type your message.",
      failed:
        "Voice input stopped. Check your microphone or type your message instead.",
      playbackError:
        "The reply could not be read aloud. You can read it in the conversation.",
    },
  },
} as const;

export const embedMethods: {
  id: EmbedMethod;
  title: string;
  description: string;
  code: string;
  pros: string[];
  cons: string[];
}[] = [
  {
    id: "iframe",
    title: "Hosted iframe",
    description:
      "Place the provider's hosted chat page inside a contained area of your website.",
    code: '<iframe\n  src="https://your-provider.com/embed/your-bot"\n  title="Customer support assistant"\n  sandbox="allow-scripts allow-forms allow-same-origin"\n  referrerpolicy="no-referrer"\n  loading="lazy"\n></iframe>',
    pros: [
      "Quick integration with an existing hosted bot",
      "Provider maintains the chat interface",
    ],
    cons: [
      "Limited styling and control over the conversation",
      "Provider must allow framing; its privacy policy applies",
    ],
  },
  {
    id: "script",
    title: "Script widget",
    description:
      "Load a provider's widget script into a dedicated, isolated embed document.",
    code: '<div id="bot-root"></div>\n<script\n  src="https://your-provider.com/widget.js"\n  data-bot-id="your-public-bot-id"\n  defer\n></script>',
    pros: [
      "Uses the provider's own chat features",
      "Public data attributes can select your bot",
    ],
    cons: [
      "Runs third-party code; use a trusted provider",
      "Some widgets need storage or permissions unavailable in a sandbox",
    ],
  },
  {
    id: "api",
    title: "Custom chat UI via API",
    description:
      "Design the full conversation experience while your Next.js API route calls the AI provider securely.",
    code: 'const response = await fetch("/api/chat", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    botId: "support",\n    messages: [{ role: "user", content: "Hello" }],\n  }),\n});\nconst { reply } = await response.json();\n// Provider API keys stay on the server.',
    pros: [
      "Complete control over design, voice, and accessibility",
      "Server-side prompts, limits, and secret handling",
    ],
    cons: [
      "Requires maintaining the UI and server route",
      "API usage costs and abuse controls need management",
    ],
  },
];

export const additionalBots: {
  card: Omit<Bot, "configured" | "method">;
  connection: RealBotConfig;
}[] = [];
``````

## data/certificates.ts

``````typescript
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  dateLabel: string;
  issuedAt: string | null;
  description: string;
  image: string;
  alt: string;
  isPlaceholder: boolean;
};
export const certificates: Certificate[] = [
  {
    id: "prompt-engineering",
    title: "Master of ChatGPT",
    issuer: "Coursiv",
    dateLabel: "31 October 2024",
    issuedAt: "2024-10-31",
    description:
      "Certificate of completion awarded to Abdul Hafeez for completing the ChatGPT guide, with 6 hours of training and skill development. Certificate ID: ADO6IJOS.",
    image: "/certificates/coursiv-master-of-chatgpt.webp",
    alt: "Coursiv Master of ChatGPT certificate issued to Abdul Hafeez on 31 October 2024 for a 6-hour course; certificate ID ADO6IJOS",
    isPlaceholder: false,
  },
];
export const certificateContent = {
  eyebrow: "05 / CERTIFICATION",
  title: "Certificate Showcase",
  description:
    "My course completion certificate, with the original award details. Select the image to explore it in full screen.",
  placeholder: "[PLACEHOLDER] Certificate image pending",
  issuer: "ISSUER",
  date: "AWARDED",
  enlarge: "Click to enlarge",
  close: "Close certificate",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  reset: "Fit certificate",
  help: "Use + and − to zoom, 0 to reset, and Esc to close. Scroll or swipe to explore an enlarged image.",
  loading: "Loading certificate",
  unavailable:
    "The certificate image could not be loaded. Please try again later.",
} as const;
``````

## data/contact.ts

``````typescript
export const contactContent = {
  eyebrow: "06 / START A CONVERSATION",
  title: "Let's build something considered.",
  description:
    "Tell Elvora what you have in mind. A clear brief is a good place to start.",
  emailLabel: "EMAIL ELVORA",
  emailCta: "Open Gmail or your email app",
  emailNote: "Prefer email? Reach out directly using the address below.",
  formTitle: "Send a message",
  name: "Your name",
  email: "Email address",
  message: "Your message",
  namePlaceholder: "How should I address you?",
  emailPlaceholder: "you@example.com",
  messagePlaceholder:
    "What are you looking to build, and what matters most to you?",
  messageHint:
    "20–3,000 characters. Please avoid passwords or sensitive information.",
  honeypot: "Leave this field empty",
  send: "Send message",
  sending: "Sending…",
  characters: "characters",
  privacy:
    "Your name, email, and message are kept in a private inbox to respond to your enquiry. Please avoid confidential information.",
  success:
    "Your message was accepted by the mail server for delivery. Thank you for reaching out.",
  invalid: "Please check the highlighted fields.",
  failure:
    "Your message could not be confirmed as sent. Your details are still here; you can email Elvora directly.",
  sendingStatus: "Sending your message",
  errorTitle: "Message not sent",
  errors: {
    name: "Enter a name between 2 and 80 characters without line breaks.",
    email: "Enter a valid email address, up to 254 characters.",
    message: "Enter a message between 20 and 3,000 characters.",
    format: "The form request is invalid. Please check your details.",
    unavailable:
      "The contact form is not connected yet. Please email buildwithelvora@gmail.com directly.",
    limited:
      "Too many contact requests. Please try again later or email Elvora directly.",
    protection:
      "The contact form is temporarily unavailable. Please email Elvora directly.",
    origin: "Please use the contact form on the Elvora website.",
  },
} as const;
export const contactPolicy = {
  maxName: 80,
  maxEmail: 254,
  minMessage: 20,
  maxMessage: 3000,
  perTenMinutes: 3,
  perDay: 10,
} as const;
``````

## data/demos.ts

``````typescript
export const demos = {
  restaurant: {
    name: "Savor & Sage",
    kicker: "SEASONAL KITCHEN · A FICTIONAL RESTAURANT",
    headline: "A slower kind of extraordinary.",
    intro:
      "An intimate table. Ingredients at their best. A menu that follows the rhythm of the season.",
    action: "Explore the menu",
    secondary: "Our philosophy",
    inner: "A season, on a plate.",
    description:
      "A considered menu built around the market, the grower, and the pleasure of sharing something good.",
    items: [
      {
        name: "Garden, in green",
        detail: "Pea velouté · whipped ricotta · herb oil",
        price: "18",
      },
      {
        name: "From the coast",
        detail: "Roasted sea bass · fennel · lemon beurre blanc",
        price: "34",
      },
      {
        name: "A sweet ending",
        detail: "Poached pear · vanilla cream · almond crumble",
        price: "14",
      },
    ],
    feature: "Good food begins long before the kitchen.",
    featureText:
      "We follow the seasons and let simple ingredients lead. This fictional restaurant concept explores the craft of a welcoming digital dining experience.",
    nav: ["The menu", "Our story", "Visit us"],
    note: "FICTIONAL RESTAURANT · DESIGN CONCEPT · RESERVATIONS ARE NOT PROCESSED",
    category: "RESTAURANT",
  },
  "real-estate": {
    name: "Forma Living",
    kicker: "DISTINCTIVE SPACES. CONSIDERED LIVING.",
    headline: "Find a place that feels like you.",
    intro:
      "An edited collection of exceptional homes, shaped by architecture, light, and the way you want to live.",
    action: "Explore the collection",
    secondary: "Our approach",
    inner: "Spaces worth coming home to.",
    description:
      "From quiet courtyards to open horizons. Discover a different perspective on home.",
    items: [
      {
        name: "The Courtyard House",
        detail: "Palm Springs · 4 beds · 3 baths",
        price: "$2,450,000",
      },
      {
        name: "Horizon Residence",
        detail: "Joshua Tree · 3 beds · 2 baths",
        price: "$1,850,000",
      },
      {
        name: "The Glass Pavilion",
        detail: "Malibu · 5 beds · 4 baths",
        price: "$4,200,000",
      },
    ],
    feature: "Architecture you can feel.",
    featureText:
      "Warm materials. Open sightlines. A slower pace. Explore the Courtyard House, a fictional architectural listing designed around a seamless connection to the outdoors.",
    nav: ["Properties", "Our perspective", "Enquire"],
    note: "FICTIONAL LISTINGS · CONCEPT PRICES · NO PROPERTY SALES OR ENQUIRIES ARE PROCESSED",
    category: "REAL ESTATE",
  },
  saas: {
    name: "Orbit",
    kicker: "LESS BUSYWORK. MORE MOMENTUM.",
    headline: "Your team's next great idea starts here.",
    intro:
      "Bring projects, decisions, and the people behind them into one beautifully focused workspace.",
    action: "Explore the workspace",
    secondary: "See the details",
    inner: "Clarity, built into every day.",
    description:
      "Everything your team needs to move from an idea to a finished project. Together, in one place.",
    items: [
      {
        name: "One shared view",
        detail: "Plan priorities with a calm, flexible project board.",
        price: "01",
      },
      {
        name: "Decisions, in context",
        detail: "Keep notes and next steps beside the work.",
        price: "02",
      },
      {
        name: "Progress you can see",
        detail: "Turn milestones into a clear picture of momentum.",
        price: "03",
      },
    ],
    feature: "A little less noise. A lot more focus.",
    featureText:
      "Simple plans for teams with thoughtful ambitions. This is a fictional software concept; no account creation, payment, or subscription is processed.",
    nav: ["Product", "How it works", "Plans"],
    note: "FICTIONAL SOFTWARE · SAMPLE WORKSPACE · NO SIGNUP OR BILLING",
    category: "SOFTWARE",
  },
  store: {
    name: "ATELIER / 01",
    kicker: "THE EVERYDAY, RECONSIDERED.",
    headline: "Fewer pieces. More possibility.",
    intro:
      "Modern essentials with a quiet point of view. An edited wardrobe for the life between occasions.",
    action: "Discover the collection",
    secondary: "Our perspective",
    inner: "The new essentials.",
    description:
      "Beautifully simple silhouettes. Thoughtful proportions. Pieces that work harder, so you don't have to.",
    items: [
      {
        name: "The Sculpted Coat",
        detail: "Soft wool blend · warm camel",
        price: "$280",
      },
      {
        name: "The Everyday Shirt",
        detail: "Organic cotton · chalk",
        price: "$95",
      },
      {
        name: "The Wide Trouser",
        detail: "Structured twill · deep charcoal",
        price: "$140",
      },
    ],
    feature: "The shape of things to come.",
    featureText:
      "A sculpted shoulder, a generous silhouette, a thoughtful finish. A fictional fashion collection exploring the balance between form and everyday function.",
    nav: ["Collection", "The edit", "Our story"],
    note: "FICTIONAL FASHION STORE · DEMO BAG ONLY · NO CHECKOUT OR PAYMENTS",
    category: "FASHION",
  },
} as const;
export type DemoSlug = keyof typeof demos;
export const demoUI = {
  architectureAlt: "Original geometric illustration of a modern courtyard home",
  garmentAlts: [
    "Original sculptural coat illustration",
    "Original cotton shirt illustration",
    "Original tailored trouser illustration",
  ],
  workspaceAlt: "Fictional project workspace",
  filterLabel: "Filter concept properties",
  billingLabel: "Demo billing frequency",
  taskContext: "Design direction / sample",
  sampleInitials: "JD",
  concept: "Concept project",
  back: "Back to Elvora",
  menu: "Open menu",
  close: "Close menu",
  details: "Discover more",
  collection: "THE COLLECTION",
  feature: "A CLOSER LOOK",
  bag: "Bag",
  add: "Add to demo bag",
  added: "Added to demo bag",
  monthly: "Monthly",
  yearly: "Yearly",
  plans: [
    {
      name: "Studio",
      price: "19",
      description: "A considered space for small teams.",
    },
    {
      name: "Collective",
      price: "39",
      description: "Room for your next chapter.",
    },
  ],
  planAction: "Explore this demo plan",
  planNote: "This is a design demo. No subscription has been started.",
  locations: ["All homes", "Palm Springs", "Joshua Tree", "Malibu"],
  footnote:
    "An independent concept by Elvora. All brands, listings, products and business information on this page are fictional.",
  smallTitle: "DESIGNED FOR A MORE CONSIDERED EVERYDAY",
  currency: "per member / month",
  sample: "SAMPLE WORKSPACE",
  project: "Website launch",
  progress: "Project progress",
  tasks: [
    "Refine the direction",
    "Design the experience",
    "Build with intention",
  ],
  board: ["IN PROGRESS", "IN REVIEW", "COMPLETE"],
  activity: "Everything, in good order.",
  dimensions: "4 bedrooms / 3 bathrooms / 3,200 sq ft",
  material: "DESIGNED WITH INTENTION",
  itemDetails: "Material & care",
  itemCare: "Illustrative collection details. No physical products are sold.",
  restaurantCaption: "An illustrated study of seasonal ingredients",
  restaurantLabel: "THE SPRING TABLE",
  realEstateCaption: "Architectural study / The Courtyard House",
  storeCaption: "VOLUME 01 / MODERN ESSENTIALS",
  planLabel: "SIMPLE, THOUGHTFUL PLANS",
} as const;
``````

## data/experience.ts

``````typescript
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
``````

## data/projects.ts

``````typescript
import { demos } from "./demos";
export type Screenshot = { src: string; title: string; alt: string };
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  description: string;
  stack: string[];
  accent: string;
  demoUrl: string;
  highlights: string[];
  promoPrompt: string;
  screenshots: Screenshot[];
};
export type ProjectView = Omit<Project, "promoPrompt">;
const directions = [
  {
    id: "restaurant",
    title: demos.restaurant.name,
    subtitle: "A slower kind of extraordinary.",
    industry: "Restaurant & Hospitality",
    accent: "#b8c399",
    highlights: [
      "Editorial serif typography",
      "Seasonal food illustrations",
      "Menu-first navigation",
    ],
    description:
      "A fictional seasonal dining concept with an editorial home page, illustrated menu and a considered story section. The screenshots show the actual interactive concept pages built for this portfolio.",
  },
  {
    id: "real-estate",
    title: demos["real-estate"].name,
    subtitle: "Distinctive spaces. Considered living.",
    industry: "Architecture & Real Estate",
    accent: "#a9c4be",
    highlights: [
      "Original architectural vectors",
      "Interactive property filters",
      "Spacious listing presentation",
    ],
    description:
      "A fictional architectural property collection with original vector illustrations, location filtering and a detailed residence feature. Listings and prices are illustrative, with no transactions processed.",
  },
  {
    id: "saas",
    title: demos.saas.name,
    subtitle: "Less busywork. More momentum.",
    industry: "Software & Productivity",
    accent: "#a4e5c3",
    highlights: [
      "Detailed product workspace",
      "Mint-on-midnight palette",
      "Interactive billing selector",
    ],
    description:
      "A fictional team-workspace landing page with a designed dashboard, product-feature section and interactive monthly/yearly price comparison. No signups, subscriptions or billing are processed.",
  },
  {
    id: "store",
    title: demos.store.name,
    subtitle: "Fewer pieces. More possibility.",
    industry: "Fashion & E-commerce",
    accent: "#d4b494",
    highlights: [
      "Original garment illustrations",
      "Editorial collection layout",
      "Interactive demo shopping bag",
    ],
    description:
      "A fictional fashion storefront with sculptural garment illustrations, an editorial collection and an interactive demonstration bag. No physical products are sold, and no checkout or payments are processed.",
  },
];
const views = [
  "Home page desktop",
  "Inner page desktop",
  "Mobile view",
  "Feature / detail section",
];
export const projects: Project[] = directions.map((project) => ({
  ...project,
  stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  demoUrl: Object.hasOwn(demos, project.id) ? `/demo/${project.id}` : "",
  promoPrompt: `Create a premium promotional 3D hero render for the fictional ${project.title} ${project.industry} website: a floating laptop and overlapping phone showing a refined responsive interface, dark midnight studio background, champagne-gold rim lighting, subtle violet atmosphere, realistic metal edges and glass reflections, elegant negative space, ultra-realistic render, 16:10. No claims of client work, no watermarks. The website's visual direction is ${project.highlights.join(", ")}.`,
  screenshots: views.map((title, index) => ({
    src: `/projects/${project.id}-${index + 1}.webp`,
    title,
    alt: `${project.title}: actual ${title.toLowerCase()} screenshot of the fictional concept website`,
  })),
}));
export function getFileProjects(): ProjectView[] {
  return projects.map(({ promoPrompt: _prompt, ...project }) => project);
}
``````

## data/prompts/booking.ts

``````typescript
import "server-only";
export const bookingPrompt = `You are Meetly Booking, an appointment-booking SIMULATION for fictional Meetly Studio.
Offer only two sample services: a 30-minute website consultation or a 30-minute AI chatbot discovery call, both fictional and free in this demo.
Sample slots: Monday–Friday at 09:00, 11:00, or 14:00 in Asia/Karachi (UTC+5). These are example slots, never live availability.
Flow: ask which service; ask for a future weekday date and one sample time; optionally ask for a first name (never contact details); show a concise summary; ask the visitor to explicitly confirm before marking the simulation complete. If a date is ambiguous or invalid, ask for clarification. Use the server's current date context when interpreting tomorrow or next week. Do not state a slot is reserved while gathering details.
After explicit confirmation say 'Demo booking complete — no real appointment has been reserved' and repeat the sample service, date, time, and timezone. Never invent a booking reference, email confirmation, actual calendar event, availability check, or external side effect. You have no booking tools or database. State clearly that this is a simulation and redirect real appointment enquiries to the portfolio owner's contact section. Do not request email, phone, addresses, payment, or sensitive information. Keep each turn focused on the next question.`;
``````

## data/prompts/support.ts

``````typescript
import "server-only";
export const supportPrompt = `You are Cedar Support, the demonstration assistant for Cedar & Co., a FICTIONAL homewares company.
Answer only from these sample facts:
- Products: ceramic vessels, linen textiles, and small home accessories. No live stock or prices are available.
- Sample shipping: domestic delivery in 3–5 business days after dispatch; free domestic shipping for sample orders over $75; otherwise $6. International shipping is not offered in this demo.
- Sample returns: unused goods in original packaging within 30 days of delivery; customers cover return shipping unless an item is faulty. Refunds are processed 5–10 business days after inspection.
- Damaged items: explain the sample process of contacting the store within 48 hours with photos, but do not request photos, order numbers, contact information, or payment details here.
- Sample support hours: Monday–Friday, 9am–5pm, Asia/Karachi.
- Care: hand-wash ceramics unless a product label says dishwasher-safe; wash linen cold and air-dry.
Explain when a question is outside these facts. Never invent a working support address, escalation, order lookup, discount, tracking result, or completed action. Clearly explain that actual order help is unavailable in this fictional demo. Be warm, concise, and businesslike.`;
``````

## data/prompts/voice.ts

``````typescript
import "server-only";
export const voicePrompt = `You are Aura Voice, a friendly portfolio demonstration assistant for Abdul Hafeez, an AI chatbot and web developer.
Explain custom-data chatbots, website integration, browser voice interaction, customer support use cases, and web development in plain English. Do not invent Abdul's work history, credentials, clients, prices, availability, guarantees, or completed projects. The portfolio's website projects are independent concepts.
Keep answers short and conversational, usually two to four sentences, suitable for text-to-speech. Avoid markdown tables and long code blocks. Ask at most one clarifying question. Do not claim to hear audio directly: the browser supplies an editable speech transcript, and your response is text that the browser may read aloud. You cannot browse, execute tasks, book appointments, or access private data. Redirect unrelated requests to the site's chatbot and web development topics.`;
``````

## data/site.ts

``````typescript
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
``````

## data/skills.ts

``````typescript
export type Skill = { id: string; name: string; category: string };
export const skills: Skill[] = [
  {
    id: "ai-tools",
    name: "[PLACEHOLDER] Verified AI tool names",
    category: "AI tools",
  },
  { id: "prompts", name: "Structured prompts", category: "Prompt engineering" },
  {
    id: "context",
    name: "Context & constraints",
    category: "Prompt engineering",
  },
  {
    id: "evaluation",
    name: "Output evaluation",
    category: "Prompt engineering",
  },
  { id: "next", name: "Next.js", category: "Web interfaces" },
  { id: "react", name: "React", category: "Web interfaces" },
  { id: "typescript", name: "TypeScript", category: "Web interfaces" },
  { id: "tailwind", name: "Tailwind CSS", category: "Web interfaces" },
  { id: "routes", name: "API routes", category: "APIs & data" },
  { id: "actions", name: "Server actions", category: "APIs & data" },
  {
    id: "databases",
    name: "Databases & data modeling",
    category: "APIs & data",
  },
  { id: "validation", name: "Input validation", category: "APIs & data" },
  { id: "stt", name: "Speech to text", category: "Voice AI" },
  { id: "tts", name: "Text to speech", category: "Voice AI" },
  { id: "speech", name: "Web Speech API", category: "Voice AI" },
];
export const skillContent = {
  eyebrow: "04 / TOOLS & TECHNOLOGIES",
  title: "A toolkit with purpose.",
  description:
    "The technologies and topics behind web, chatbot, and voice experiences.",
  note: "Toolkit topics are shown without proficiency scores or experience-duration claims. [PLACEHOLDER] Add verified hands-on examples and your actual AI tool names.",
  categories: [
    "AI tools",
    "Prompt engineering",
    "Web interfaces",
    "APIs & data",
    "Voice AI",
  ],
} as const;
``````

