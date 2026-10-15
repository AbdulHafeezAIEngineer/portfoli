import { skillContent as copy, type Skill } from "@/data/skills";
import { Reveal } from "./reveal";

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section
      id="skills"
      className="container skills-section"
      aria-labelledby="skills-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="section-heading">
          <h2 id="skills-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
      </Reveal>
      <div className="skills-grid">
        {copy.categories.map((category, index) => (
          <Reveal key={category} delay={index * 0.04}>
            <article className="skill-group glass">
              <span className="skill-number">0{index + 1}</span>
              <h3>{category}</h3>
              <ul>
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
                      {skill.name}
                    </li>
                  ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="skills-note">{copy.note}</p>
    </section>
  );
}
