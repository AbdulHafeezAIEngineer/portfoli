import { businessAssistants } from "./business-assistants";
export type EmbedMethod = "iframe" | "script" | "api";
export type DemoBotId = "support" | "booking" | "voice";
export type BotId = string;
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatSetup = "ready" | "key" | "quota" | "paused" | "provider";
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
  aiReady?: boolean;
  aiSetup?: ChatSetup;
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
    ...businessAssistants,
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
  eyebrow: "02 / AI AGENTS",
  title: "Better conversations. Built right in.",
  description:
    "Try three business assistants with their own knowledge, plus a voice demo. See how a custom AI agent could help your customers.",
  try: "Try Live Demo",
  previewDemo: "Preview assistant",
  knowledge: "View demo knowledge",
  setupNotice: "This assistant’s knowledge and chat are ready. Live AI replies are waiting for the website owner to connect the AI service.",
  setupNotices: {
    key: "Live replies aren't connected yet. You can write a question and try sending it; your draft stays here if the service is unavailable.",
    quota: "Live replies are waiting for the site's usage limits to be connected. You can still write your question and retry after setup.",
    paused: "Live replies are paused. You can write a question here and retry later.",
    provider: "The chat service needs a configuration update. You can write a question here and retry later.",
  },
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
    "Demos have usage limits. Orders, enquiries and reservations are demonstrations only. External embeds follow their provider's policies.",
  embedTitle: "How I Embed Agents",
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
      "My real chatbot will appear here once its connection is ready. In the meantime, try Veldt Support, Northline Assistant, Solenne Concierge, or Aura Voice.",
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
    code: 'const response = await fetch("/api/chat", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    botId: "veldt",\n    messages: [{ role: "user", content: "Hello" }],\n  }),\n});\nconst { reply } = await response.json();\n// Provider API keys stay on the server.',
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
