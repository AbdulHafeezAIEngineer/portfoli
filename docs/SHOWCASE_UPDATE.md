# Curved work showcase and website workflow

The supplied second image guides the new presentation: a curved, densely arranged wall of previews with a gentle tilt, soft edge fades and staggered vertical movement. This uses the existing original website and UI-study screenshots. It adds no outside artwork, fictitious clients or new project-count claims.

The wall is CSS 3D, with nine columns and 54 visual tiles reusing the original browser views. Decorative repetition is excluded from screen-reader and keyboard navigation. A clearly labeled index below provides each of the ten unique project/study links once. The heading and exploration link sit above the wall, following the reference composition. Both dark and warm off-white themes inherit their actual background, text and accent tokens.

Motion pauses outside the viewport and while the wall is hovered. The shared Motion Auto/On/Off preference remains functional on desktop and mobile; reduced motion stops the vertical drift while preserving the curved composition. Image sizes are bounded and loading remains lazy. The component uses the existing shared scroll subscriber, removing its separate Framer useScroll subscription. Home first-load JavaScript measured by the build is 169 kB, versus 171 kB in the previous build.

The workflow heading is now **How I Build Websites.** Its five steps have a new editorial layout: a sticky introduction and numbered rows on desktop, with a single readable column on smaller screens. Build & Connect explains using custom-trained AI assistants for selected project tasks, grounded in approved information and with human review. AI is optional to the website process and no longer part of the heading.

Only two reference images were attached to this request; no fourth image was available. The existing light/dark palette is retained while the presentation changes.

Validation: production build, lint and type checking passed. Local production browser checks at 360,390,768,1024,1440,1920px in both themes verified the 3D wall, ten accessible destinations, motion On/Off, five workflow steps, the requested copy and no horizontal overflow. There were no runtime/hydration errors. Scoped axe WCAG A/AA scans passed for the sampled 1440px dark/light and 390px light sections. Actual screenshots are `showcase-*.png` and `workflow-*.png` in this folder. The previous Lighthouse report is retained as historical evidence; it was not rerun for this visual-only follow-up.

Implementation: `components/work-bunch.tsx`, `app/showcase.css`, `components/studio-sections.tsx`, `data/studio.ts`, and the stylesheet import in `app/layout.tsx`.
