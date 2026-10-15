export type EmbedMethod = "iframe" | "script" | "api";
export type DemoBotId = "support" | "booking" | "voice";
export type BotId = "real" | DemoBotId;
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type RealBotConfig =
  | { method: "iframe"; url: string }
  | { method: "script"; src: string; mountId: string; attributes: Record<string, string>; integrity?: string }
  | { method: "api"; endpoint: string; requestField: "messages" | "message"; responsePath: string; authHeader: "Authorization" | "x-api-key"; authPrefix: string };

// Edit this ONE object when your real embed details are available. Never put keys here.
// iframe: { method: "iframe", url: "https://your-provider.com/embed/your-bot" }
// script: { method: "script", src: "https://your-provider.com/widget.js", mountId: "bot-root", attributes: { "data-bot-id": "your-public-bot-id" } }
// api: { method: "api", endpoint: "https://your-provider.com/chat", requestField: "messages", responsePath: "reply", authHeader: "Authorization", authPrefix: "Bearer " }
export const realBotConfig: RealBotConfig = { method: "iframe", url: "" };

export type Bot = {
  id: BotId; name: string; description: string; tags: string[]; method: EmbedMethod;
  kind: "real" | "demo"; configured: boolean; welcome: string; starters: string[]; note: string;
};
export const chatPolicy = { maxInput: 1000, maxMessages: 11, maxContext: 6000, maxReply: 4000 } as const;

export function getBots(): Bot[] {
  const configured = realBotConfig.method === "iframe" ? Boolean(realBotConfig.url) : realBotConfig.method === "script" ? Boolean(realBotConfig.src) : Boolean(realBotConfig.endpoint);
  return [
    { id: "real", name: "Abdul's AI Assistant", description: "My real chatbot, ready to connect through a hosted iframe, an isolated script widget, or your own API.", tags: ["Custom knowledge", "Website integration", "Real bot"], method: realBotConfig.method, kind: "real", configured, welcome: "", starters: [], note: "The provider manages this bot's conversation and data handling." },
    { id: "support", name: "Cedar Support", description: "A helpful first point of contact for Cedar & Co., a fictional homewares company. Ask about delivery, returns, or products.", tags: ["Customer support", "Company knowledge", "AI demo"], method: "api", kind: "demo", configured: true, welcome: "Hi, I'm Cedar's demo support assistant. Ask me about our fictional homewares store, shipping, or returns. Please don't share personal or order details.", starters: ["What is your return policy?", "How long does delivery take?", "How do I care for ceramics?"], note: "Fictional company. No real orders, account access, or human handoff." },
    { id: "booking", name: "Meetly Booking", description: "Explore a friendly appointment flow: choose a sample service, discuss a time, and review a simulated booking summary.", tags: ["Appointment flow", "Sample availability", "AI demo"], method: "api", kind: "demo", configured: true, welcome: "Let's try a demo appointment for Meetly Studio. Would you like a 30-minute website consultation or an AI chatbot discovery call? This is a simulation and won't reserve a real appointment.", starters: ["I'd like a website consultation.", "What sample times can I choose?", "How does the demo booking work?"], note: "Simulation only. No calendar integration, real reservation, or confirmation email." },
    { id: "voice", name: "Aura Voice", description: "Speak a question, review the transcript, and hear the AI reply. Voice input and playback use your browser's Web Speech API.", tags: ["Speech to text", "Text to speech", "AI demo"], method: "api", kind: "demo", configured: true, welcome: "Hi, I'm Aura. Type a question or use the microphone, review your transcript, then press Send. I can explain website and chatbot ideas in plain English.", starters: ["How could a chatbot help my business?", "What can a voice assistant do?", "Explain website chatbot integration."], note: "Voice availability varies by browser. Text chat always remains available." },
  ];
}

