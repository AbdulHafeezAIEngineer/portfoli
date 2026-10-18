# Website positioning, About copy and floating Testimonials

The site presents website design and development as the main service. Websites replaces AI Websites in public navigation and copy. Its canonical route is `/websites`; `/ai-websites` permanently redirects there. Website projects, How I Build Websites and Technical Domains appear together in that order. `/technical-domains` redirects to `/websites#fundamentals`, and `/how-i-build` redirects to `/websites#workflow`.

About tabs are About Me → My Journey → Skills & Tools → Certificates. AI Bots retains its name, demos, building process and embedding instructions. The full footer, original device artwork, custom demo designs, curved photo collection, video sources/playback, cookie choices and Botpress permissions remain intact.

## Copy and tools

The homepage, metadata, services introduction, journey, footer and About copy lead with design, code and engineering. React, Next.js, TypeScript, Tailwind CSS, Git, GitHub, Prisma and PostgreSQL lead the tools marquee. Skills categories begin with Web interfaces, APIs & data and Development tools. Display labels describe AI as assistance; internal category identifiers are preserved for existing CMS records.

The revised About text includes:

> AI is a powerful tool, but having access to it is only the beginning. Using it well takes experience, clear instructions and the judgment to question, test and improve what it produces. A convincing first draft still needs someone who understands how a website actually works.

> I bring an understanding of the frontend, backend, databases and deployment, together with practical coding foundations. That knowledge helps me guide the tools, connect the pieces and refine the details. Combined with my own creativity and careful testing, it lets me turn your idea into a polished, useful website. AI supports selected tasks; the direction, decisions and final review stay with me.

CMS-managed identity/service overrides are not rewritten. No stored credentials, CMS records or authentication settings were modified.

## Testimonial presentation

The dedicated page uses a large featured card, smaller companion cards, original local illustrated profiles and a subtle particle background. Cards float and rotate gently using CSS transforms on phones and desktops. Motion runs only while the section is near the viewport and the document is visible. Desktop hovering pauses the card group for reading; touch screens keep their animation. Local Pause/Resume and global Motion Off stop the effects. No JavaScript leaves all text visible and the effects static. Motion On remains the owner's explicit default, including an override of the OS preference; saved Off persists.

File mode has no genuine supplied client reviews. Four fictional profiles and illustrative reviews are labeled both above the grid and on each card. They are design examples, not endorsements or real customer photos. Published, permission-approved CMS testimonials replace all samples; the existing publication/permission filter is unchanged. No reference names or reviews were copied, and portraits make no third-party requests.

## Validation

- `npm run build`: passed, including production preparation, lint, TypeScript and route generation in the local file-content configuration.
- `npm run test:pages:browser`: all ten subject routes at 390/1440px; route navigation, canonicals, sitemap, inline domain/process placement, About order, tools order, new About copy, aliases, mobile 3D, saved Off and no-JavaScript content passed.
- `npm run test:testimonials:browser`: actual card/particle transforms at 1440/390px, mobile OS-reduced preference with site On, local portraits/labels, pause/resume, desktop hover pause, global Off, offscreen pause, static no-JavaScript content, no overflow or external requests passed.
- `npm run test:reviews:browser`: approved records replace samples; three/two/one-column layouts passed.
- `npm run test:motion:browser`: both themes at 360, 390, 768, 1024, 1440 and 1920px, native touch, consent and form validation passed.
- `npm run test:video-motion:browser`: desktop/touch logo flip/shine, reading emphasis and no-JavaScript text passed.
- `npm run test:showcase:browser`: both actual looping videos on desktop/phone, no controls, muted/inline playback, global Off/On and offscreen pause passed.
- `npm run test:windows:browser`: four interactive concepts, responsive frames, navigation, nested scrolling, maximize/Escape/back and sample form/reset behavior passed.
- [Twenty WCAG A/AA scans](websites-testimonials-accessibility.json): home, websites, Skills, About and Testimonials in both themes at 390/1440px; no violations.
- [Scroll readiness observations](websites-testimonials-readiness.json): home, websites and curved collection, desktop/mobile. Page images are ready before scrolling and no image/component-script requests start during the measured scroll. Headless frame timings do not establish physical-device performance.

The local checks do not verify live Vercel deployment, owner login or provider delivery. A Git push can trigger the repository's configured hosting integration; this environment cannot confirm that external deployment result.

## Files

- Routes: `app/websites/page.tsx`, `app/ai-websites/page.tsx`, `app/technical-domains/page.tsx`, `app/how-i-build/page.tsx`, `app/work/[slug]/page.tsx`.
- Data/copy: `data/site.ts`, `data/navigation.ts`, `data/experience.ts`, `data/skills.ts`, `data/studio.ts`, `data/tool-marks.ts`, new `data/testimonial-samples.ts`.
- UI: `components/hero.tsx`, `components/hero-emblem.tsx`, `components/home-directory.tsx`, `components/experience.tsx`, `components/skills.tsx`, `components/page-tabs.tsx`, `components/testimonials.tsx`, new `components/testimonial-scene.tsx`, `app/pages.css`.
- Back links: `components/concept-site.tsx`, `components/demo-site.tsx`, `components/demo-window.tsx`, `components/work-bunch.tsx`.
- Portraits: four original `public/avatars/demo-*.svg` illustrations.
- Verification: `package.json`, new `tests/testimonials-floating.browser.mjs`; updated page, motion, review, showcase, window, finishing and readiness browser checks; reports and screenshots linked here. README, verification notes, page map and source delivery snapshots are refreshed.

## Previews

- [Testimonials desktop](testimonials-floating-1440.png) · [phone](testimonials-floating-390.png)
- [Homepage desktop](web-positioning-home-1440.png) · [phone](web-positioning-home-390.png)
- [About desktop](web-positioning-about-1440.png) · [phone](web-positioning-about-390.png)
- [Tools desktop](web-positioning-skills-1440.png) · [phone](web-positioning-skills-390.png)
- [Websites desktop](web-positioning-websites-1440.png) · [phone](web-positioning-websites-390.png)
