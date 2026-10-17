## data/admin.ts

``````ts
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
  loginError: "Sign-in details were not accepted. Check your admin email, password and authenticator code if enabled.",
  loginUnavailable: "Owner sign-in is temporarily unavailable. The deployment needs its private authentication/database configuration checked. Your details have not been cleared.",
  loginLimited: "Too many sign-in attempts. Wait a minute, then try again.",
  loginSessionError: "Your sign-in session could not be saved. Allow essential cookies and open the website using its HTTPS address, then try again.",
  setupTitle: "Owner sign-in needs setup",
  setupDescription: "The private authentication settings are incomplete on this deployment. Finish the database, authentication and first-owner setup in the hosting dashboard, then check again.",
  checkSetup: "Check again",
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
    question: "Question",
    answer: "Answer",
    detail: "Scope note",
    scope: "Deliverables (one per line)",
    requirements: "Requirements (one per line)",
    role: "Role / organization",
    quote: "Genuine feedback",
    portrait: "Approved portrait URL (optional)",
    permissionConfirmed:
      "Permission to publish this genuine feedback and portrait confirmed",
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
    { id: "services", label: "Services" },
    { id: "faqs", label: "FAQs" },
    { id: "testimonials", label: "Approved reviews" },
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
  {
    key: string;
    type: "text" | "long" | "json" | "boolean" | "number" | "lines";
  }[]
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
    email: "abdulhafeez@elvoraai.online",
    title: "",
    description: "",
    chatLogging: false,
  },
};

adminFields.services = [
  { key: "id", type: "text" },
  { key: "title", type: "text" },
  { key: "description", type: "long" },
  { key: "detail", type: "long" },
  { key: "tags", type: "lines" },
  { key: "scope", type: "lines" },
  { key: "requirements", type: "lines" },
  { key: "published", type: "boolean" },
];
adminFields.faqs = [
  { key: "id", type: "text" },
  { key: "question", type: "text" },
  { key: "answer", type: "long" },
  { key: "published", type: "boolean" },
];
adminFields.testimonials = [
  { key: "id", type: "text" },
  { key: "name", type: "text" },
  { key: "role", type: "text" },
  { key: "quote", type: "long" },
  { key: "portrait", type: "text" },
  { key: "permissionConfirmed", type: "boolean" },
  { key: "published", type: "boolean" },
];
adminDefaults.services = {
  id: "",
  title: "",
  description: "",
  detail: "",
  tags: [],
  scope: [],
  requirements: [],
  published: false,
};
adminDefaults.faqs = { id: "", question: "", answer: "", published: false };
adminDefaults.testimonials = {
  id: "",
  name: "",
  role: "",
  quote: "",
  portrait: "",
  permissionConfirmed: false,
  published: false,
};
``````

## data/agency.ts

``````ts
import { studio } from "./studio";
export type Service = {
  id: string;
  title: string;
  description: string;
  detail: string;
  tags: string[];
  scope: string[];
  requirements: string[];
};
const scopes = [
  [
    "Responsive page design and implementation",
    "Accessible navigation, forms and interaction states",
    "Deployment and domain connection",
  ],
  [
    "An approved business knowledge base and FAQ flow",
    "Website embed with consent and fallback states",
    "Response testing and a clear handoff to your team",
  ],
  [
    "A defined trigger, validated inputs and an API or webhook connection",
    "Failure handling and human review where needed",
    "Setup notes for the connected services",
  ],
  [
    "Titles, descriptions and crawlable page structure",
    "Responsive layout and image performance review",
    "A documented review of the changes and remaining issues",
  ],
];
const requirements = [
  [
    "Your business goals and desired pages",
    "Approved copy, brand assets and product information",
    "Hosting and domain access when launching",
  ],
  [
    "Accurate business information you have permission to use",
    "Example questions and escalation rules",
    "A suitable AI provider account and agreed usage budget",
  ],
  [
    "The specific repetitive task and desired result",
    "API access to the services involved",
    "Rules for approval, personal data and failures",
  ],
  [
    "Access to the existing website",
    "The pages and customer journeys to prioritize",
    "Any available performance or search reports",
  ],
];
export const services: Service[] = studio.services.items.map((item, i) => ({
  ...item,
  tags: [...item.tags],
  scope: scopes[i],
  requirements: requirements[i],
}));
export type Faq = { id: string; question: string; answer: string };
export const faqs: Faq[] = [
  {
    id: "start",
    question: "What do you need to start a project?",
    answer:
      "A short explanation of your business, the problem you want to solve and the pages or features you need. Existing brand assets, copy and examples help define the scope. We agree on deliverables before development starts.",
  },
  {
    id: "timeline",
    question: "How long does a website take?",
    answer:
      "Timing depends on the number of pages, content readiness and integrations. After reviewing your requirements, I can propose milestones and a realistic delivery schedule.",
  },
  {
    id: "ai",
    question: "Can a chatbot use my business information?",
    answer:
      "Yes. A chatbot can use approved business information, services and FAQs. We define what it should answer, test its responses and provide a fallback for questions it cannot safely resolve. AI responses still need appropriate review.",
  },
  {
    id: "providers",
    question: "Are hosting and AI usage included?",
    answer:
      "Provider costs depend on the chosen hosting, domain, email and AI services. These are discussed separately so you know which accounts and ongoing charges you control.",
  },
  {
    id: "existing",
    question: "Can you improve my existing website?",
    answer:
      "Yes. I can review its mobile experience, accessibility, performance and structure, then propose specific improvements. The scope depends on the existing code and platform.",
  },
  {
    id: "handover",
    question: "What happens after launch?",
    answer:
      "You receive a handover of the agreed work and setup notes. Ongoing updates, monitoring and chatbot content changes can be arranged as a separate scope.",
  },
];
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  portrait: string;
  placeholder?: boolean;
};
``````

## data/bots.ts

``````ts
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
      botpress?: { configurationSrc: string };
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
export const realBotConfig: RealBotConfig = {
  method: "script",
  src: "https://cdn.botpress.cloud/webchat/v5.0/inject.js",
  mountId: "forte-study-assistant",
  attributes: {},
  botpress: {
    configurationSrc:
      "https://files.bpcontent.cloud/2026/10/09/06/20261009063223-SY2FHGEQ.js",
  },
};

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
  provider?: "botpress";
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
      name: "Forte O Level Study Assistant",
      description:
        "Ask about Forte O Level study materials, exam questions and revision. Click anywhere on this card to open the connected assistant directly.",
      tags: ["O Level guidance", "Study materials", "Botpress"],
      method: realBotConfig.method,
      kind: "real",
      configured,
      ...(realBotConfig.method === "script" && realBotConfig.botpress
        ? { provider: "botpress" as const }
        : {}),
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
      ...(connection.method === "script" && connection.botpress
        ? { provider: "botpress" as const }
        : {}),
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
  preview: {
    mark: "forte",
    label: "CHAT PREVIEW",
    subtitle: "Study materials, exam questions and revision",
    heading: "Let's prepare for your exams",
    description: "Ask about your study materials, exam questions, or revision.",
    invitation: "Click to start a conversation",
    placeholder: "Type your message…",
    powered: "Powered by Botpress",
  },
  open: "Open chat",
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
    embedOpening: "Opening the assistant…",
    embedUnavailable:
      "The assistant could not load. Please try again or check your connection.",
    embedRetry: "Try again",
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
      "Load a provider's widget in a dedicated embed document. The Botpress adapter loads its two official scripts in order and supports provider storage.",
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

