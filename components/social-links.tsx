import { ArrowUpRight, Github, Instagram } from "lucide-react";
import { studio } from "@/data/studio";
export function SocialLinks({ iconsOnly = false }: { iconsOnly?: boolean }) {
  return (
    <ul className={`social-links${iconsOnly ? " social-icons" : ""}`}>
      {studio.socials.map((social) => {
        const Icon = social.icon === "github" ? Github : Instagram;
        return (
          <li key={social.name}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                iconsOnly ? `${social.name} (opens in a new tab)` : undefined
              }
            >
              <Icon size={18} aria-hidden="true" />
              {!iconsOnly && (
                <>
                  {social.name}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
