import {
  BookOpen,
  CheckCheck,
  Code2,
  MessagesSquare,
  Search,
} from "lucide-react";
import { Reveal } from "./reveal";
import { ReadingText } from "./reading-text";
import { TextReveal } from "./text-reveal";

const steps = [
  {
    title: "Understand the job",
    description:
      "Start with the questions your visitors ask, the actions the assistant should support, and where a person needs to take over.",
    note: "A clear purpose comes first",
    icon: Search,
  },
  {
    title: "Prepare the knowledge",
    description:
      "Organize your approved FAQs, services and business information. Give the assistant clear context and keep private information outside its knowledge base.",
    note: "Your information, carefully grounded",
    icon: BookOpen,
  },
  {
    title: "Build the conversation",
    description:
      "Shape the tone, instructions and conversation flow. Connect useful actions when needed, and give uncertain answers a clear fallback.",
    note: "Useful answers, with boundaries",
    icon: MessagesSquare,
  },
  {
    title: "Connect it to your website",
    description:
      "Choose a hosted embed, a floating widget or a custom chat interface. Connect the provider securely and make the experience work on mobile and desktop.",
    note: "The integration methods are below",
    icon: Code2,
  },
  {
    title: "Test, launch and improve",
    description:
      "Review real questions, incorrect answers and failure cases. Check consent, usage limits and handover before launch, then refine the assistant as your business changes.",
    note: "Review continues after launch",
    icon: CheckCheck,
  },
];

export function BotBuildProcess() {
  return (
    <section
      id="bot-build"
      className="container studio-section reference-workflow bot-build-process"
      aria-labelledby="bot-build-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">FROM YOUR KNOWLEDGE TO A USEFUL ASSISTANT</p>
        </Reveal>
        <TextReveal id="bot-build-title" text="From your documents to a tested answer." />
        <Reveal>
          <ReadingText text="For Veldt, I supplied the product guide and delivery policy, kept them separate from the other demos and tested questions against those sources. A client bot starts with your approved documents." />
        </Reveal>
      </div>
      <div className="workflow-cards">
        {steps.map(({ title, description, note, icon: Icon }, index) => (
          <Reveal key={title} delay={index * 0.04}>
            <article className="workflow-step">
              <span className="workflow-number">{index + 1}</span>
              <Icon
                size={18}
                className="workflow-card-icon"
                aria-hidden="true"
              />
              <h3>{title}</h3>
              <p>{description}</p>
              <small>{note}</small>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