``````ts
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

## data/concept-images.ts

``````ts
export const conceptImagePrompts = [
  {
    "slug": "solenne",
    "src": "/concepts/solenne-hero.webp",
    "prompt": "Create a photorealistic architectural editorial image for a FICTIONAL boutique Mediterranean coastal hotel website concept named Solenne. Landscape 16:10. View from a sunlit pale limestone terrace across an impossibly serene infinity pool toward a quiet turquoise cove, a sculptural cream hotel facade with deep shaded arches and linen parasols on the left, one olive tree in a large terracotta pot, subtle distant cliffs, early morning golden light. Restrained luxury travel magazine photography, warm ivory, sand, muted terracotta, clear pale blue sea, tactile natural materials, incredible realism and careful architectural geometry. No people, no text, no logos, no watermarks. Beautiful enough to anchor an expensive editorial hotel website. A fictional property, not a recognizable real hotel."
  },
  {
    "slug": "vanta",
    "src": "/concepts/vanta-hero.webp",
    "prompt": "Create a photorealistic luxury automotive campaign image for a FICTIONAL performance-car brand Vanta, for a custom website demo. Landscape 16:10. Full side three-quarter view of an original unbranded graphite-black electric grand touring sports coupe in a vast dark architectural studio, dramatic slim white running lights and minimal acid-lime accent reflection on the wet polished floor. Car completely in frame with breathing room, elegant bespoke original bodywork, no identifiable existing car badge or manufacturer. Heroic low camera angle, sculptural architectural ceiling beams receding into darkness, impeccable automotive advertising photography, razor sharp body reflections, charcoal, silver, restrained lime green. No humans, no lettering, no logos, no watermarks."
  },
  {
    "slug": "aster",
    "src": "/concepts/aster-hero.webp",
    "prompt": "Create a photorealistic editorial interior image for a FICTIONAL private wellness clinic website concept called Aster Care. Landscape 16:10. A beautiful calm private-clinic reception lounge with softly curved ivory plaster walls, a sage-green velvet sofa, light travertine desk, oak joinery, a large indoor olive tree and abundant soft daylight through tall arched windows, a sculptural frosted-glass partition. Contemporary hospitality quality, welcoming, minimal, elevated, human and serene. No people, no medical procedures, no medical devices, no signage, no logos, no text, no watermarks. Colors warm white, pale mint, sage, natural oak and delicate silver. Realistic architectural photography, refined material textures. Fictional interior, no claim of a real healthcare provider."
  },
  {
    "slug": "kovo",
    "src": "/concepts/kovo-hero.webp",
    "prompt": "Create a photorealistic high-end architectural magazine photograph for a FICTIONAL design studio website concept KOVO. Landscape 16:10. A striking sculptural two-storey home of pale raw concrete and warm dark timber, one huge circular window and a dramatically cantilevered monolithic upper volume, nestled in a quiet pine forest, low-slung flat roof, oversized glass reflecting trees, a shallow stone path and wild grasses in the foreground. Carefully composed front three-quarter wide angle, overcast diffuse daylight, poetic stillness, tactile material detail, Belgian minimalism with Japanese spatial restraint, professional architectural photography. A wholly original fictional building, no known real-world project. No humans, no lettering, no logo, no watermark."
  }
] as const;
``````

## data/concepts.ts

