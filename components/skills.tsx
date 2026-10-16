import { skillContent as copy, type Skill } from "@/data/skills";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { ToolMark } from "./tool-mark";
import {
  Braces,
  CheckCheck,
  Database,
  GitBranch,
  Mic,
  Waypoints,
} from "lucide-react";

const categoryIcons = [Waypoints, CheckCheck, Braces, Database, Mic, GitBranch];

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section
      id="skills"
      className="container skills-section toolkit-section"
      aria-labelledby="skills-title"
    >
      <div className="toolkit-heading">
        <div>
          <Reveal>
            <p className="eyebrow">{copy.eyebrow}</p>
          </Reveal>
          <TextReveal id="skills-title" text={copy.title} />
        </div>
        <Reveal>
          <p>{copy.description}</p>
        </Reveal>
      </div>
      <div className="toolkit-rows">
        {copy.categories.map((category, index) => {
          const Icon = categoryIcons[index];
          return (
            <Reveal key={category}>
              <div className="toolkit-row">
                <h3>
                  <span className="toolkit-index">0{index + 1}</span>
                  {category}
                </h3>
                <ul aria-label={category}>
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <li
                        key={skill.id}
                        className={
                          skill.name.includes("[PLACEHOLDER]")
                            ? "skill-placeholder"
                            : ""
                        }
                      >
                        {category === "AI tools" ||
                        category === "Web interfaces" ||
                        category === "Development tools" ? (
                          <ToolMark name={skill.name} />
                        ) : (
                          <span
                            className="toolkit-topic-icon"
                            aria-hidden="true"
                          >
                            <Icon size={23} strokeWidth={1.3} />
                          </span>
                        )}
                        {skill.name}
                      </li>
                    ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="skills-note">{copy.note}</p>
    </section>
  );
}
