import { ArrowUpRight, Github, Instagram } from "lucide-react";
import { studio } from "@/data/studio";
export function SocialLinks() {
  return (
    <ul className="social-links">
      {studio.socials.map((social) => {
        const Icon = social.icon === "github" ? Github : Instagram;
        return (
          <li key={social.name}>
            <a href={social.href} target="_blank" rel="noopener noreferrer">
              <Icon size={18} aria-hidden="true" />
              {social.name}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