``````ts
export const concepts = {
  solenne: {
    name: "Solenne",
    wordmark: "solenne",
    industry: "Boutique Hotel & Hospitality",
    accent: "#d0ad7c",
    category: "HOTEL / COASTAL RETREAT",
    kicker: "A QUIETER KIND OF LUXURY",
    headline: ["Somewhere", "time slows down."],
    intro: "Salt on your skin. Sunlight on stone. A considered coastal escape, with room to simply be.",
    action: "Find your stay",
    secondary: "Discover Solenne",
    nav: ["Our stays", "The retreat", "Plan a stay"],
    image: "/concepts/solenne-hero.webp",
    imageAlt: "Generated concept of a limestone coastal retreat, an infinity pool and a quiet Mediterranean cove",
    caption: "THE COAST, AT ITS MOST QUIET",
    collectionTitle: "A space to call your own.",
    collectionIntro: "Thoughtful spaces, natural textures, and the luxury of an unhurried morning. Explore our fictional collection.",
    filters: ["All stays", "Suites", "Villas"],
    items: [
      { name: "The Terrace Suite", category: "Suites", detail: "Open sea views · Private terrace · Two guests", price: "From €320 / night", number: "01", icon: "sun" },
      { name: "The Garden Suite", category: "Suites", detail: "Olive courtyard · Outdoor bath · Two guests", price: "From €280 / night", number: "02", icon: "leaf" },
      { name: "The Cove Villa", category: "Villas", detail: "Private plunge pool · Two bedrooms · Four guests", price: "From €580 / night", number: "03", icon: "waves" },
    ],
    featureTitle: "Nothing extra. Everything considered.",
    featureText: "Mornings that begin at the water. Long lunches beneath the olive trees. Architecture that belongs to its landscape. A fictional retreat imagined around the simple pleasure of slowing down.",
    featureList: ["Seasonal coastal kitchen", "Quiet spaces, naturally", "The sea, a few steps away"],
    formTitle: "Your next quiet moment.",
    formDescription: "Explore a sample stay. This interactive concept does not check real availability or take reservations.",
    footer: "A fictional coastal retreat. Sample rooms and rates. No reservations or payments are processed.",
    highlights: ["Editorial hospitality design", "Interactive stay filters", "Validated sample reservation flow"],
    subtitle: "A slower rhythm. A different kind of stay.",
    description: "An original boutique-hotel website concept with coastal imagery, editorial typography, suite/villa filters and a validated sample-stay planner. All property details and rates are fictional; no booking or payment is made.",
  },
  vanta: {
    name: "Vanta Motors",
    wordmark: "VANTA",
    industry: "Automotive & Electric Mobility",
    accent: "#c5ed54",
    category: "AUTOMOTIVE / ELECTRIC GT",
    kicker: "THE NEXT CHAPTER OF MOVEMENT",
    headline: ["PURE FORM.", "PURE INTENT."],
    intro: "An electric grand tourer imagined around the drive. Sculptural by design. Considered in every detail.",
    action: "Build your Vanta",
    secondary: "Explore the collection",
    nav: ["The collection", "Our philosophy", "Configure"],
    image: "/concepts/vanta-hero.webp",
    imageAlt: "Generated original graphite electric coupe in a dark architectural studio; a fictional vehicle design",
    caption: "VANTA GT / ORIGINAL DESIGN CONCEPT",
    collectionTitle: "One vision. Your expression.",
    collectionIntro: "Choose a fictional model and explore the details that make it yours. Specifications are illustrative design content.",
    filters: ["GT", "GT-S", "Touring"],
    items: [
      { name: "Vanta GT", category: "GT", detail: "The considered grand tourer", price: "480 km", number: "3.8 s", icon: "280 kW" },
      { name: "Vanta GT-S", category: "GT-S", detail: "A sharper expression of electric performance", price: "450 km", number: "3.2 s", icon: "350 kW" },
      { name: "Vanta Touring", category: "Touring", detail: "More distance. The same intent.", price: "560 km", number: "4.5 s", icon: "250 kW" },
    ],
    featureTitle: "The details make the difference.",
    featureText: "A continuous light signature. Surfaces that catch the light. A cabin reduced to what matters. This original fictional vehicle concept explores how an automotive brand can feel before the first drive.",
    featureList: ["Sculptural exterior", "Electric by design", "A driver-focused interior"],
    formTitle: "Make your mark.",
    formDescription: "Select a model and finish, then create a local configuration summary. No order, test drive or payment is created.",
    footer: "Fictional automotive brand and original generated vehicle. All ranges and specifications are illustrative. No vehicle sales or test drives are processed.",
    highlights: ["Cinematic automotive direction", "Interactive model and finish selector", "Live configuration summary"],
    subtitle: "Electric performance. Sculpted with purpose.",
    description: "A bespoke electric-automotive concept with a cinematic charcoal/lime identity, original generated vehicle imagery, interactive model comparison and finish selection. Specifications are fictional; configuration stays local and creates no order.",
  },
  aster: {
    name: "Aster Care",
    wordmark: "aster",
    industry: "Private Clinic & Wellness",
    accent: "#9fbdad",
    category: "HEALTHCARE / PRIVATE WELLNESS",
    kicker: "A LITTLE MORE HUMAN",
    headline: ["Care that makes", "space for you."],
    intro: "Clear conversations. A calmer setting. A thoughtful approach to the everyday experience of care.",
    action: "Explore care options",
    secondary: "Our approach",
    nav: ["Care options", "Our approach", "Plan a visit"],
    image: "/concepts/aster-hero.webp",
    imageAlt: "Generated concept of a calm private-clinic reception with curved ivory walls, sage seating and daylight",
    caption: "A DIFFERENT FEELING OF CARE",
    collectionTitle: "Start with what you need.",
    collectionIntro: "Explore example services and plan a sample visit. This fictional clinic does not provide medical advice or real appointments.",
    filters: ["All services", "Everyday care", "Wellbeing"],
    items: [
      { name: "Everyday health", category: "Everyday care", detail: "A first conversation about your care needs", price: "30-minute example", number: "01", icon: "heart" },
      { name: "Wellbeing planning", category: "Wellbeing", detail: "Space to discuss your everyday wellbeing goals", price: "45-minute example", number: "02", icon: "leaf" },
      { name: "Follow-up visit", category: "Everyday care", detail: "A sample check-in with your care team", price: "20-minute example", number: "03", icon: "plus" },
    ],
    featureTitle: "A considered space. A clearer conversation.",
    featureText: "Healthcare experiences deserve the same care as the conversations within them. Aster is a fictional design exploration of a calm, accessible service website, from understanding the options to planning a visit.",
    featureList: ["Clear service information", "Accessible, readable design", "A simple path to the next step"],
    formTitle: "Let's plan a sample visit.",
    formDescription: "Choose a service and preferred date. This is a demonstration: no appointment is reserved and no health or contact information is collected.",
    footer: "Fictional clinic design concept. No medical advice, clinical claims or real appointments. For urgent medical help, contact your local emergency service.",
    highlights: ["Calm healthcare identity", "Accessible care-option filters", "Private, no-data sample visit planner"],
    subtitle: "Thoughtful care begins with the experience.",
    description: "An original private-clinic concept with a sage/ivory palette, clear service navigation, category filters and a sample-visit planner that collects no personal or medical information. A fictional design only, with no medical advice or clinical claims.",
  },
  kovo: {
    name: "Kovo Studio",
    wordmark: "KOVO",
    industry: "Architecture & Interior Design",
    accent: "#c78e73",
    category: "ARCHITECTURE / SPATIAL DESIGN",
    kicker: "ARCHITECTURE · INTERIORS · OBJECTS",
    headline: ["Spaces,", "deeply considered."],
    intro: "We imagine a quieter relationship between people, materials and place. Architecture with room for life to happen.",
    action: "View selected spaces",
    secondary: "Meet the approach",
    nav: ["Selected work", "The studio", "Start a dialogue"],
    image: "/concepts/kovo-hero.webp",
    imageAlt: "Generated original concrete and timber residence with a circular window in a pine forest; a fictional architectural project",
    caption: "FOREST HOUSE / AN IMAGINED RESIDENCE",
    collectionTitle: "An ongoing conversation with space.",
    collectionIntro: "An imagined collection of residential and workplace projects. Every project shown here is a fictional design study.",
    filters: ["All spaces", "Residential", "Workplace"],
    items: [
      { name: "Forest House", category: "Residential", detail: "Concrete, timber and a quieter perspective", price: "Design study / 01", number: "01", icon: "home" },
      { name: "The Still Office", category: "Workplace", detail: "A place for focused work and shared ideas", price: "Design study / 02", number: "02", icon: "grid" },
      { name: "Courtyard No. 4", category: "Residential", detail: "An interior landscape built around light", price: "Design study / 03", number: "03", icon: "sun" },
    ],
    featureTitle: "Less noise. More meaning.",
    featureText: "Begin with the way a place should feel. Listen to the landscape. Let materials speak. Kovo is an original fictional studio identity exploring a thoughtful, editorial approach to architecture on the web.",
    featureList: ["Place before form", "Honest materials", "Life in the details"],
    formTitle: "Every space starts with a conversation.",
    formDescription: "Try the concept's project-type selector to create a local sample brief. No enquiry is sent and no contact details are collected.",
    footer: "Independent fictional architecture studio concept. Original generated building imagery and illustrated design studies; no real projects, awards or client commissions are claimed.",
    highlights: ["Architectural editorial layout", "Filtered illustrated design studies", "Interactive sample-brief builder"],
    subtitle: "Architecture with room for life to happen.",
    description: "An original architecture-studio concept with a warm mineral palette, large editorial typography, generated architectural imagery, illustrated project studies and interactive project filters. The sample brief builder stays local; no client projects or awards are claimed.",
  },
} as const;

