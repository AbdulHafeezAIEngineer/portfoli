export type Skill = { id: string; name: string; category: string };
export const skills: Skill[] = [
  { id: "python", name: "Python basics", category: "Development tools" },
  { id: "github", name: "GitHub", category: "Development tools" },
  { id: "git", name: "Git", category: "Development tools" },
  { id: "html", name: "HTML", category: "Web interfaces" },
  { id: "css", name: "CSS", category: "Web interfaces" },
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
    "The primary stack is React, Next.js, TypeScript, Tailwind CSS, Git and structured application data. Browser speech features support voice input and playback.",
  note: "Always learning. Always refining. The right tool, chosen for the task.",
  categoryLabels: {
    "Voice AI": "Voice & accessibility",
  },
  categories: [
    "Web interfaces",
    "APIs & data",
    "Development tools",
    "Voice AI",
  ],
} as const;
