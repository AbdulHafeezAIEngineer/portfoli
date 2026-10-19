import type { Bot } from "./bots";

export const businessAssistantIds = ["veldt", "northline", "solenne"] as const;
export type BusinessAssistantId = (typeof businessAssistantIds)[number];

export function isBusinessAssistant(id: string): id is BusinessAssistantId {
  return businessAssistantIds.some((candidate) => candidate === id);
}

export const businessAssistants: Bot[] = [
  {
    id: "veldt",
    name: "Veldt Support",
    description:
      "A store assistant that explains products, delivery and returns using Veldt's own information. Try a real AI conversation with sample business data.",
    tags: ["Online stores", "Product questions", "Customer support"],
    method: "api",
    kind: "demo",
    configured: true,
    welcome:
      "Hi, I'm Veldt's demo assistant. Looking for a bag, checking delivery, or have a returns question? I can help you explore our sample store.",
    starters: [
      "Which bag fits a 15-inch laptop?",
      "Is shipping free on a $70 order?",
      "What if my item arrives damaged?",
    ],
    note: "Demo · Fictional store and sample policies. No live orders or purchases.",
  },
  {
    id: "northline",
    name: "Northline Assistant",
    description:
      "A service-business assistant that explains packages and helps turn a visitor's idea into a clear project brief, one question at a time.",
    tags: ["Service businesses", "Project enquiries", "Lead qualification"],
    method: "api",
    kind: "demo",
    configured: true,
    welcome:
      "Hi, I'm Northline's demo assistant. Tell me what you're looking to build, and I'll help you explore the options. Please use fictional project details in this demo.",
    starters: [
      "I need a website for my business.",
      "What does a five-page website include?",
      "Can you add a chatbot to my website?",
    ],
    note: "Demo · Fictional studio and sample prices, not Elvora quotes. No enquiries are submitted.",
  },
  {
    id: "solenne",
    name: "Solenne Concierge",
    description:
      "A hospitality assistant that compares stays, explains hotel policies and helps guests prepare an enquiry using the retreat's own knowledge.",
    tags: ["Hotels & hospitality", "Room guidance", "Guest questions"],
    method: "api",
    kind: "demo",
    configured: true,
    welcome:
      "Welcome to Solenne's demo concierge. Planning a quiet escape? Ask about our sample stays, amenities or check-in. I can guide you, but I can't reserve a room.",
    starters: [
      "Which stay works for four guests?",
      "Does the Terrace Suite have a sea view?",
      "Can I check in before 3 pm?",
    ],
    note: "Demo · Fictional retreat and sample rates. No live availability or reservations.",
  },
];