export type ConceptSlug = keyof typeof concepts;
export const conceptUI = {
  back: "Back to Elvora",
  concept: "CONCEPT PROJECT",
  independent: "INDEPENDENT DESIGN EXPLORATION",
  menu: "Open menu",
  closeMenu: "Close menu",
  collection: "Explore the collection",
  select: "Explore",
  arrival: "Arrival",
  departure: "Departure",
  guests: "Guests",
  date: "Preferred date",
  service: "Care option",
  stay: "Your stay",
  projectType: "Project type",
  finish: "Exterior finish",
  finishes: ["Graphite", "Silver", "Forest"] as const,
  finishColors: ["#45494a", "#b8bdba", "#53675d"],
  configure: "Create sample configuration",
  planStay: "Plan sample stay",
  planVisit: "Plan sample visit",
  planBrief: "Create sample brief",
  chooseDate: "Choose a date",
  invalidStay: "Departure must be after arrival.",
  futureDate: "Choose today or a future date.",
  demo: "LOCAL DEMO / NOTHING HAS BEEN SUBMITTED",
  range: "Illustrative range",
  acceleration: "0–100 km/h",
  power: "Illustrative power",
  details: "Explore the details",
  location: "AN IMAGINED PLACE. A REAL DESIGN EXPLORATION.",
  footer: "A website concept by Elvora. All brands, places and services on this page are fictional.",
  filterLabel: "Filter the collection",
  modelLabel: "Select a model",
  collectionLabel: "01 / THE COLLECTION",
  featureLabel: "02 / A CONSIDERED APPROACH",
  plannerLabel: "03 / EXPLORE THE POSSIBILITIES",
  selected: "Selected",
  reset: "Start again",
  illustration: "Original illustrated design study",
  headerActions: { solenne: "Plan your stay", vanta: "Configure", aster: "Plan a visit", kovo: "Start a dialogue" },
  visitSummary: "Sample visit planned locally. No appointment has been reserved.",
  staySummary: "Sample stay planned locally. No booking or payment has been made.",
  carSummary: "Sample configuration created locally. No order or test drive has been requested.",
  briefSummary: "Sample project brief created locally. No enquiry has been sent.",
  guestsOptions: ["1 guest", "2 guests", "3 guests", "4 guests"],
} as const;
``````

## data/contact.ts

