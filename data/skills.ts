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
