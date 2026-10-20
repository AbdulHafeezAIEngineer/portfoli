import type { Testimonial } from "./agency";

/** Fictional design examples. Their labels must remain visible; these are not endorsements. */
export const testimonialSamples: Testimonial[] = [
  {
    id: "sample-design",
    name: "Nora Vale",
    role: "Website design · fictional profile",
    quote:
      "The mobile layout was the bit I cared about most. The pages were easy to get around, and the contact button was right where I expected it.",
    portrait: "/avatars/demo-nora.svg",
    placeholder: true,
  },
  {
    id: "sample-build",
    name: "Ethan Reed",
    role: "Development · fictional profile",
    quote:
      "I liked being able to try the site as it was being built. It made giving feedback much easier than looking at screenshots.",
    portrait: "/avatars/demo-ethan.svg",
    placeholder: true,
  },
  {
    id: "sample-integration",
    name: "Maya Lane",
    role: "Website integration · fictional profile",
    quote:
      "The service pages explain things clearly. I could find the information I needed without opening lots of different pages.",
    portrait: "/avatars/demo-maya.svg",
    placeholder: true,
  },
  {
    id: "sample-process",
    name: "Omar Vale",
    role: "Collaboration · fictional profile",
    quote:
      "The little details made a difference, especially the menu and how the site worked on my phone. The design felt consistent from page to page.",
    portrait: "/avatars/demo-omar.svg",
    placeholder: true,
  },
];