``````ts
export const contactContent = {
  eyebrow: "06 / START A CONVERSATION",
  title: "Let's talk.",
  description:
    "Have a project in mind? Tell me a little about it, and let's find a thoughtful way forward.",
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
    "Your contact details and project message are used to respond to your enquiry. See the Privacy Policy for storage and providers. Please avoid confidential information.",
  privacyLink: "Privacy Policy",
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
      "The contact form is not connected yet. Please email abdulhafeez@elvoraai.online directly.",
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

``````ts
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

``````ts
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
        title: "AI & Conversational Experiences",
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
``````

## data/privacy.ts

``````ts
export const consentContent = {
  version: 1,
  retentionDays: 180,
  key: "elvora-consent-v1",
  title: "A little choice. A better visit.",
  description:
    "Essential storage keeps your chosen theme and privacy choices working. Optional embedded chat connects to a third-party provider only when you allow it. No analytics or advertising trackers are installed by this portfolio.",
  accept: "Accept All",
  reject: "Reject All",
  manage: "Manage Preferences",
  save: "Save Preferences",
  settings: "Cookie Settings",
  close: "Close preferences",
  policy: "Cookie Policy",
  privacy: "Privacy Policy",
  dialogTitle: "Your privacy preferences",
  dialogDescription:
    "Optional features are off until you choose them. You can change your mind using Cookie Settings in the footer. Rejecting optional features leaves the rest of the portfolio available.",
  essential: "Essential storage",
  essentialNote:
    "Privacy choices, your explicitly selected theme, and security or sign-in functionality when used. Always active; no advertising or analytics.",
  external: "Third-party chat",
  externalNote:
    "Allow embedded services such as Botpress. Opening a chat then shares connection information with that provider, which may use its own cookies or local storage. AI API demos remain available without this permission.",
  withdrawal:
    "Withdrawing consent removes open chat embeds and stops future loading. It cannot erase information already sent to a provider or its stored data.",
  gateTitle: "Your choice before we connect.",
  gateNote:
    "This chat uses an external provider. Allow third-party chat to load it, or keep browsing without it.",
  allow: "Allow third-party chat",
  saved: "Privacy choices saved.",
  notSaved:
    "Preferences apply to this page, but this browser could not save them for your next visit.",
} as const;

export const legal = {
  updated: "17 October 2026",
  updatedLabel: "Last updated",
  back: "Back to Elvora",
  contact: "Questions about this policy?",
  pages: {
    privacy: {
      title: "Privacy Policy",
      intro:
        "This policy describes how Elvora, the portfolio of independent developer Abdul Hafeez, handles information when you browse, send an enquiry or use a demo.",
      sections: [
        {
          title: "Who to contact",
          text: "Abdul Hafeez operates this portfolio under the Elvora name. Contact abdulhafeez@elvoraai.online about your information, a request, or this policy.",
        },
        {
          title: "Browsing and essential storage",
          text: "The hosting provider processes connection details, such as IP address, request information and operational logs, to deliver and protect the site. Your selected theme and privacy preferences may be stored locally in your browser. Admin sign-in uses security cookies when used. This portfolio does not install analytics or advertising trackers.",
        },
        {
          title: "Contact enquiries",
          text: "If you submit the form, your name, email, optional company/service details and message are processed to respond to your enquiry and limit abuse. When inquiry storage is enabled, the message is saved in a private inbox. Email notifications are sent only when the mail service is configured and accepts them. Cloudflare Turnstile may process technical information for form security when configured. Do not send passwords, payment details, medical information or other sensitive content.",
        },
        {
          title: "AI demos, voice and embedded chat",
          text: "AI API demos send your question and limited conversation context to the configured AI provider to generate a reply. Provider processing and retention are governed by its terms. Portfolio chat logging is off by default; if enabled, the chat notice must disclose it. Optional external embeds such as Botpress load only after third-party chat permission and opening the chat. Microphone features require browser permission, and browser speech services may process audio externally. Avoid sharing private information. Demo answers can be inaccurate.",
        },
        {
          title: "Why information is processed",
          text: "Information is used to operate and secure the site, respond to requests, and provide features you choose to use. Where applicable, the basis is your request to take steps toward a service, legitimate interests in security and communication, or consent for optional embedded features. You may withdraw optional-feature consent at any time through Cookie Settings.",
        },
        {
          title: "Providers and international processing",
          text: "Hosting, email, anti-abuse and AI providers may process information in other countries under their applicable contracts and privacy terms. A GitHub or Instagram link takes you to that platform only when you choose to open it. Social feeds and tracking pixels are not embedded here. Information is not sold by Elvora.",
        },
        {
          title: "Retention and your choices",
          text: "Privacy choices expire after 180 days. Enquiries are kept only as needed to respond, manage a working relationship, or meet applicable record-keeping obligations, then reviewed for deletion. Provider retention may differ. Depending on your location, you may request access, correction, deletion, restriction or portability, object to processing, withdraw consent, or contact your local privacy regulator. Email Elvora to make a request; reasonable verification may be needed.",
        },
        {
          title: "Changes",
          text: "This policy will be updated when the actual services or processing change. The date above identifies this version. New optional purposes require a new consent choice before activation.",
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      intro:
        "Cookies and browser storage are used for specific features. Optional external chat is off by default, and you have equal options to accept, reject or manage it.",
      sections: [
        {
          title: "Essential features",
          text: "The local-storage key elvora-consent-v1 remembers your privacy choice and timestamp for up to 180 days. portfolio-theme remembers a theme you explicitly select. Necessary security, anti-abuse and admin sign-in features may use additional security storage when used. These are not used for advertising or audience analytics.",
        },
        {
          title: "Optional third-party chat",
          text: "Botpress and other configured embedded providers may use cookies or local storage once you permit third-party chat and open the feature. Their storage names and duration are provider-controlled and may change; consult their current policies. No embedded provider frame is created by the public chat component before this permission. AI API demos do not require embedded-chat consent.",
        },
        {
          title: "No analytics or advertising category",
          text: "This portfolio does not install analytics, advertising pixels or social-media tracking embeds. There is no inactive consent category pretending to control those technologies. If optional purposes are introduced later, this notice and the consent version must be updated before those features are loaded.",
        },
        {
          title: "Change or withdraw your choice",
          text: "Choose Cookie Settings in the footer to change preferences at any time. Reject All disables optional chat; Accept All allows it. Manage Preferences lets you keep it off or on separately from essential features. Withdrawing removes active provider frames but does not delete information already received or stored by the provider. Use your browser's site-data controls to clear stored browser data.",
        },
        {
          title: "Storage restrictions",
          text: "If your browser blocks storage, the choice applies to the current page but may be requested again on a later visit. Other browser tabs update when a saved preference changes. Expired or invalid choices are treated as no permission.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      intro:
        "These terms cover use of the Elvora portfolio and its demonstrations. A paid project needs its own agreed scope and terms.",
      sections: [
        {
          title: "Portfolio and concept work",
          text: "The sample websites and UI studies are independent concept projects with fictional brands, generated hero images and original interface work. Financial balances and analytics in UI studies are illustrative demo data. They do not represent client commissions, real reservations, vehicle sales or clinical services. Their sample planners and configurators create local demo summaries without submitting bookings or taking payment.",
        },
        {
          title: "Services and project agreements",
          text: "Website design, development, AI chatbot integration, scoped API automation and optimization are subject to requirements, feasibility and a separate written agreement. Scope, pricing, payment, timelines, support, ownership and any third-party costs must be agreed for each project. No search ranking, revenue or business outcome is guaranteed.",
        },
        {
          title: "AI limitations and acceptable use",
          text: "AI output may be incomplete or inaccurate and requires human judgment. The booking and support demos are examples, not professional advice or confirmed transactions. Do not submit sensitive data, abuse the services, bypass limits, attempt unauthorized access or use the site unlawfully. Voice features depend on device and browser support.",
        },
        {
          title: "Intellectual property and third-party services",
          text: "Elvora branding and original portfolio materials belong to their respective rights holders. Tool names, third-party brands and permitted client material remain their owners' property. Display does not imply endorsement or partnership. External links and providers have their own terms and availability.",
        },
        {
          title: "Availability and responsibility",
          text: "The site and demos are provided as available and may change, be limited or be interrupted. To the extent permitted by applicable law, Elvora does not guarantee uninterrupted or error-free demo operation. Nothing here excludes rights or liabilities that cannot lawfully be excluded. Any paid-project responsibility is set out in its own agreement, subject to law.",
        },
        {
          title: "Contact and updates",
          text: "Contact abdulhafeez@elvoraai.online with questions. These terms may be updated as the portfolio changes; the date above identifies the current version.",
        },
      ],
    },
  },
} as const;
``````

## data/project-presentation.ts

``````ts
type ProjectPresentation = {
  label: string;
  artwork: boolean;
  visitLabel: string;
  visualNote: string;
};

const featured: Record<string, ProjectPresentation> = {
  elvora: {
    label: "Featured Website",
    artwork: true,
    visitLabel: "Visit Elvora website",
    visualNote: "3D promotional artwork · Explore the website for its current design",
  },
};

export function projectPresentation(id: string): ProjectPresentation {
  return featured[id] || {
    label: "Concept Project",
    artwork: false,
    visitLabel: "Explore the concept site",
    visualNote: "Actual screenshots of an independent concept website",
  };
}
``````

## data/projects.ts

``````ts
import { concepts, type ConceptSlug } from "./concepts";
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
const views = [
  "Home page desktop",
  "Collection / inner page",
  "Mobile view",
  "Feature / design details",
];
export const projects: Project[] = (Object.keys(concepts) as ConceptSlug[]).map(
  (id) => {
    const concept = concepts[id];
    return {
      id,
      title: concept.name,
      subtitle: concept.subtitle,
      industry: concept.industry,
      description: concept.description,
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      accent: concept.accent,
      demoUrl: `/demo/${id}`,
      highlights: [...concept.highlights],
      promoPrompt: `A premium 3D promotional composition for the fictional ${concept.name} ${concept.industry} website: a laptop and phone showing the actual supplied page screenshots, dark studio, champagne rim lighting and refined materials. Concept project, no client-work claims.`,
      screenshots: views.map((title, index) => ({
        src: `/projects/${id}-${index + 1}.webp`,
        title,
        alt: `${concept.name}: actual browser capture of the ${title.toLowerCase()} from the fictional custom concept website`,
      })),
    };
  },
);
export function getFileProjects(): ProjectView[] {
  return projects.map((project) => {
    const { promoPrompt, ...view } = project;
    void promoPrompt;
    return view;
  });
}
``````

## data/prompts/booking.ts

``````ts
import "server-only";
export const bookingPrompt = `You are Meetly Booking, an appointment-booking SIMULATION for fictional Meetly Studio.
Offer only two sample services: a 30-minute website consultation or a 30-minute AI chatbot discovery call, both fictional and free in this demo.
Sample slots: Monday–Friday at 09:00, 11:00, or 14:00 in Asia/Karachi (UTC+5). These are example slots, never live availability.
Flow: ask which service; ask for a future weekday date and one sample time; optionally ask for a first name (never contact details); show a concise summary; ask the visitor to explicitly confirm before marking the simulation complete. If a date is ambiguous or invalid, ask for clarification. Use the server's current date context when interpreting tomorrow or next week. Do not state a slot is reserved while gathering details.
After explicit confirmation say 'Demo booking complete — no real appointment has been reserved' and repeat the sample service, date, time, and timezone. Never invent a booking reference, email confirmation, actual calendar event, availability check, or external side effect. You have no booking tools or database. State clearly that this is a simulation and redirect real appointment enquiries to the portfolio owner's contact section. Do not request email, phone, addresses, payment, or sensitive information. Keep each turn focused on the next question.`;
``````

## data/prompts/support.ts

``````ts
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

``````ts
import "server-only";
export const voicePrompt = `You are Aura Voice, a friendly portfolio demonstration assistant for Abdul Hafeez, an AI chatbot and web developer.
Explain custom-data chatbots, website integration, browser voice interaction, customer support use cases, and web development in plain English. Do not invent Abdul's work history, credentials, clients, prices, availability, guarantees, or completed projects. The portfolio's website projects are independent concepts.
Keep answers short and conversational, usually two to four sentences, suitable for text-to-speech. Avoid markdown tables and long code blocks. Ask at most one clarifying question. Do not claim to hear audio directly: the browser supplies an editable speech transcript, and your response is text that the browser may read aloud. You cannot browse, execute tasks, book appointments, or access private data. Redirect unrelated requests to the site's chatbot and web development topics.`;
``````

## data/site.ts

``````ts
export const site = {
  brand: "Elvora",
  logo: { src: "/elvora-logo.svg" },
  name: "Abdul Hafeez",
  role: "AI Chatbot & Web Developer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.elvoraai.online",
  email: "abdulhafeez@elvoraai.online",
  title: "Elvora — Thoughtful websites. Intelligent experiences.",
  description:
    "Elvora is Abdul Hafeez's portfolio for thoughtful websites, AI chatbot concepts, and voice experiences. Explore the work and start a conversation.",
  nav: [
    { label: "Services", href: "#services" },
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
      "Four original concepts. Four distinct worlds. Bespoke websites for hospitality, electric mobility, private care and architecture—built to explore, not just look at.",
    tabs: [
      { id: "web", title: "Web Development", detail: "04 bespoke concept websites" },
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
``````

## data/skills.ts

``````ts
export type Skill = { id: string; name: string; category: string };
export const skills: Skill[] = [
  { id: "claude", name: "Claude", category: "AI tools" },
  { id: "chatgpt", name: "ChatGPT", category: "AI tools" },
  { id: "gemini", name: "Gemini", category: "AI tools" },
  { id: "copilot", name: "GitHub Copilot", category: "AI tools" },
  { id: "botpress", name: "Botpress", category: "AI tools" },
  { id: "openai", name: "OpenAI API", category: "AI tools" },
  { id: "python", name: "Python basics", category: "Development tools" },
  { id: "github", name: "GitHub", category: "Development tools" },
  { id: "git", name: "Git", category: "Development tools" },
  { id: "html", name: "HTML", category: "Web interfaces" },
  { id: "css", name: "CSS", category: "Web interfaces" },
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
  title: "Skills & tools.",
  description:
    "The technologies and topics behind web, chatbot, and voice experiences.",
  note: "Always learning. Always refining. The right tool, chosen for the task.",
  categories: [
    "AI tools",
    "Prompt engineering",
    "Web interfaces",
    "APIs & data",
    "Voice AI",
    "Development tools",
  ],
} as const;
``````

## data/studies.ts

``````ts
export type Study = {
  id: string;
  name: string;
  industry: string;
  headline: string;
  description: string;
  eyebrow: string;
  action: string;
  accent: string;
  kind: "finance" | "analytics" | "travel" | "fitness" | "creative" | "beauty";
  labels: string[];
  details: string[];
  screenshot: string;
};
export const studies: Study[] = [
  {
    id: "noma",
    name: "noma",
    industry: "FINTECH / DASHBOARD",
    headline: "Your money.\nMore possibilities.",
    description: "A calm, considered space to see the bigger picture.",
    eyebrow: "A BETTER FINANCIAL PERSPECTIVE",
    action: "Explore the overview",
    accent: "#c4ef6a",
    kind: "finance",
    labels: ["Overview", "Accounts", "Activity", "Cards", "Insights"],
    details: [
      "Available balance",
      "$24,860.00",
      "Monthly overview",
      "Money in",
      "$8,420",
      "Money out",
      "$3,180",
      "Recent activity",
      "Studio subscription",
      "Design tools",
      "Coffee & co.",
      "Sample workspace",
    ],
    screenshot: "/studies/noma.webp",
  },
  {
    id: "orbit",
    name: "ORBIT",
    industry: "AI / ANALYTICS",
    headline: "Signals into\npossibilities.",
    description: "A new perspective on the patterns that matter.",
    eyebrow: "INTELLIGENCE, BEAUTIFULLY CONNECTED",
    action: "Explore the signals",
    accent: "#c5b3ff",
    kind: "analytics",
    labels: ["Workspace", "Overview", "Signals", "Connections", "Reports"],
    details: [
      "Signal activity",
      "84.6k",
      "Connected sources",
      "12",
      "Response time",
      "128ms",
      "Network health",
      "All systems connected",
      "Signal overview",
      "Sample data",
    ],
    screenshot: "/studies/orbit.webp",
  },
  {
    id: "elsewhere",
    name: "elsewhere.",
    industry: "TRAVEL / EDITORIAL",
    headline: "Less ordinary.\nMore elsewhere.",
    description: "For the places that stay with you long after you leave.",
    eyebrow: "A DIFFERENT KIND OF GETAWAY",
    action: "Find your next escape",
    accent: "#e3d1a2",
    kind: "travel",
    labels: ["Our places", "The journal", "Travel differently"],
    details: [
      "A slower kind of beautiful",
      "The coast collection",
      "A little closer to nature",
      "Thoughtfully curated places",
      "Stay curious",
      "Fictional travel editorial",
    ],
    screenshot: "/studies/elsewhere.webp",
  },
  {
    id: "form",
    name: "FORM /",
    industry: "FITNESS / LIFESTYLE",
    headline: "MOVE WITH\nINTENTION.",
    description: "Strength is a practice. Find your rhythm.",
    eyebrow: "TRAIN YOUR WAY",
    action: "Discover the practice",
    accent: "#f87643",
    kind: "fitness",
    labels: ["The method", "The practice", "Our approach"],
    details: [
      "01 / STRENGTH",
      "02 / MOBILITY",
      "03 / RECOVERY",
      "Built around your rhythm.",
      "A stronger everyday.",
      "Concept fitness studio",
    ],
    screenshot: "/studies/form.webp",
  },
  {
    id: "offscript",
    name: "offscript.",
    industry: "CREATIVE / DESIGN STUDIO",
    headline: "GOOD IDEAS\nDON'T PLAY SAFE.",
    description: "A little unusual. Entirely intentional.",
    eyebrow: "INDEPENDENT DESIGN EXPLORATION",
    action: "Meet the ideas",
    accent: "#e1523a",
    kind: "creative",
    labels: ["Selected ideas", "The studio", "Say hello"],
    details: [
      "01 / IDENTITY",
      "02 / DIGITAL",
      "03 / EDITORIAL",
      "MAKE SOMETHING",
      "WORTH NOTICING.",
      "Original interface experiment",
    ],
    screenshot: "/studies/offscript.webp",
  },
  {
    id: "aura",
    name: "aura",
    industry: "BEAUTY / E-COMMERCE",
    headline: "A little ritual.\nA softer everyday.",
    description: "Considered essentials for the moments that belong to you.",
    eyebrow: "BEAUTY IN THE EVERYDAY",
    action: "Explore the ritual",
    accent: "#bfaecf",
    kind: "beauty",
    labels: ["The collection", "Our philosophy", "The journal"],
    details: [
      "THE DAILY RITUAL",
      "aura",
      "daily essence",
      "FORM / FEEL / RITUAL",
      "Thoughtfully composed.",
      "Fictional product concept",
    ],
    screenshot: "/studies/aura.webp",
  },
];
export const studyContent = {
  label: "UI STUDY · CONCEPT EXPLORATION",
  note: "An original interface design study. All brands, balances, charts and products shown here are fictional demo content. This is a presentation, not a financial, analytics, booking, fitness or shopping service.",
  back: "Back to Elvora",
  details: "Design details",
  home: "Home",
  sidebarLabel: "Concept workspace",
  overview: "Overview",
  role: "Independent design study",
  metricNote: "ILLUSTRATIVE DATA",
  collection: "THE EXPLORATION",
  framework: "Original layout · Next.js · CSS · SVG",
  stats: ["M", "T", "W", "T", "F", "S", "S"],
  chartLabel: "Illustrative activity chart, not real performance data",
} as const;
``````

## data/studio.ts

``````ts
export const studio = {
  services: {
    eyebrow: "WHAT I CAN HELP YOU BUILD",
    title: "Websites + AI.\nBuilt with purpose.",
    intro:
      "Design, development and useful AI—connected around what your business actually needs.",
    action: "Let's discuss your project",
    more: "Let's talk",
    items: [
      {
        id: "web",
        title: "Website Design & Development",
        description:
          "I build modern, responsive websites that look professional on mobile and desktop, helping businesses showcase their services and connect with customers.",
        tags: [
          "Business websites",
          "Landing pages",
          "Portfolio websites",
          "E-commerce",
        ],
        detail: "From the first impression to the final interaction.",
      },
      {
        id: "chat",
        title: "AI Chatbot Development",
        description:
          "I create custom AI chatbots trained on your business information, services, and FAQs to answer customer questions and provide instant assistance on your website.",
        tags: ["Custom knowledge", "FAQ automation", "Website chatbots"],
        detail:
          "Custom AI Chatbots — Trained on your business data for customer support and FAQs.",
      },
      {
        id: "automation",
        title: "AI Automation & Integrations",
        description:
          "I connect AI tools to websites and business workflows through APIs and webhooks, helping reduce repetitive tasks with practical, clearly scoped automation.",
        tags: [
          "API connections",
          "Form-to-inbox flows",
          "Lead routing",
          "AI-assisted replies",
        ],
        detail:
          "The right connection, with validation and human review where it matters.",
      },
      {
        id: "seo",
        title: "SEO & Website Optimization",
        description:
          "I improve search engine basics, mobile responsiveness, accessibility, and website performance so your website is easier to discover and use.",
        tags: [
          "Metadata & structure",
          "Mobile experience",
          "Image optimization",
          "Performance",
        ],
        detail: "A stronger foundation. No guaranteed search rankings.",
      },
    ],
  },
  workflow: {
    eyebrow: "WORKFLOW",
    title: "How I Build\nAI-Powered Websites",
    intro:
      "From understanding your business to launching a website with intelligent AI assistance.",
    label: "A clear process. Room for better ideas.",
    steps: [
      {
        title: "Understand Your Needs",
        description:
          "I learn about your business, target audience, goals, and requirements. I identify what your website needs to achieve and how AI can improve your customers' experience.",
        note: "Listen before building",
        icon: "discover",
      },
      {
        title: "Plan & Design",
        description:
          "I plan the website structure, page layouts, visual style, and user journey. I also define how the AI chatbot will work, what business information it needs, and how visitors will interact with it.",
        note: "Give the idea a direction",
        icon: "design",
      },
      {
        title: "Develop & Integrate AI",
        description:
          "I build your responsive website and integrate a custom AI chatbot trained on your business information. Depending on your requirements, I can add voice interaction, customer FAQs, and lead capture.",
        note: "Make the pieces work together",
        icon: "build",
      },
      {
        title: "Test & Refine",
        description:
          "I test the website across different screen sizes and check its navigation, forms, chatbot responses, and AI functionality. I refine the design and fix issues to make everything work smoothly.",
        note: "Care lives in the details",
        icon: "test",
      },
      {
        title: "Launch & Optimize",
        description:
          "I deploy your website, connect your domain, and configure the required services. After launch, I can help monitor performance, improve the website, and update the chatbot as your business evolves.",
        note: "Launch is a beginning",
        icon: "launch",
      },
    ],
  },
  journey: {
    eyebrow: "MY JOURNEY",
    title: "From a Curious Kid\nto an Independent Developer",
    displayTitle: "MY\nJOURNEY.",
    intro:
      "My journey began with curiosity: exploring different fields, learning the basics of Python, and experimenting with AI tools to understand what technology could make possible. Over time, I found myself drawn to web development—the ability to turn an idea into something people can actually use.",
    note: "Still curious. Always building.",
    chapters: [
      {
        title: "Discovering Web Development",
        label: "CURIOSITY → CRAFT",
        phase: "Foundations",
        points: [
          "Explored Python and AI tools",
          "Learned through building and experimentation",
          "Found a direction in web development",
        ],
        description:
          "I started learning how websites are designed, developed, and brought to life. I experimented with different technologies, built projects, and gradually improved my skills through hands-on experience.",
      },
      {
        title: "Working With Agencies",
        label: "LEARNING THROUGH REAL WORK",
        phase: "Collaboration",
        points: [
          "Translated requirements into working interfaces",
          "Solved practical problems with agencies",
          "Learned to review and refine real projects",
        ],
        description:
          "As my skills developed, I began working with agencies, helping them build websites and bring digital projects to life. Working on real projects taught me how to understand client requirements, solve practical problems, and deliver work that serves a purpose.",
      },
      {
        title: "Becoming Independent",
        label: "FINDING MY OWN DIRECTION",
        phase: "Independence",
        points: [
          "Started taking on projects independently",
          "Built solutions around useful ideas",
          "Combined design decisions with technical understanding",
        ],
        description:
          "With experience and confidence, I began taking on projects independently. I wanted more freedom to explore my own ideas, work directly on solutions, and build products around the problems I cared about.",
      },
      {
        title: "Building My Own Startup",
        label: "THE NEXT CHAPTER",
        phase: "In progress",
        points: [
          "Working toward an independent startup",
          "Bringing web development and AI together",
          "Continuing to learn, build and improve",
        ],
        description:
          "Today, I'm working toward building my own independent startup, combining my interest in web development and AI to create useful digital products. What started as curiosity has grown into a journey of learning, building, and creating something of my own.",
      },
    ],
  },
  tools: {
    eyebrow: "HUMAN DIRECTION. INTELLIGENT TOOLS.",
    title: "CREATIVE\nTOOLKIT.",
    intro:
      "AI can accelerate an idea. Clear prompts, technical understanding, testing and thoughtful refinement turn it into useful work.",
    note: "Tools in the creative and development toolkit; selected to suit each project. Product names belong to their respective owners. No partnership or certification is implied.",
    items: [
      {
        name: "Claude",
        mark: "✳︎",
        purpose: "Reasoning & code review",
        color: "#d8a486",
      },
      {
        name: "ChatGPT",
        mark: "GPT",
        purpose: "Ideas, prompts & problem-solving",
        color: "#8cc9b1",
      },
      {
        name: "Gemini",
        mark: "✦",
        purpose: "Research & exploration",
        color: "#b5b3ff",
      },
      {
        name: "GitHub Copilot",
        mark: "GH",
        purpose: "Development assistance",
        color: "#c2c9d1",
      },
      {
        name: "Botpress",
        mark: "BP",
        purpose: "Custom chatbot experiences",
        color: "#aaa1ff",
      },
      {
        name: "OpenAI API",
        mark: "API",
        purpose: "AI inside the product",
        color: "#e4cc88",
      },
      {
        name: "Next.js",
        mark: "N",
        purpose: "Web application framework",
        color: "#f5f5f5",
      },
      {
        name: "GitHub",
        mark: "GH",
        purpose: "Code & version control",
        color: "#f5f5f5",
      },
    ],
  },
  bunch: {
    eyebrow: "A CLOSER LOOK AT THE CRAFT",
    title: "My bunch of work.",
    intro:
      "Websites, dashboards, editorial worlds and interface experiments. Different directions, brought together by an eye for the details.",
    note: "Original concept websites and UI studies with fictional brands and illustrative data. Actual browser captures—not a claim of additional client commissions.",
    explore: "Explore concept",
    websiteLabel: "WEBSITE CONCEPT",
    view: "View all selected work",
    views: [
      "First impression",
      "Made for the details",
      "A different perspective",
      "In your pocket",
    ],
  },
  love: {
    eyebrow: "WALL OF LOVE",
    title: "Wall of love.",
    intro: "A space for the people behind the projects.",
    previewLabel: "REVIEW LAYOUT PREVIEW",
    notice:
      "Genuine testimonials and approved portraits have not been supplied yet. These labeled entries preview the animation and are not client endorsements.",
    previous: "Previous review",
    next: "Next review",
    play: "Play review rotation",
    pause: "Pause review rotation",
    personPlaceholder: "Approved client portrait pending",
    quotePlaceholder:
      "[PLACEHOLDER] A genuine client review will appear here, shared with their permission.",
    rolePlaceholder: "[PLACEHOLDER] Client name & role",
  },
  ending: {
    eyebrow: "YOUR IDEA DESERVES A THOUGHTFUL HOME",
    title: "Let's make\nsomething matter.",
    description:
      "A website with character. AI with a purpose. An experience worth coming back to.",
    action: "Tell me what you have in mind",
    signature:
      "Thoughtful websites and useful AI experiences, designed around people and the businesses they build.",
    navigation: "/Quick links",
    navLinks: [
      { label: "Home", href: "#top" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "About Me", href: "#experience" },
      { label: "Workflow", href: "#workflow" },
      { label: "Contact", href: "#contact" },
    ],
    connect: "/Contact",
    legal: "The details",
    copyright: "All rights reserved.",
    credit: "Designed & developed by Abdul Hafeez · Elvora",
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  socials: [
    {
      name: "GitHub",
      href: "https://github.com/AbdulHafeezAIEngineer",
      icon: "github",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/elvoraaistudio",
      icon: "instagram",
    },
  ],
} as const;

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  portrait: string | null;
  placeholder: boolean;
};
// Publish only genuine, owner-approved reviews and portraits, with permission.
export const testimonials: Testimonial[] = ["01", "02", "03"].map((id) => ({
  id,
  quote: studio.love.quotePlaceholder,
  name: studio.love.rolePlaceholder,
  role: `Review preview ${id}`,
  portrait: null,
  placeholder: true,
}));
``````

## data/tool-marks.ts

``````ts
export const toolMarks: Record<
  string,
  { icon?: string; text?: string; color: string }
> = {
  Claude: { icon: "claude", color: "#d9a381" },
  ChatGPT: { icon: "openai", color: "#83bea5" },
  Gemini: { icon: "googlegemini", color: "#a9a5fa" },
  "GitHub Copilot": { icon: "githubcopilot", color: "#b6b8dd" },
  Botpress: { text: "bp", color: "#ab9bf0" },
  "OpenAI API": { icon: "openai", color: "#d9be7b" },
  "Python basics": { icon: "python", color: "#7eb9dc" },
  GitHub: { icon: "github", color: "currentColor" },
  Git: { icon: "git", color: "#ef8067" },
  HTML: { icon: "html5", color: "#e88560" },
  CSS: { icon: "css", color: "#a5a5ff" },
  "Next.js": { icon: "nextdotjs", color: "currentColor" },
  React: { icon: "react", color: "#69c7dc" },
  TypeScript: { icon: "typescript", color: "#73abe0" },
  "Tailwind CSS": { icon: "tailwindcss", color: "#6cc5d4" },
};
``````