export const botContent = {
  eyebrow: "02 / AI CHATBOT SERVICES", title: "Better conversations. Built right in.",
  description: "Try three focused AI demos, and explore how a custom assistant can become part of your own website.",
  try: "Try Live Demo", real: "REAL BOT", demo: "INTERACTIVE DEMO", pending: "Connection pending",
  methods: { iframe: "Iframe embed", script: "Script widget", api: "Custom UI · API" },
  privacy: "Demo messages are sent to the AI provider. Avoid confidential information. Chat history stays in this page's memory and resets on reload.",
  budget: "Demos have usage limits. Appointment bookings are simulated. External embeds follow their provider's policies.",
  embedTitle: "How I Embed Bots",
  embedDescription: "Three ways to meet your visitors where they already are. The right approach depends on the control and integration your business needs.",
  pros: "Works well for", cons: "Trade-offs", usedBy: "USED HERE BY", example: "Illustrative integration code",
  integrationEyebrow: "INTEGRATION / THREE APPROACHES", unusedMethod: "No bot currently uses this method.",
  chat: {
    close: "Close chat", clear: "Clear conversation", send: "Send message", input: "Your message", placeholder: "Ask a question…",
    thinking: "Thinking", you: "You", transcript: "Conversation",
    emptyRealTitle: "This connection is being prepared.",
    emptyReal: "My real chatbot will appear here once its connection is ready. In the meantime, try Cedar Support, Meetly Booking, or Aura Voice.",
    embedLoading: "Loading the bot provider…",
    embedNote: "The embedded provider controls its chat interface and message history. If it cannot load here, its embedding permissions may need updating.",
    embedTitle: "Live chatbot", error: "The reply could not be loaded. Your message is ready to retry.",
    invalidReply: "The service returned an unreadable reply. Please try again later.",
    limit: "characters", shortened: "This reply reached its length limit. Ask a follow-up for more detail.",
    voice: {
      start: "Start voice input", stop: "Stop voice input", listening: "Listening… speak, then review the transcript before sending.",
      speaking: "Reading the reply aloud", playback: "Read replies aloud", stopPlayback: "Stop reading", replay: "Read last reply",
      unsupported: "Voice input isn't available in this browser. You can still type; try a browser that supports speech recognition over HTTPS.",
      noPlayback: "Spoken replies aren't supported here. Replies are still displayed as text.",
      privacy: "Your browser may send audio to its speech service. Microphone input is added as editable text and is never sent automatically.",
      denied: "Microphone access was denied. Allow microphone access in your browser settings, or type instead.",
      noSpeech: "No speech was detected. Please try again or type your message.",
      failed: "Voice input stopped. Check your microphone or type your message instead.",
      playbackError: "The reply could not be read aloud. You can read it in the conversation.",
    },
  },
} as const;

export const embedMethods: { id: EmbedMethod; title: string; description: string; code: string; pros: string[]; cons: string[] }[] = [
  { id: "iframe", title: "Hosted iframe", description: "Place the provider's hosted chat page inside a contained area of your website.", code: '<iframe\n  src="https://your-provider.com/embed/your-bot"\n  title="Customer support assistant"\n  sandbox="allow-scripts allow-forms allow-same-origin"\n  referrerpolicy="no-referrer"\n  loading="lazy"\n></iframe>', pros: ["Quick integration with an existing hosted bot", "Provider maintains the chat interface"], cons: ["Limited styling and control over the conversation", "Provider must allow framing; its privacy policy applies"] },
  { id: "script", title: "Script widget", description: "Load a provider's widget script into a dedicated, isolated embed document.", code: '<div id="bot-root"></div>\n<script\n  src="https://your-provider.com/widget.js"\n  data-bot-id="your-public-bot-id"\n  defer\n></script>', pros: ["Uses the provider's own chat features", "Public data attributes can select your bot"], cons: ["Runs third-party code; use a trusted provider", "Some widgets need storage or permissions unavailable in a sandbox"] },
  { id: "api", title: "Custom chat UI via API", description: "Design the full conversation experience while your Next.js API route calls the AI provider securely.", code: 'const response = await fetch("/api/chat", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    botId: "support",\n    messages: [{ role: "user", content: "Hello" }],\n  }),\n});\nconst { reply } = await response.json();\n// Provider API keys stay on the server.', pros: ["Complete control over design, voice, and accessibility", "Server-side prompts, limits, and secret handling"], cons: ["Requires maintaining the UI and server route", "API usage costs and abuse controls need management"] },
];
