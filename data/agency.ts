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
