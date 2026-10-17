# Elvora — uploaded design and performance brief

The current frontend keeps the warm off-white brand, dark theme, content, links, forms, consent controls, CMS and AI features. It also retains the newer screenshot-specific curved work wall and **How I Build Websites.** workflow, including the requested explanation of custom-trained assistants for selected tasks with human review. No client results or testimonials were invented.

## Audit and before/after

| Finding | Result |
| --- | --- |
| Active screenshot originals reached 2880px and totalled 3.20 MB | 22 WebP sources now total 1.37 MB, 57% smaller, with a 1600px source ceiling; responsive Next Image variants remain capped at 1920px |
| Project/study/certificate loading lacked local blur previews | 23 generated tiny WebP placeholders cover existing local assets; unknown CMS images safely retain normal loading |
| Modal images could compete for priority | Only the hero image is prioritized; unopened galleries/lightboxes remain dynamically imported and modal images load when opened |
| Hero expertise line was static | Seamless two-copy marquee shares scroll velocity with the toolkit marquee; readable accessible label and reduced-motion fallback |
| Scroll effects and back-to-top needed a common event source | One passive scroll/resize stream with one scheduled frame; viewport observers limit parallax work to visible images |
| FAQ expansion was abrupt | Server-rendered native details remain usable without JavaScript; animation code imports near the viewport and handles keyboard use, interrupted transitions and reduced motion |
| Public hover rules animated shadows/colors/filters | Removed those transitions; new motion uses transform/opacity except the explicitly requested FAQ height animation |
| Mobile grid intrinsic sizing allowed the long marquee to overflow | Explicit min-width constraints and a minmax column remove horizontal overflow at all six requested widths |
| Stylesheets blocked initial rendering | The pinned Next.js inline-CSS option removes separate blocking stylesheet requests; CSP and client navigation checked |

The certificate original is unchanged. Compressed project screenshots retain their existing content and device mockups. The new 0.85-second curtain covers only the hero visual; it does not gate the headline or page. Heavy cursor, magnetic and parallax effects stay off on touch; touch devices keep native scrolling. Motion Auto/On/Off works on desktop and mobile, with OS reduced motion honored by Auto.

## Structure and libraries

The implementation builds on the existing Next.js App Router, TypeScript, Tailwind, native CSS, Lenis and Framer Motion. **No dependency was added.** Native observers and Web Animations handle the small additions; another animation framework is unnecessary.

```text
app/page.tsx                     section composition and public metadata
app/finishing.css                tokens, curtain, marquees, parallax, grid fixes
components/hero.tsx              editorial hero and accessible expertise marquee
components/scroll-ambience.tsx   shared velocity, visible-image parallax, scene wash
components/back-to-top.tsx       shared-scroll visibility
components/faq-section.tsx       server-rendered accessible FAQ
components/faq-enhancement.tsx   near-viewport import and motion cleanup
lib/faq-animation.ts             interruptible accordion enhancement
lib/scroll.ts                    shared event/frame stream
lib/image-preview.ts             optional blur props for existing local assets
data/image-previews.ts           generated tiny placeholders
scripts/generate-image-previews.mjs
components/project-*.tsx         responsive project cards and on-demand gallery
components/work-bunch.tsx        curved work wall retained from reference update
components/certificate*.tsx      lazy lightbox and certificate previews
tests/editorial-motion.browser.mjs
tests/finishing.browser.mjs
```

The retained page flow is Hero → Services → categorized Work/AI demos → curved work wall → About/Journey → combined Skills/Toolkit → Certification → website Workflow → genuine published reviews when available → FAQ → Contact → Footer. Service/detail pages, four filters, theme control, direction-aware navigation, full-screen menu, consent gating and floating-label contact behavior remain intact. Existing CMS/admin implementation is preserved.

## Complete file code

The [source delivery index](../delivery/README.md) contains complete copyable file code grouped by folder, without placeholders. Binary asset hashes appear there; the assets themselves remain in the repository and full source ZIP. Private environment files, dependencies and build output are excluded. The working source files listed above are the implementation, not pseudocode.

## Validation and limits

- Optimized production build, lint and TypeScript checks passed.
- `npm run test:motion:browser` passed at **360, 390, 768, 1024, 1440 and 1920px**, both themes. Coverage includes categories, no overflow, navigation, live OS motion changes, saved explicit preference, native touch scrolling, four on-demand AI demos, retained form validation/honeypot, no unsolicited AI traffic, no-JavaScript content and zero page/hydration errors.
- `npm run test:finishing:browser` passed: actual marquee speed change, desktop parallax, gallery/certificate open/next/zoom/Escape, lazy FAQ module, real animation, rapid reversal, keyboard activation, reduced-motion cleanup and native no-JavaScript expansion.
- Actual desktop/mobile axe WCAG A/AA scans: **0 violations**. This is automated evidence, not a complete accessibility certification.
- Inline-CSS/CSP/font checks, service-to-privacy client navigation, admin login rendering and shared-scroll back-to-top smoke checks passed. Rendering the login screen does not establish a working real owner account.
- Current Lighthouse simulated-mobile lab result: **93 performance, 100 accessibility, 100 best practices, 100 SEO**. FCP **1.4s**, LCP **3.2s**, TBT **10ms**, CLS **0**, speed index **1.7s**. [Measured values](brief-performance.json). The 95+ performance and <2s LCP targets remain unmet. The largest element in this run was the consent copy; it remains visible immediately so privacy controls are not delayed for a better score. Earlier 95-point measurements describe earlier builds, not this one.
- Field INP <200ms and steady physical-device 60fps are **not established** by this lab run. No live provider credentials were changed, no owner credentials overwritten, and live Vercel deployment/owner login were not verified in this environment.

### Reproduce checks

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm start -- --port 3008
# In another terminal, against that local production server:
npm run test:motion:browser
npm run test:finishing:browser
```

The browser suites use system Chromium at `/usr/bin/chromium`; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for another installation. Private production build bootstrap settings should stay private and unchanged during public frontend checks.

For smoothness review, open Chrome Performance on a production build, use mobile CPU throttling and record a full scroll, filter change and FAQ interaction. Check long tasks, dropped frames and layout work; repeat on an actual midrange phone. Run Lighthouse with a fresh browser state and no parallel browser workload. Use deployed field data for INP once available. Test Motion Auto/On/Off, keyboard-only navigation and both themes separately.

## Five further refinements

1. Add owner-approved project case studies showing genuine process, challenges and outcomes instead of invented performance claims.
2. Create two or three art-directed mobile project crops for clearer detail on narrow screens, while keeping the full gallery available.
3. Add an optional short, captioned process film with a static poster and click-to-load playback.
4. Introduce discreet page-to-page transitions between work and case studies, preserving normal links and reduced-motion navigation.
5. Collect consent-aware real-user Web Vitals and prioritize the slowest real device/network combinations before increasing decorative motion.
