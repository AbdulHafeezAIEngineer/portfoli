## docs/APPLE_HIG_INTEGRATION.md

``````md
# Apple HIG integration — 18 October 2026

## Summary

Overall rating for the reviewed web controls: **Good**. Elvora’s visual identity
comes from its purple accent, original device previews, rotating collection and
editorial footer. The new guidance is installed and used for a focused review of
chat controls, keyboard feedback and appearance preferences; this is not a full
site accessibility certification or a redesign.

Source: [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill),
pinned at `914b6a377c22755597e4405e54911b996de822d7`.
The local name is [`apple-hig-design`](../.agents/skills/apple-hig-design/SKILL.md)
to preserve the existing Emil `apple-design` skill. Invoke `$apple-hig-design`.
Its 133 imported files include 123 generated HIG pages and one curated Liquid
Glass reference. Only the new SKILL.md frontmatter name differs from upstream;
[provenance and usage](../.agents/skills/apple-hig-design/INTEGRATION.md) and
[original SHA-256 hashes](../.agents/skills/apple-hig-design/UPSTREAM-SHA256.json)
are included. It adds no client JavaScript, dependency or tracking.

## Improvements

- **Medium — touch controls. What:** chat send/microphone buttons measured
  39×39 CSS px, and voice playback buttons were 32×32. **Why:**
  `accessibility.md › Mobility`: “Offer sufficiently sized controls.” **Fix:**
  coarse-pointer devices now get 44×44 CSS px for these controls. Desktop sizes
  remain unchanged. This is a web comfort target adapted from the HIG, not a
  claim that a 39px control automatically fails WCAG.
- **Low — keyboard indication. What:** the composer had no textarea outline;
  focusing it changed only the enclosing 1px border. **Why:**
  `focus-and-selection.md › Best practices`: “use a focus ring for a text or
  search field.” **Fix:** add a 2px focus-visible ring, offset by 2px, using the
  existing semantic accent text token. The previous border indication is kept.
- **Low — appearance preferences. What:** the header always blurred content
  beneath it, and functional borders had no increased-contrast variant. **Why:**
  `liquid-glass.md › Review checklist` (upstream’s curated guide): “Reduce
  Transparency gets an opaque fallback, Increase Contrast gets stronger fills
  and borders.” **Fix:** reduced-transparency makes header/glass UI opaque with
  no backdrop blur; higher contrast strengthens header/glass and chat frame/input
  borders using the existing muted token. This does not alter video transparency
  or artwork. Unsupported media queries simply leave the normal appearance.

## Craft notes

Keep the custom work, purple palette and supplied media. No stock Apple fonts,
new glass effects, iOS tab bar, gradients, generic replacement artwork or page
reorganization were introduced. Default theme styling and existing layout are
preserved except for the deliberately larger coarse-pointer chat buttons.

## What works

The website already has native button/input semantics, labeled chat controls,
modal keyboard containment with Escape/focus restoration, clear service page
navigation, theme and Motion controls, phone text fields at 16px, and separate
light/dark tokens. Website/bot workflows and Technical Domains retain their
current locations. Consent, Botpress, API/auth/mail logic and dependency versions
are untouched.

The unchanged token pairs below were calculated with WCAG relative luminance.
This verifies these opaque combinations, not every image/overlay or text fragment
on the site. Text pairs exceed 4.5:1; the focus ring also exceeds 3:1.

| Theme | Role                           | On background | On surface |
| ----- | ------------------------------ | ------------: | ---------: |
| Dark  | Text                           |       18.01:1 |    16.70:1 |
| Dark  | Muted / higher-contrast border |        7.45:1 |     6.91:1 |
| Dark  | Accent text / focus ring       |        7.26:1 |     6.73:1 |
| Light | Text                           |       18.95:1 |    19.75:1 |
| Light | Muted / higher-contrast border |        5.14:1 |     5.36:1 |
| Light | Accent text / focus ring       |        5.47:1 |     5.70:1 |

Tokens remain defined by `data/theme-tokens.json` and its generated CSS. No new
colors or token changes were needed.

## Platform notes

This is a Next.js website. HIG principles are translated into HTML, CSS media
queries and browser behavior. Native SwiftUI materials, App Store review,
Apple Pay and platform-specific navigation rules do not apply to this task.
The owner’s explicit Motion On/Off behavior remains intact. Mobile checks use
Chromium touch emulation; physical iPhone/Android, Safari, screen-reader and
speech-provider testing are not claimed. Browser media-feature emulation checks
the new appearance fallbacks; it does not validate an OS settings panel.

## Verification

- `npm run lint` and the file-mode production build passed.
- Import integrity: all 133 upstream file hashes match, after reversing the
  documented one-line name alias; the previous Emil Apple skill is unchanged.
  Sixteen installed skill names are unique, cited local guideline files exist,
  and no unresolved `doc://` links remain in the imported HIG pages.
- `node --check .agents/skills/apple-hig-design/scripts/pull-hig.mjs` passed.
  This installs a pinned reference snapshot. The network refresh script and
  external installer were not run; no newer Apple snapshot is claimed.
- `npm run test:apple:browser` passed all eight width/theme cases at
  320/390/768/1440px. The actual local production UI renders a mocked chat reply,
  traps Tab, restores focus on Escape, keeps phone input text at 16px and uses
  44px coarse-pointer buttons. It verifies the 2px focus ring, opaque/blur-free
  header and stronger border under emulated preferences, no horizontal overflow
  and zero page errors. See [measurements](apple-hig-browser-results.json) and
  [mobile preview](apple-hig-mobile-chat.png). The reply is a local UI fixture,
  not a paid provider test.
- `npm run test:emil:browser` also passed: saved Motion Off still starts zero
  video requests, On loads one responsive source per homepage clip, footer
  animations pause/resume with visibility, browser theme color follows the
  selected theme, and controls/layout pass all four widths. No fresh Lighthouse,
  FPS, physical-device or live-deployment measurement is claimed.

## Changed files

- `.agents/skills/apple-hig-design/`: upstream skill, original references,
  refresh script and upstream entry points/readme, plus local integration and
  hash manifest. No changes to the existing Emil skill package.
- `app/bots.css`: composer keyboard ring, coarse-pointer button sizes and
  higher-contrast functional borders.
- `app/globals.css`: reduced-transparency and higher-contrast UI fallbacks.
- `tests/apple-hig.browser.mjs`, `package.json`: repeatable focused browser check.
- `docs/apple-hig-browser-results.json`, `docs/apple-hig-mobile-chat.png`:
  measured results and mobile chat preview.
- `docs/APPLE_HIG_INTEGRATION.md`, `README.md`, `VERIFICATION.md`: integration,
  evidence and limits.
- Generated `delivery/` source sections/index: refreshed reviewable source bundle.
``````

## docs/BRIEF_COMPLETION.md

``````md
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
``````

## docs/CATEGORIZED_PAGES.md

``````md
# Categorized Elvora portfolio

The homepage has a purpose-led introduction and large visual previews in alternating light, black and deep-purple sections. See [the current homepage presentation](HOMEPAGE_BANDS.md). Ten subject pages organize the site. Website and bot processes live with their respective projects and demos. Technical Domains belongs below website content. See the [website positioning and testimonials update](WEBSITES_TESTIMONIALS.md). Header navigation is route-aware and keyboard accessible, with a grouped About menu and a scrollable secondary tab row. Mobile navigation contains every page category and closes after navigation or Escape.

| Page           | Route            | Content                                                                                                                   |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Home           | `/`              | Purpose-led introduction, original logo motion and visual subject previews                                                |
| Websites       | `/websites`      | Wide looping showcase, four concepts, interactive demos, screenshot galleries, How I Build Websites and Technical Domains |
| AI Bots        | `/ai-bots`       | Looping bot video, bot demos, How I Build Bots and all embedding methods; provider consent retained                       |
| Bunch of Work  | `/bunch-of-work` | Larger original 54-tile curved wall and accessible project index                                                          |
| About Me       | `/about`         | Original Elvora artwork and personal introduction                                                                         |
| My Journey     | `/journey`       | Existing chapters, in their original order                                                                                |
| Skills & Tools | `/skills`        | Existing categorized toolkit and tools marquee                                                                            |
| Certificates   | `/certificates`  | Original documents and functional zoom viewer                                                                             |
| Testimonials   | `/testimonials`  | Dedicated editorial card layout; published, permission-approved reviews only                                              |
| Services       | `/services`      | Existing service scopes and detail links                                                                                  |
| Contact        | `/contact`       | Existing inquiry form, direct contact and native/enhanced FAQs                                                            |

The About tab sequence is About Me → My Journey → Skills & Tools → Certificates. Websites and AI Bots have local section links to their processes. Websites also links to Technical Domains. The original full footer design remains; old `/#work`, `/#embed-methods` and other former section links redirect to their destinations. `/ai-websites` redirects to `/websites`; `/technical-domains` redirects to `/websites#fundamentals`. The former `/how-i-build` and `/ai-bots/how-i-embed-bots` routes redirect to the appropriate parent-page section. Canonical metadata and sitemap list actual subject pages. Existing service, project-note, interactive demo, design-study, legal and private admin URLs remain available.

## Clean previews and mobile motion

Removed nested white panels, `Concept Project` labels, `03 / 04` counters, category/subtitle strips, `DESKTOP / MOBILE` labels and floating View Project pills. The original laptop/phone artwork remains, with just the project name, a simple Explore link and a separate View screenshots action. Card presentation is uniform and unboxed in both themes.

Touch previews no longer disable animation. Visible cards float gently and their 3D angle follows native scrolling; desktop keeps pointer tilt. Offscreen floating pauses. Motion Off stops both and persists across routes/reloads. A narrow viewport uses scroll-based movement even when a connected mouse is present. No sensor permission, scroll interception or new library is involved.

Original project art, custom demo colors, 54-tile collection order/geometry, media sources, forms, cookie storage, Botpress permissions and private credentials are preserved. Route transitions rescan reading, reveal and marquee/parallax enhancements. Public text and images remain ready without scroll-triggered mounting.

No real testimonials were supplied to file mode. Fictional illustrative reviews and original illustrated profile avatars are visibly labeled as design examples, not client endorsements. Genuine approved CMS records replace the samples. Floating cards and background particles work on mobile and desktop, with local pause and global Motion Off.

## Verification

- `npm run build` (includes lint and TypeScript), `npm run lint`, `npm run typecheck`: passed.
- `test:pages:browser`: all ten subject routes at 390/1440px, isolated content, real route links, canonical URLs, inline processes/domains, restored footer, ordered tabs, keyboard menus, saved Motion Off, mobile 3D, legacy redirects, server-rendered content and sitemap.
- `test:motion:browser`: 360, 390, 768, 1024, 1440, 1920px; both themes, native touch, default On, saved Off and contact validation.
- `test:showcase:browser`: native playback and actual looping for both videos, desktop/mobile sources, muted/inline/no controls, global Off/On, offscreen pause and consent.
- `test:windows:browser`: all four interactive concepts, mobile/desktop frames, maximize/Escape/back, nested scrolling, forms/reset and retained study routes.
- `test:finishing:browser`, `test:video-motion:browser`, `test:reviews:browser`: screenshot/certificate dialogs, FAQ keyboard/reversal/no-JS behavior, logo flip/shine, reversible word emphasis, stable text geometry, genuine-review replacement and labeled previews.
- Consent, contact, chat and security: 46 tests passed; no optional provider traffic during public browser checks.
- `test:testimonials:browser`: actual card/background transforms, local portraits, labels, pause/resume, hover pause, OS preference with explicit site On, global Off, offscreen activity and no-JavaScript content.
- [20 current WCAG A/AA scans](websites-testimonials-accessibility.json): home, websites, About, Skills and Testimonials; both themes at 390/1440px, zero violations.
- [Current scroll/loading observations](websites-testimonials-readiness.json): home, website and collection pages at 390/1440px. Each page's images are loaded before scrolling; no image/component-script requests start during the measured scroll. Frame observations are from headless Chromium, not a physical-device FPS guarantee.

Local validation does not establish live Vercel deployment, real owner login or provider delivery. No credentials or hosting settings were modified.

## Previews

- [Desktop home](web-positioning-home-1440.png) · [Mobile home](web-positioning-home-390.png)
- [Desktop websites](web-positioning-websites-1440.png) · [Mobile unboxed previews](web-positioning-websites-390.png)
- [Desktop collection](pages-bunch-of-work-1440.png) · [Mobile collection](pages-bunch-of-work-390.png)
- [Desktop Testimonials](testimonials-floating-1440.png) · [Mobile Testimonials](testimonials-floating-390.png)
``````

## docs/EDITORIAL_UPGRADE.md

``````md
# Elvora editorial experience and production setup follow-up

## Deployment diagnosis

The supplied Vercel log ends with the first-owner credential validation error. It successfully installed dependencies, generated Prisma, applied migrations and queried the owner table before rejecting `ADMIN_EMAIL` or `ADMIN_PASSWORD`. The npm deprecations, missing local `.env.local` notice and PostgreSQL SSL-mode warning are not the terminating error.

The live owner must correct the private Production credential configuration: email `abdulhafeez@elvoraai.online`; a privately chosen password with 14+ characters, upper/lowercase, a number and a symbol, at most 72 UTF-8 bytes. This requirement is unchanged. No default password was added, existing passwords are preserved, and no private Vercel values were available to this execution session.

The setup script now separates invalid email from missing password requirements and reports only the unmet rules. Driver diagnostics remain fixed strings without URLs, SQL or credentials. Connection strings are validated against accidental variable assignments, masked text and password-only values. Migrations and first-owner creation remain behind `ADMIN_BOOTSTRAP_ON_BUILD=true` and Production gating. An invalid private password still deliberately stops owner activation; code cannot silently replace it.

## Audit and changes

| Finding                                                                                                       | Result                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The reveal observer stopped when reduced motion was enabled, but never restarted when that preference changed | Observer lifecycle now restarts and observes new filter content whenever motion becomes active                                                                                                                           |
| A desktop can inherit Windows/browser reduced-motion while a phone animates normally                          | A persistent, accessible Motion Auto/On/Off selector works across screen sizes; Auto honors the OS, On is explicit consent to full motion, Off disables recurring animation and optional effects                         |
| Chromium could stop responding during repeated preference changes with scroll-linked CSS timelines            | Removed those CSS timelines; reading and journey progress use a shared passive scroll listener with one queued animation frame                                                                                           |
| Only websites and bots had category controls                                                                  | All, Website concepts, UI/interface studies, AI chatbots/demos; actual counts, arrow/Home/End keys, animated entries, original study links                                                                               |
| Toolkit and skills repeated the same named products                                                           | One categorized skills section retains tool purposes, human-direction copy, original tools and the `#creative-toolkit` anchor; decorative seamless marquee                                                               |
| Navbar stayed in place with no active-section state                                                           | Direction-aware hide/show, keyboard focus brings it back, observer-based active links, staggered mobile navigation                                                                                                       |
| Desktop scrolling and hover effects were inconsistent                                                         | Lenis 1.3.23 is a lazy enhancement for fine-pointer devices with motion enabled; duration 1.15s. Native touch scrolling and reduced-motion scrolling remain available. Existing Framer Motion stays; GSAP is unnecessary |
| Large image variants could be requested                                                                       | Responsive variants capped at 1920px, existing accurate sizes retained, AVIF/WebP negotiated; only the hero emblem has priority                                                                                          |
| Repeated paint-heavy reveal blur                                                                              | Block reveals animate opacity/transform only; the oversized footer shimmer now uses opacity instead of an animated background position                                                                                   |
| Contact presentation lacked the requested field interaction                                                   | Visible associated labels float on focus/value, existing validation, honeypot, optional fields, character count and request semantics retained; success animates unobtrusively                                           |

Existing strengths retained: two self-hosted next/font variable families with swap (two initial files instead of five), server-rendered content and native FAQ, dynamically imported galleries/certificate viewer/chat, explicit consent gating, theme toggle, real contact behavior, canonical/OG/structured metadata, services, concepts, studies, journey, certification, permission-only reviews and legal links. No invented reviews, client identities, metrics or experience were introduced.

## Component plan and implementation

- `components/motion-preference.tsx`, `motion-provider.tsx`, `reveal-observer.tsx`: shared preference and progressive reveals.
- `components/editorial-effects.tsx`: dynamically loaded Lenis, lightweight desktop View badge and subtle magnetic CTA movement. Touch, reduced motion, dialogs and native scrolling areas are excluded.
- `lib/scroll.ts`, `components/scroll-progress.tsx`, `navbar.tsx`: one shared scroll subscriber, reading/journey progress and navigation direction.
- `components/work.tsx`: four categories, projects, six original interface studies, on-demand AI demos and deferred gallery.
- `components/skills.tsx`, `app/page.tsx`: unified toolkit and adjacent About/Journey content.
- `app/refinement.css`: editorial interactions, responsive filter cards, mobile navigation, stacked workflow and field polish; existing design styles retained.
- `lib/admin/password.ts`, `setup-errors.ts`, `scripts/prepare-production.ts`: private setup validation and actionable non-secret diagnostics.

Complete implementation is in the repository and regenerated source snapshot. No credential placeholders need to be copied into application code. Provider secrets stay in hosting settings.

## Design choices and limits

The supplied reference informs easing, masks, rhythm and interaction density; its proprietary source and exact timing were not copied or claimed verified. Headings reveal within roughly one second. No blocking splash screen was introduced because it would delay useful content. The six-study gallery remains separate from the existing bunch-of-work collage. The FAQ remains server-rendered native details rather than adding JavaScript solely to animate its height.

Motion is not unconditionally forced on people who request less animation. An explicit On setting enables it on a desktop that otherwise inherits reduced motion. Theme and motion selections are functional preference storage. They are not permission to load external chat.

The supplied Lighthouse/INP/frame-rate goals are targets, not guarantees. Lab Lighthouse cannot establish field INP or consistent 60fps across devices. Production database, Redis, SMTP, AI and hosting access remain separate from local validation.

## Verify the experience

1. Run `npm ci`, `npm run build`, then `npm start` (or the documented local test port).
2. Run `node tests/editorial-motion.browser.mjs` against a local production app; tests cover 360,390,768,1024,1440,1920px, both themes, categories, live media preference changes, On/Off persistence, navigation, overflow and unsolicited bot traffic.
3. Test Auto with the OS reduced-motion setting; test On and Off; refresh with a saved choice. Test a real touch device in addition to desktop emulation.
4. Use Chrome Performance with CPU throttling: scroll, filter, open/close a gallery, use keyboard navigation, and verify no repeated layout long tasks or off-screen paint effects. Test with and without saved consent.
5. Use Lighthouse mobile with a clean browser and no other running audits. Keep actual scores distinct from requested targets. The measurement artifact records final validation results.
6. `npm run test:security`, `npm run test:login`, chat/contact/consent suites cover retained security paths. `tests/owner-setup.integration.mjs` refuses nonlocal databases and verifies real migrations, weak-password diagnostics, first-owner creation, and unchanged existing password hashes.

After the owner fixes the live private password, deploy the latest main commit, verify `/admin/login`, then remove temporary `ADMIN_PASSWORD`, set `ADMIN_BOOTSTRAP_ON_BUILD=false`, and redeploy. This cleanup preserves the account and its password hash.

## Final local measurement

Lighthouse 13.5 mobile: **95 performance, 100 accessibility, 100 best practices, 100 SEO**. FCP 1.4s, LCP 2.9s, TBT 30ms, CLS 0, speed index 1.6s. The under-2s LCP target remains unmet; field INP and universal 60fps are not established. See `editorial-performance.json`. A prior intermediate run measured 90 performance before variable fonts and system-font privacy controls.

## Five further directions

1. Add genuine project narratives with the problem, design decisions and actual outcomes when available.
2. Photograph the owner and use an original art-directed portrait instead of a stock identity.
3. Add approved client reviews with permission and portraits, retaining the existing rotation controls.
4. Build a small interactive before/after design study using one real project.
5. Collect consent-aware real-user performance measurements before tuning effects for the actual audience.
``````

## docs/EMIL_SKILLS_AUDIT.md

``````md
# Emil Kowalski skills integration and website audit

18 October 2026. Audited baseline: `520caf7`. This is a review of the local production build, not a claim that the external Vercel deployment has completed.

## Integration

The owner's supplied archive of <https://github.com/emilkowalski/skills> is installed at `.agents/skills/`: all **15 skills and 23 original skill/reference files**, plus upstream license, overview and performance reference. Original skill files are byte-for-byte verified. [Source, checksum and use](../.agents/skills/SOURCE.md) identify the exact uploaded snapshot; no upstream Git commit was present in the ZIP.

These are development skills, not a website dependency. No package was installed, chatbot instruction changed or third-party executable run. They add no visitor download or runtime code. The application fixes below are separate, authorized implementation work after the read-only audit.

Applied guidance: [emil-design-eng](../.agents/skills/emil-design-eng/SKILL.md), [animation-performance](../.agents/skills/animation-performance/SKILL.md), [mobile-native](../.agents/skills/mobile-native/SKILL.md), and [review-animations](../.agents/skills/review-animations/SKILL.md). The [improve-animations](../.agents/skills/improve-animations/SKILL.md) workflow supplied the recon, read-only category reviews, vetting and plan format. The owner requested integration as well as audit, so the selected fixes were implemented within the same authorized task. Native/Expo/Swift and other unrelated skills were not applied to this web app.

## Recon and boundaries

Next.js 15.5.28 App Router, TypeScript, Tailwind 3.4, Framer Motion 11, CSS keyframes and a single passive shared scroll/rAF stream. Lenis is limited to fine-pointer desktop; touch scroll stays native. Existing editorial easing is `cubic-bezier(0.22, 1, 0.36, 1)`.

The site's personality is a marketing portfolio with occasional explanatory motion. Logo rotation, 3D project art, the 54-tile curved gallery, reading emphasis, testimonials and media loops are deliberate owner choices. These are not treated as defects just for being decorative. Frequent navigation/form controls should respond immediately; existing visual artwork and rare marketing motion stay intact.

Owner requirements preserved: default Motion On on phones and desktop, explicit On overrides the OS, saved Off persists, immediately available text/images, eager media readiness when On, original purple/black/white palette, rounded transparent collection video, portrait, custom gallery geometry, navigation, SEO copy, policies, Botpress permission gate and private auth/data boundaries.

## Vetted findings

Locations below refer to the audited baseline; source line numbers move after the fixes.

| #   | Severity                               | Category                 | Location                                                                                                  | Finding                                                                                                                                                                                                 | Outcome                                                                                                                                                                     |
| --- | -------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Medium                                 | Performance / preference | `components/motion-provider.tsx:12`, `components/VisibilityVideo.tsx:123`                                 | Saved Off still started all three video requests before the effect read the saved preference. Reproduced at 390/1440px.                                                                                 | Fixed: media sources stay inert until preference initialization. Default On retains eager loading.                                                                          |
| 2   | Medium                                 | Mobile accessibility     | `app/refinement.css:32`, `app/agency.css:11`                                                              | Motion select computed 11px; contact service select 14px. These are below the 16px input threshold used to avoid iOS focus zoom.                                                                        | Fixed: scoped coarse-pointer selects use 16px; page zoom remains enabled.                                                                                                   |
| 3   | Medium                                 | Input feedback           | `app/globals.css:125`, `app/pages.css:686`                                                                | Shared button/home-arrow hover movement was ungated, and touch controls lacked deliberate pointer-down feedback. Sticky hover was not reproduced in Chromium; the capability mismatch is code-verified. | Fixed on shared CTAs/icons, homepage exploration, social and service/contact arrows: hover capability gating, brief pointer press scale, no keyboard press movement.        |
| 4   | Low                                    | Mobile usability         | `app/editorial.css:805`, `app/studio.css:801`                                                             | Footer legal/settings actions measured approximately 14px high. This is a usability finding, not a demonstrated WCAG 2.2 AA failure because spacing exceptions may apply.                               | Fixed: touch actions have a 44px minimum height without increasing label typography.                                                                                        |
| 5   | Low                                    | Theme coherence          | `app/layout.tsx:77`, `components/navbar.tsx:77`                                                           | Theme-color followed the OS while the site uses default/saved/manual theme selection. Browser tags did not update on toggle.                                                                            | Fixed: dark SSR default matches this site's default, inline initialization and a small observer synchronize the selected theme and client navigation.                       |
| 6   | Low                                    | Offscreen activity       | `app/refinement.css:426`, `app/editorial.css:729`, `app/editorial.css:761`                                | Four footer loops ran while far below the viewport. Reproduced with `getAnimations()`. Dropped frames were not measured.                                                                                | Fixed: the same loops pause outside view, in a hidden tab and under site Motion Off, then resume in place.                                                                  |
| 7   | High payload cost, deliberate tradeoff | Loading                  | `components/VisibilityVideo.tsx:129`                                                                      | Fresh Motion On homepage loads all three videos before scrolling: selected video assets total 1,780,060 bytes mobile / 3,159,480 bytes desktop, before posters.                                         | Retained: this matches the owner's earlier requirement for ready content. Near-viewport video fetching and smaller posters remain a separately selectable performance plan. |
| 8   | Low / profiling hypothesis             | Style invalidation       | `components/scroll-progress.tsx:25`, `components/scroll-ambience.tsx:75`, `components/logo-motion.tsx:32` | Scroll updates inherited variables on timeline/image/logo containers. Code suggests descendant invalidation risk, but no actual frame-budget regression was established.                                | Deferred: do not redesign the scheduler or custom motion based only on a suspected cost.                                                                                    |

## Before / after review

| Before                                                         | After                                                                                                      | Why                                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `full` context exposes `<source>` before saved Off is resolved | A `ready` flag gates sources and media initialization                                                      | The browser preload scanner cannot start unwanted Off downloads.      |
| `.button:hover` lifts on every input type                      | Fine-pointer/hover media query; pointer press uses `scale(0.97)` over 160ms with existing editorial easing | Touch feedback starts on press; keyboard focus remains independent.   |
| Motion/service selects at 11px/14px                            | Scoped 16px coarse-pointer text                                                                            | Avoid the cause of iOS focus zoom without disabling pinch zoom.       |
| Footer text actions approximately 14px high                    | At least 44px interactive height on coarse pointers                                                        | Easier tapping while retaining the visual labels.                     |
| Browser color stays tied to OS                                 | Browser color follows actual selected theme, including legal-page navigation                               | Native chrome and selected site theme remain consistent.              |
| Wordmark/waves/emblem loops run offscreen                      | Visibility/background pause on the original keyframes                                                      | Avoid unnecessary offscreen work without deleting the owner's design. |

The performance and mobile reviewers approved the final diff with no blocking regressions. This verdict covers the changed interactions, not every historical animation or a physical-device frame-rate guarantee.

## Counterevidence and retained decisions

- Current local Chromium requests **one responsive WebM per video**. The multiple desktop/mobile/MP4 downloads in the older pasted Lighthouse report were not reproduced. Do not attribute those old requests solely to listing four sources.
- No active `transition: all` was found. The curved wall already writes one cylinder transform instead of invalidating its 54 tiles.
- The later opacity-based `wordmark-breathe` rule overrides the earlier gradient animation, so continual gradient repaint is not a valid finding for the current footer.
- Shared scrolling is already consolidated. An experiment did not substantiate repeated forced-layout churn from sequential subscriber callbacks; a broad read/commit scheduler rewrite is not justified by these observations.
- Site Motion On overriding OS preference is a settled, explicit owner requirement, not a missing reduced-motion bug. Off behavior is tested and preserved.
- The two actual polish opportunities were pointer press feedback (implemented) and an optional short, origin-aware pointer entrance for the About dropdown. The dropdown opportunity remains deferred: keyboard navigation should stay immediate, and this audit does not add decoration for its own sake.

## Validation

`npm run lint` and the local production build passed. `npm run test:emil:browser` verifies:

- At 390/1440px, saved Off starts **zero** video requests; On selects exactly three responsive sources, one per homepage clip.
- Original footer animations run when visible, pause offscreen, respond to a simulated tab visibility event and stop under Motion Off.
- Actual selected theme matches theme-color through manual toggles and client navigation to Cookie Policy.
- At 320/390/768/1440px, both themes have no horizontal overflow. Coarse-pointer selects are 16px, footer touch actions at least 44px, pinch zoom remains allowed and body content remains selectable.

`npm run test:showcase:browser` passed at 390/1440px with both OS motion settings, including actual loop wrap, no native controls, silent inline playback, Off/On and the forced purple MP4 fallback. `npm run test:pages:browser` passed for all ten subject pages at both widths, including real navigation, original 54-tile gallery, mobile 3D, both themes, canonicals, consent, saved motion and server-rendered pages/sitemap. Preview images were inspected. No full-site accessibility certification or new Lighthouse run is claimed.

No new PageSpeed score or universal smoothness claim is made. A physical iOS/Android phone is unavailable here; actual keyboard-induced zoom, browser chrome appearance and touch feel still need hardware confirmation. The code and browser emulation checks are verified separately from that limitation. Live Vercel deployment is not verified by these local checks.

## Files

Runtime changes: `components/motion-preference.tsx`, `motion-provider.tsx`, `VisibilityVideo.tsx`, `footer.tsx`, new `footer-motion.tsx`, new `theme-color-sync.tsx`, `app/layout.tsx`, shared interactions in `globals.css`, `pages.css`, `editorial.css`, `reference-motion.css`, `refinement.css`, and Tailwind's supported-hover flag. Package scripts add only the regression command; application dependencies and lockfile remain unchanged.

Audit plans: [execution record](../plans/README.md). Previews: [mobile contact](emil-mobile-contact.png), [mobile footer](emil-mobile-footer.png).
``````

## docs/HOMEPAGE_BANDS.md

``````md
# Homepage with contrasting sections

The owner's reference uses separate light and dark product sections. Elvora's homepage now follows that rhythm with its existing content and purple palette:

1. The header and hero follow the saved light/dark preference, with purple primary actions and active states.
2. The purpose introduction uses a full-width light neutral background and dark text.
3. The website showcase uses a full-width black background and a large, centered looping website video with rounded corners.
4. AI Bots and Bunch of Work appear side by side in white and deep purple; phones stack them into separate sections.
5. The secondary About, Testimonials and Contact navigation returns to a light background before the original full footer.

Narrow neutral gutters separate the panels. The deep-purple background is a solid mix of the existing purple and black tokens, without gradients or neon effects. Section text, links and borders have explicit local contrast tokens. Both intentional light and dark panels remain present in either site theme; changing the theme still updates the header, hero and shared footer styling.

Original project images, custom mockups, curved collection, footer artwork, page content, logo/reading motion, cookie choices, Botpress and authentication are preserved. Only the homepage composition and its shared palette exports change. No application dependencies or credentials were added or changed.

## Homepage AI Bots video

The AI Bots preview image is now replaced by the owner's supplied eight-second delivery-chat video. Local silent WebM/MP4 encodes are available at 1280px and 854px, with a matching poster. The existing visibility-controlled player handles looping inline playback on desktop and phones, without controls; global Motion Off shows the poster. The card keeps its existing size, layout and AI Bots destination. The separate AI Bots page retains its original showcase.

The shared player gains a compact card presentation; the homepage, scoped card CSS and native showcase browser checks are updated. New media is stored as `public/videos/home-ai-bot*`. Production build and native playback checks cover all three showcases, including actual loop wrap, offscreen pause and Off/On behavior.

[Desktop video frame](home-bot-loop-1440.png) · [Phone video frame](home-bot-loop-390.png)

## Homepage Websites video

The website screenshot is replaced by the owner's supplied ten-second architectural website video. The stage spans more than 90% of the viewport, with a 2:1 desktop frame and natural 16:9 framing on phones. The source is contained without distortion, with soft side masks blending its edges into the same black background. Rounded clipping remains on all four corners. Local silent WebM/MP4 encodes at 1280px and 854px and a matching poster are stored as `public/videos/home-websites*`.

The existing player loops inline without controls, pauses offscreen and follows Motion Off/On. The Websites link and surrounding content remain the same. Native browser checks cover all four showcases, actual loop wrap, mobile/desktop sources, rounded corners, card geometry, offscreen pause and the global motion control.

[Desktop video frame](home-websites-loop-1440.png) · [Phone video frame](home-websites-loop-390.png)

## Video edges and highlighted navigation

Both homepage videos now have four rounded corners, including their bottom edges on phones. The AI Bots preview has bottom spacing so those corners remain visible against its light section. The website video loses the former 1100px width cap; black side blending works for its moving video and Motion Off poster alike.

Keep exploring has a stronger headline, purple emphasis on “The next idea,” and bold navigation titles. A subtle underline and staggered top accents animate only while the section is near the viewport and the document is visible. Touch screens use the same effects. Hover and keyboard focus highlight each destination; Motion Off removes the animations and transitions. Text and links stay visible without JavaScript and are never gated by viewport entry.

`components/home-explore.tsx` handles the section's visibility and foreground state; `components/home-directory.tsx` retains the same destinations and copy. Scoped styling is in `app/pages.css`. No media sources, subject-page design, original custom artwork, consent/provider logic or credentials change.

Production build, six-width/both-theme layout and all four native video checks passed. Actual underline transforms, global Off, offscreen pause, bold typography and all three destinations were checked at 390/1440px. [Six current WCAG A/AA scans](horizon-explore-accessibility.json) cover both themes and desktop hover states. [Desktop navigation preview](home-explore-highlight-1440.png) · [Phone preview](home-explore-highlight-390.png).

## Homepage collection video

The subsequent [portrait/transparency update](PORTRAIT_TRANSPARENT_COLLECTION.md) removes the collection clip's outer backdrop and updates media URLs to `home-collection-transparent*`; the MP4 fallback matches this purple section.

The static Bunch of Work collage is replaced by the owner's supplied eight-second rotating website-design video. It uses a natural 16:9 frame, rounded clipping on all four corners, silent inline looping and the same visibility/Motion Off controls as the other previews. Local WebM/MP4 encodes at 1280px and 854px, plus a matching poster, are stored as `public/videos/home-collection*`.

The purple section, heading and `/bunch-of-work` destination remain. The original interactive curved wall on that dedicated page is untouched. Removing the unused collage also removes its project/study imports and the homepage's unnecessary project query; subject pages continue loading their own content.

Updated files are `components/home-directory.tsx`, `components/VisibilityVideo.tsx`, `app/pages.css`, `app/page.tsx`, the new video assets and native browser checks. Production build and all five native showcase checks passed on desktop/mobile, including actual looping, muted inline playback, no controls, correct source resolution, rounded corners, global Off/On and offscreen pause.

[Desktop collection video](home-collection-loop-1440.png) · [Phone collection video](home-collection-loop-390.png)

## Files

- `components/home-directory.tsx`: full-width section classes and contained secondary navigation.
- `app/pages.css`: contrasting section tokens, edge-to-edge panels, responsive split/stack, spacing and keyboard focus treatment; homepage purple accents restored.
- `scripts/generate-theme-assets.mjs` and generated `app/theme-tokens.css`: fixed light-section exports derived from the existing palette, allowing independent light/dark sections without copied color values.
- `tests/editorial-motion.browser.mjs`: homepage added to the six-width/both-theme layout checks.
- `tests/pages.browser.mjs`: saved motion preference check waits for hydration after full-page footer navigation.
- README, verification notes, page map, previews and delivery snapshots refreshed.

## Validation

- `npm run build`: production compilation, lint, TypeScript and page generation passed.
- `npm run test:motion:browser`: 360/390/768/1024/1440/1920px, both themes, default On, saved Off, responsive navigation, consent and contact checks passed.
- `npm run test:pages:browser`: all ten subject routes, actual navigation, canonicals, sitemap, parent-page processes, mobile 3D and static no-JavaScript content passed.
- `npm run test:video-motion:browser`: desktop/touch logo flip, shine, reversible reading emphasis and no-JavaScript reading passed.
- [Four WCAG A/AA scans](home-bands-accessibility.json): complete homepage, dark/light at 390/1440px, zero violations. The same browser check verified actual theme-toggle behavior, full-width panels, desktop pairing/mobile stacking, all images loaded, no overflow and no runtime errors.

These are local production-build checks. External Vercel deployment status is not verified by this environment.

## Previews

- [Main section composition](home-bands-overview-desktop.png)
- [Dark desktop](home-bands-dark-1440.png) · [Dark phone](home-bands-dark-390.png)
- [Light desktop](home-bands-light-1440.png) · [Light phone](home-bands-light-390.png)

The isolated composition capture hides fixed navigation/progress controls to show the full section design without overlaying them on the image; the full-page captures show the complete site.
``````

## docs/PORTRAIT_TRANSPARENT_COLLECTION.md

``````md
# Original portrait and transparent collection video

The owner supplied a PDF containing one embedded 1312×1199 portrait. The embedded image was extracted directly, without a screenshot or generated replacement, and encoded as a 200KB WebP for the site. `components/experience.tsx` now displays it within the original rounded About frame. The frame, purple backing, owner name and signature remain; the large Code/Context/Craft poster text is replaced by the portrait. Small readable labels retain the existing identity. The image is cropped by CSS to fit the frame; the stored image preserves the full photograph and its original appearance.

## Collection background

The rotating-design clip has an opaque dark rectangular backdrop. `scripts/prepare-collection-transparency.py` prepares an outer silhouette across all 192 frames, uses a temporal median to stabilize its outline, and feathers its edge. It preserves the gallery's interior, including dark website designs, rather than making every black pixel transparent.

- Desktop and mobile WebM files contain a real alpha channel. Decoding confirms clear corner pixels (alpha 0) and an opaque gallery center (alpha 255).
- Matching MP4 fallbacks are precomposited onto the purple panel color derived from `data/theme-tokens.json`. MP4 does not carry an alpha channel.
- The poster is an alpha WebP. Collection frame backgrounds are transparent, so the section's purple shows through.
- `VisibilityVideo` checks one clear corner once after video data loads. Browsers that discard video alpha, or restrict the canvas check, switch to the matching MP4. There is no continuous canvas rendering or client-side background removal.
- Updated `home-collection-transparent*` URLs prevent a previously cached opaque poster or clip from being reused. Other showcase URLs are unchanged.

Both themes use the same intentional purple section. Its media keeps the existing rounded corners, local silent loops, mobile variants, offscreen pause and global Motion Off. Other pages, original interactive collection wall, artwork, consent/Botpress and private settings are preserved. No application dependency or credential was changed. The PDF itself is not published.

## Files

- `components/experience.tsx`, `public/abdul-hafeez.webp`: original portrait in the established design.
- `app/pages.css`: portrait fitting/readable labels and transparent collection containers.
- `components/VisibilityVideo.tsx`: alpha capability check and precomposited MP4 fallback.
- `public/videos/home-collection-transparent*`: alpha desktop/mobile WebM, purple desktop/mobile MP4 and transparent poster, replacing the earlier opaque asset names.
- `scripts/prepare-collection-transparency.py`: repeatable media preparation using ffmpeg, NumPy and Pillow; these tools are needed only to prepare assets, not to run or build the website.
- `tests/showcase-videos.browser.mjs`: actual alpha sampling, protected gallery center, normal playback and simulated missing-alpha fallback coverage.

To regenerate video assets with the original supplied clip available:

```bash
python3 scripts/prepare-collection-transparency.py /path/to/original-rotating-gallery.mp4
```

Re-run media preparation if the fixed purple panel palette changes, so the MP4 fallbacks continue to match it.

## Validation

Production build (including lint and TypeScript), all five showcase loops on desktop/mobile with both OS preference settings, and simulated absent-alpha support at 390/1440px passed. The browser checks sample actual decoded alpha, verify purple fallback pixels, retain Motion Off/On and offscreen pause, and report no runtime or provider-request errors.

The portrait and transparent Motion Off poster were checked at 390/1440px. The original photograph loads within its rounded frame, alt text names the owner, and the name/signature remain. [Four WCAG A/AA scans](portrait-transparency-accessibility.json) cover About in both themes with zero violations. Local checks do not verify the external Vercel deployment or real owner login.

## Previews

- [Portrait desktop](owner-portrait-1440.png) · [Portrait phone](owner-portrait-390.png)
- [Transparent collection desktop](home-collection-loop-1440.png) · [Transparent collection phone](home-collection-loop-390.png)
``````

## docs/PRESENTATION_UPDATE.md

``````md
# Theme-matched contact and curated website gallery

The contact panel previously forced light colors even on the dark website. It now uses warm charcoal, ivory typography and champagne accents in dark mode, and warm ivory with ink text in light mode. Inputs, optional company/service fields, privacy links, focus rings, validation errors, success feedback and social links follow the panel palette. Contact submission, consent and the private inbox behavior are unchanged.

The selected website projects now use a wider editorial gallery instead of equal nested cards. Desktop alternates seven/five-column previews with staggered placement; tablets keep a balanced two-column view and phones use one clear column. Titles and industry information sit above the mockups, with discreet numbering, format labels and a project-open capsule. Desktop/mobile device compositions, image galleries, project order, concept disclosures, four category filters and the separate curved work wall remain. Responsive image sizes were updated for the larger previews. No image source, library or dependency was added.

## Review captures

- [Desktop gallery, dark](curated-work-desktop-dark.png) / [light](curated-work-desktop-light.png)
- [Mobile gallery, dark](curated-work-mobile-dark.png) / [light](curated-work-mobile-light.png)
- [Desktop contact, dark](contact-desktop-dark.png) / [light](contact-desktop-light.png)
- [Mobile contact, dark](contact-mobile-dark.png) / [light](contact-mobile-light.png)

Gallery captures show the complete section with reduced motion selected; fixed navigation is excluded from these stitched section-only screenshots. This does not change navigation behavior in the app.

## Validation

The optimized production build, lint and TypeScript checks passed. Existing motion/responsive browser checks passed at 360, 390, 768, 1024, 1440 and 1920px, both themes, including category filtering, no overflow, motion preferences, native touch scroll, on-demand AI demos, form validation/honeypot, no-JavaScript content and zero page/hydration errors. The separate interaction suite passed gallery/certificate dialogs, velocity marquees, desktop parallax and native/enhanced FAQ behavior.

Actual axe WCAG A/AA scans found zero violations on desktop/mobile in both themes, including after triggering contact validation. Contact theme colors were checked in the browser. Lighthouse was not rerun for this visual follow-up; earlier scores describe earlier builds. No production credentials, hosting variables, owner accounts or authenticator settings were changed. Live deployment remains unverified; the reported production-build failure still requires its terminating log line.
``````

## docs/PURPLE_VIDEO_UPDATE.md

``````md
# Purple UI and local showcase videos

Playback, loading and navigation were later revised at the owner’s request: see [the latest update](READY_PLAYBACK_UPDATE.md). The palette and preserved custom artwork remain.

The Work and AI Bots sections were located by searching the existing headings and rendering components: `components/work.tsx` and `components/bot-services.tsx`. The App Router layout imports the CSS cascade; Tailwind colors and the inline theme bootstrap were inspected before editing.

The custom curved “bunch of work” wall, its photos/order, lower custom layouts, website concepts, device geometry, illustrations and project gallery interactions are preserved. Illustration and device colors were extracted unchanged into a separate artwork palette. Shared portfolio UI uses the requested purple palette. Toolkit brand marks retain their shapes and use neutral text color so they do not introduce extra UI accents. Existing saved light/dark choices and the dark default remain.

## Video behavior

- `WorkShowcaseVideo`: before the Work filters/cards; full-width `max-w-6xl`, rounded 3xl, 16:9. Muted, looping, inline, no preload. Plays at 40% visibility, pauses out of view or when the tab is hidden. A pause/play control is available. Caption: “A look at the concept websites, in motion.”
- `AiBotVideo`: below the AI Bots heading, above the demos. Muted, inline, no preload, no loop. Starts at 50% visibility, pauses out of view and completes only once. A bottom-right Replay button appears at the end. Manual pause can be resumed. Caption: “A customer asks. The bot answers. Instantly.”
- Below 768px, or with OS reduced motion or the website Motion Off choice, the video element is absent: only the optimized poster is rendered. WebM precedes MP4 on eligible desktop screens. No video requests occur on mobile/reduced-motion pages. No external player or new library was added.
- Uploaded names were reversed relative to their visible content: `Ai bot video.mp4` contains website concepts and supplies Work; `website video.mp4` contains the customer/bot conversation and supplies AI Bots. Local exports are 1280×720, audio-free H.264/VP9, with WebP posters; all six assets total about 3.3 MB.

The consent, optional embed permission, Botpress configuration and authentication/backend logic are untouched.

## Completed pending presentation changes

The previous Wall of Love carousel/invitation is replaced by a responsive four-column Testimonials grid (two columns on tablets, one on mobile), with dark cards matching the supplied reference. Where genuine approved reviews are absent, four design samples are explicitly labeled as samples, not client endorsements. Published, permission-confirmed CMS reviews replace the samples; the permission filter is unchanged.

Fresh visitors get Motion On, with On/Off controls and saved Off respected. The general Motion On choice does not override the videos’ separate OS reduced-motion restriction. Existing logo flipping/shine, reading emphasis, marquees and custom wall motion remain.

## Final theme tokens

Source: `data/theme-tokens.json`. `npm run build` first regenerates CSS and the original logo geometry/favicon with the shared colors. Tailwind, metadata, OG image and global error colors use the same palette. Legacy `--gold`/champagne aliases resolve to purple; they are not another accent. Large headlines and decorative gradients remain neutral. Purple is limited to controls, links, focus/active states and small highlights. Custom project artwork is content and retains its original palette, as requested.

| Token | Dark | Light |
| --- | --- | --- |
| Background | `#0A0A0F` | `#FAFAFC` |
| Surface | `#14141C` | `#FFFFFF` |
| Border | `#262633` | `#E6E4EE` |
| Text | `#F5F3FF` | `#0A0A0F` |
| Muted text | `#A09CB5` | `#6B6880` |
| Accent | `#8B5CF6` | `#7C3AED` |
| Accent hover | `#A78BFA` | `#6D28D9` |
| Accent soft | `rgba(139,92,246,0.12)` | `rgba(124,58,237,0.08)` |

Dark-theme links use the lighter accent token. Dark primary buttons use dark text; light primary buttons use white text. The tested core text/surface/button pairs are at least 4.66:1. See [contrast and scan results](purple-accessibility.json). Automated Chromium WCAG A/AA scans found zero violations at 390px and 1440px in each theme; this is not a full accessibility certification.

## Verification

Lint, TypeScript and the production build passed. Local browser checks cover native media loading/play/pause/once/replay, manual resume, reduced motion, mobile poster-only behavior, default On/manual Off persistence, six viewport widths (360–1920px), both themes, project categories/dialogs, custom logo/reading motion, certificate dialogs, FAQ and no-JavaScript public text. Consent and login unit checks passed. No fresh Lighthouse or physical-device frame-rate claim is made.

Media/custom wall captures: [Work video](purple-work-video.png), [AI video](purple-ai-video.png), [preserved curved wall](purple-preserved-work-wall.png).

Screenshots: [dark hero](purple-hero-dark.png), [light hero](purple-hero-light.png), [dark testimonials](purple-testimonials-dark.png), [light testimonials](purple-testimonials-light.png), [mobile dark](purple-testimonials-mobile-dark.png), [mobile light](purple-testimonials-mobile-light.png), [dark contact](purple-contact-dark.png), [light contact](purple-contact-light.png).

The supplied production log identifies an existing first-owner credential validation blocker: `ADMIN_PASSWORD needs a symbol`. No credential was viewed or overwritten, and that validation was not weakened. A passing local public build does not establish a successful Vercel production deployment or owner login. No callable Vercel account-management tools are available in this session.

## Every changed file

The list below includes source, media, verification artifacts and refreshed delivery snapshots. Generated source snapshots contain the same implementation; private runtime files are excluded.

<!-- FILE_LIST -->

- [`README.md`](../README.md)
- [`VERIFICATION.md`](../VERIFICATION.md)
- [`app/admin/admin.css`](../app/admin/admin.css)
- [`app/agency.css`](../app/agency.css)
- [`app/atelier.css`](../app/atelier.css)
- [`app/bots.css`](../app/bots.css)
- [`app/devices.css`](../app/devices.css)
- [`app/editorial.css`](../app/editorial.css)
- [`app/finishing.css`](../app/finishing.css)
- [`app/global-error.tsx`](../app/global-error.tsx)
- [`app/globals.css`](../app/globals.css)
- [`app/icon.svg`](../app/icon.svg)
- [`app/layout.tsx`](../app/layout.tsx)
- [`app/opengraph-image.tsx`](../app/opengraph-image.tsx)
- [`app/page.tsx`](../app/page.tsx)
- [`app/premium.css`](../app/premium.css)
- [`app/profile.css`](../app/profile.css)
- [`app/project-art-tokens.css`](../app/project-art-tokens.css)
- [`app/reference-motion.css`](../app/reference-motion.css)
- [`app/reference.css`](../app/reference.css)
- [`app/refinement.css`](../app/refinement.css)
- [`app/showcase.css`](../app/showcase.css)
- [`app/studio.css`](../app/studio.css)
- [`app/theme-tokens.css`](../app/theme-tokens.css)
- [`components/AiBotVideo.tsx`](../components/AiBotVideo.tsx)
- [`components/VisibilityVideo.tsx`](../components/VisibilityVideo.tsx)
- [`components/WorkShowcaseVideo.tsx`](../components/WorkShowcaseVideo.tsx)
- [`components/bot-services.tsx`](../components/bot-services.tsx)
- [`components/concept-site.tsx`](../components/concept-site.tsx)
- [`components/demo-site.tsx`](../components/demo-site.tsx)
- [`components/motion-preference.tsx`](../components/motion-preference.tsx)
- [`components/motion-provider.tsx`](../components/motion-provider.tsx)
- [`components/testimonials.tsx`](../components/testimonials.tsx)
- [`components/tool-mark.tsx`](../components/tool-mark.tsx)
- Removed `components/wall-of-love.tsx` (replaced by the Testimonials grid).
- [`components/work.tsx`](../components/work.tsx)
- [`data/project-art-colors.json`](../data/project-art-colors.json)
- [`data/studio.ts`](../data/studio.ts)
- [`data/theme-tokens.json`](../data/theme-tokens.json)
- [`data/tool-marks.ts`](../data/tool-marks.ts)
- [`delivery/01-root.md`](../delivery/01-root.md)
- [`delivery/02-app.md`](../delivery/02-app.md)
- [`delivery/03-components.md`](../delivery/03-components.md)
- [`delivery/04-data.md`](../delivery/04-data.md)
- [`delivery/05-docs.md`](../delivery/05-docs.md)
- [`delivery/09-public.md`](../delivery/09-public.md)
- [`delivery/10-scripts.md`](../delivery/10-scripts.md)
- [`delivery/11-tests.md`](../delivery/11-tests.md)
- [`delivery/README.md`](../delivery/README.md)
- [`docs/PURPLE_VIDEO_UPDATE.md`](../docs/PURPLE_VIDEO_UPDATE.md)
- [`docs/purple-accessibility.json`](../docs/purple-accessibility.json)
- [`docs/purple-ai-video.png`](../docs/purple-ai-video.png)
- [`docs/purple-contact-dark.png`](../docs/purple-contact-dark.png)
- [`docs/purple-contact-light.png`](../docs/purple-contact-light.png)
- [`docs/purple-hero-dark.png`](../docs/purple-hero-dark.png)
- [`docs/purple-hero-light.png`](../docs/purple-hero-light.png)
- [`docs/purple-preserved-work-wall.png`](../docs/purple-preserved-work-wall.png)
- [`docs/purple-testimonials-dark.png`](../docs/purple-testimonials-dark.png)
- [`docs/purple-testimonials-light.png`](../docs/purple-testimonials-light.png)
- [`docs/purple-testimonials-mobile-dark.png`](../docs/purple-testimonials-mobile-dark.png)
- [`docs/purple-testimonials-mobile-light.png`](../docs/purple-testimonials-mobile-light.png)
- [`docs/purple-work-video.png`](../docs/purple-work-video.png)
- [`package.json`](../package.json)
- [`public/elvora-logo.svg`](../public/elvora-logo.svg)
- [`public/videos/ai-bot-poster.webp`](../public/videos/ai-bot-poster.webp)
- [`public/videos/ai-bot.mp4`](../public/videos/ai-bot.mp4)
- [`public/videos/ai-bot.webm`](../public/videos/ai-bot.webm)
- [`public/videos/work-showcase-poster.webp`](../public/videos/work-showcase-poster.webp)
- [`public/videos/work-showcase.mp4`](../public/videos/work-showcase.mp4)
- [`public/videos/work-showcase.webm`](../public/videos/work-showcase.webm)
- [`scripts/generate-theme-assets.mjs`](../scripts/generate-theme-assets.mjs)
- [`tailwind.config.ts`](../tailwind.config.ts)
- [`tests/editorial-motion.browser.mjs`](../tests/editorial-motion.browser.mjs)
- [`tests/review-motion.browser.mjs`](../tests/review-motion.browser.mjs)
- [`tests/showcase-videos.browser.mjs`](../tests/showcase-videos.browser.mjs)
- [`tests/video-motion.browser.mjs`](../tests/video-motion.browser.mjs)
``````

## docs/READY_PLAYBACK_UPDATE.md

``````md
# Full-width playback, interactive windows and a ready page

This update follows the owner's four new references and their explicit choice: both desktop and phone should loop the videos, with the website's Motion Off setting stopping playback.

## Playback and presentation

Both local videos now loop silently on desktop and mobile. The frames extend across the page with small viewport gutters and `object-fit: cover`, preserving the footage's proportions. Native controls and the separate playback/replay toolbar are removed. The global Motion setting controls both videos; Off pauses them and shows their posters. Videos buffer on page load, pause outside the visible area and in hidden tabs, and retry browser-restricted autoplay after a real user interaction.

Desktop keeps 1280×720/30fps exports. Phones select 854×480/24fps WebM or MP4 copies through source media queries. The actual selected dimensions and loop wrap were tested in Chromium, including OS reduced-motion configurations: the explicitly requested website Motion On setting takes precedence. The two mobile WebM files total about 0.8 MB, roughly 43% less than their desktop counterparts. No audio track or player dependency was added.

A sample website card opens its actual interactive website inside the supplied desktop/window composition. The frame has independently scrolling content, functional maximize/restore and Back to website controls, plus a dock linking the four concepts and the portfolio. Screenshot viewing remains available through a separate button. The original concept layouts, artwork, colors and sample forms are preserved; this is not an embedded screenshot or cross-origin iframe.

The UI/interface-studies category and its six-card block are removed from Work. The remaining tabs are All, Website concepts and AI chatbots & demos. The curved photo wall, its 54 tiles, original artwork, order and linked study routes remain available.

## Loading and motion

The initial HTML contains both website and AI cards. Filters change visibility while keeping content mounted. Gallery, certificate, chat-panel and FAQ interface code is available before interaction; external providers still require the existing consent/user-action gates. Public images load eagerly with low scheduling priority, and the concept routes and matching hero image resources warm before a card click.

Generic content no longer waits for a viewport reveal to become readable. Logo flipping, progressive reading emphasis, the curved wall and small interaction effects remain. Offscreen motion pauses, desktop wheel smoothing responds sooner, and the wall's scroll drift moves one composited cylinder instead of changing an inherited variable across all tiles. This preserves the original geometry while reducing style work. A tablet video-width overflow and sticky mobile dock hover were fixed during verification.

## Measured local loading behavior

| Check | Before | After |
| --- | --- | --- |
| Images ready before scrolling | 4 / 73–74 | 67 / 67 |
| Image requests beginning during scroll | 33 desktop / 34 mobile | 0 / 0 |
| Component script requests beginning during scroll | 1 / 1 | 0 / 0 |

The image count changed because the separate six-card studies block was removed. Media range/stream requests are counted separately and can continue normally. [Raw before/after observations](ready-scroll-results.json) include frame/long-task timings. These are single local headless runs, not a physical-device or steady-60fps guarantee; mobile's baseline used posters, whereas this update enables the requested loops. The loading regression asserts that every page image is ready before scrolling and that scrolling starts no image or component-script requests.

## Verification

- Production build, lint and TypeScript passed.
- Desktop/phone native video tests passed loop wrap, no controls, cover sizing, correct responsive sources, global Off/On, offscreen pause and consent boundaries, with and without OS reduced motion.
- Four concept websites passed direct card navigation, window scrolling, maximize/Escape/restore, Back, sample form submission/reset and overflow checks at 1440px and 390px. The retained study route also passed.
- Responsive checks passed at 360, 390, 768, 1024, 1440 and 1920px in both themes, including filtering, persistent settings, contact validation and no-JavaScript public content.
- Screenshot/certificate dialogs, FAQ reversal/keyboard behavior, logo flip/shine, reading effects and Motion Off cleanup passed. All 54 wall tiles remain; the optimized transform and cleanup are checked.
- Five consent unit tests passed. Optional provider requests remain absent before permission/action.
- Automated WCAG A/AA scans found zero violations in the public portfolio and new window chrome at desktop/mobile sizes in both themes. Original concept artwork was excluded from the window-chrome scan. [Scan records](ready-accessibility.json).

```sh
npm run build
npm start -- --port 3008
# Run in another terminal after the local production server is ready:
npm run test:showcase:browser
npm run test:windows:browser
npm run test:scroll:browser
npm run test:motion:browser
npm run test:finishing:browser
npm run test:video-motion:browser
```

Previews: [wide desktop video](ready-video-1440.png), [phone video](ready-video-390.png), [desktop concept window](ready-demo-window.png), [phone concept window](ready-demo-mobile.png).

Authentication, credentials, CMS records, cookie logic and Botpress settings were not changed. Actual production deployment/provider/owner-login success is not established by these local tests. This environment's public-domain check encountered DNS/HTTP proxy restrictions; no hosting/DNS failure is inferred from that result.

## Changed source

- `components/VisibilityVideo.tsx`, `WorkShowcaseVideo.tsx`, `AiBotVideo.tsx`: responsive, control-free loops.
- `components/work.tsx`, `project-card.tsx`, `bot-services.tsx`, `certifications.tsx`: ready content, retained filters/dialogs, removed category and direct website navigation.
- `components/demo-window.tsx`, `app/demo-window.css`, `app/demo/[slug]/page.tsx`, `app/studies/[slug]/page.tsx`: real interactive window presentation.
- `components/reveal-observer.tsx`, `faq-enhancement.tsx`, `editorial-effects.tsx`, `logo-motion.tsx`, `scroll-ambience.tsx`, `work-bunch.tsx`, `app/agency.css`, `app/refinement.css`, `app/atelier.css`: readable initial content and lighter motion/loading behavior.
- `public/videos/*-mobile.mp4` and `*-mobile.webm`: four phone-optimized exports.
- `tests/showcase-videos.browser.mjs`, `demo-windows.browser.mjs`, `scroll-readiness.browser.mjs`, `editorial-motion.browser.mjs`, `finishing.browser.mjs` and `package.json`: updated behavior checks and reproducible commands.
- This report, screenshots/JSON, README, verification notes and the refreshed `delivery/` source snapshot document the completed change.
``````

## docs/RESTORED_HOMEPAGE.md

``````md
# Restored footer and subject-page context

## Restored design

The original footer is restored on all public subject pages: invitation, quick links, direct contact, oversized Elvora wordmark, waves, animated emblem, social links and legal controls. Its markup matches the pre-categorization design; only links were adapted to actual routes and its logo loads eagerly. The compact replacement is removed.

Existing project artwork, device models, photo-wall order/geometry, looping videos, screenshot galleries, contact form, consent and Botpress behavior remain.

## Content belongs with its subject

- `/ai-websites`: website concepts and their galleries, followed by the original **How I Build Websites** workflow, including the custom-trained AI explanation.
- `/ai-bots`: bot demos, **How I Build Bots** (purpose, knowledge, conversation, integration, testing), then the original **How I Embed Bots** methods with their example code, trade-offs and usage notes.
- Website and bot section navigation uses local anchors. Process content does not sit behind a separate page or a profile/skills tab.
- About tabs retain About Me, My Journey, Technical Domains, Skills & Tools and Certificates.
- `/how-i-build` redirects to `/ai-websites#workflow`; `/ai-bots/how-i-embed-bots` redirects to `/ai-bots#embed-methods`. Old homepage hashes remain useful. The sitemap includes the eleven actual subject pages.

## Homepage presentation

The homepage has a clearer explanation of Elvora's purpose and the human direction behind the work. A centered introduction and original flipping logo lead into a purpose statement, then large visual previews for websites, bots and the collection. A smaller row links to About, Testimonials and Contact.

Its monochrome palette is scoped to `.route-home` and uses the existing neutral tokens: black/graphite in dark mode and white/gray in light mode. It retains the theme toggle and the original colored logo/project artwork. Inner pages keep their existing custom theme and layouts.

## Verification

- Production build, ESLint and TypeScript pass.
- Subject-page browser checks: eleven routes, restored full footer, processes beneath their parent content, same-page anchors, old URL redirects, canonical metadata, sitemap, keyboard menus, saved Motion Off, native mobile 3D and server-rendered/no-JavaScript content.
- Six widths from 360 to 1920px, both themes: no horizontal overflow; theme and motion controls remain functional.
- Both native video loops, desktop/mobile source selection, Off/On and offscreen pause pass, including when the OS requests reduced motion and the website is explicitly On.
- Project/certificate dialogs, FAQ keyboard/reversal/no-JavaScript behavior, original logo flip/shine and reversible reading emphasis pass.
- [Accessibility scans](restored-accessibility.json) cover home, websites and bots, in both themes at 390/1440px. These include the restored footer and process content.
- [Loading observations](restored-scroll-readiness.json) cover home, websites and the collection, with images ready before scrolling. Headless observations do not guarantee physical-device FPS.

No credentials or hosting settings were changed. A Git push is distinct from a confirmed Vercel deployment; live deployment status remains unverified here.

## Previews

- [Light desktop homepage](restored-home-light-1440.png) · [Dark desktop homepage](restored-home-dark-1440.png)
- [Light mobile homepage](restored-home-light-390.png) · [Dark mobile homepage](restored-home-dark-390.png)
- [Restored desktop footer](restored-footer-1440.png) · [Restored mobile footer](restored-footer-390.png)
``````

## docs/SEO_COPY_AND_PAGESPEED_REVIEW.md

``````md
# Service copy and PageSpeed review — 18 October 2026

## Authorized scope

The owner wants to sell custom websites and website chatbots to international clients. A chatbot should be explained as answering questions using the client's own business information. This update changes basic homepage wording and the homepage, Websites and AI Bots search metadata. The owner requested an explanation of the supplied PageSpeed findings, without implementing performance changes.

No CSS, layouts, artwork, media assets, animations, navigation paths, cookie/consent logic, Botpress configuration, chat handling or private settings are changed. No ranking, visitor numbers or client acquisition results are promised.

## Search metadata

| Page        | Title                                                | Description                                                                                                                                                |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`         | Web Design & Development by Abdul Hafeez \| Elvora   | We build custom websites and AI assistant bots for your business. Our bots answer customer questions using your own business information.                  |
| `/websites` | Web Design & Development Services \| Elvora          | Custom website design and development for businesses worldwide. Clear service pages, mobile-friendly layouts and simple ways for customers to contact you. |
| `/ai-bots`  | Custom AI Chatbot Integration for Websites \| Elvora | AI chatbot integration for your website, using your business information. Help customers find answers about your products, services and policies.          |

The service pages retain their short navigation labels, routes, canonical URLs and content. The descriptive service titles also feed their Open Graph and Twitter metadata. The homepage uses the existing file/CMS identity boundary: these are the file-mode defaults; explicitly configured database identity values remain authoritative.

## Visible homepage copy

The main heading is now **Custom websites. Helpful AI chatbots.** The introduction states directly: **We build custom websites and AI assistant bots for businesses worldwide.** The supporting text explains the intended customer journey: understand the service, find answers and contact the business. The homepage description uses the same direct service language in place of portfolio/concept positioning.

The purpose section explains enquiries in ordinary terms: asking a question, requesting a quote or contacting the business. The Websites and AI Bots cards state the services directly. The chatbot card explains that the assistant is added to a website and uses the business's own information, replacing the unexplained terms “ground” and “embed.” The work remains accurately described as concept websites.

## Supplied PageSpeed measurement

Source: the owner's pasted Lighthouse report, captured **18 October 2026 at 22:50 Asia/Karachi**, emulated Moto G Power, slow 4G, Lighthouse 13.5.0. These are results from a single simulated load, not real-user Core Web Vitals or a new measurement of this commit. The pasted report does not include an overall performance score.

| Metric                   | Supplied result | Interpretation                                                          |
| ------------------------ | --------------- | ----------------------------------------------------------------------- |
| First Contentful Paint   | 1.1 s           | Content appears quickly in this run.                                    |
| Largest Contentful Paint | 2.9 s           | Improve toward 2.5 s or less; this result needs improvement.            |
| Total Blocking Time      | 20 ms           | Low blocking in this run.                                               |
| Cumulative Layout Shift  | 0               | No layout movement measured.                                            |
| Speed Index              | 2.8 s           | Useful lab context; not a separate ranking promise or real-user result. |

## Recommended performance work, not implemented

1. **Reduce video transfer first.** The total payload is 9,963 KiB, approximately 9.7 MiB. The report lists desktop/mobile WebM and MP4 variants for the homepage videos in the same capture. Investigate why multiple variants are fetched, select only the needed source for each device/codec, preserve the purple fallback on browsers without video alpha support, and avoid downloading below-the-fold video before it is useful. Visible loops, mobile playback, Motion Off and the original artwork must remain functional. The report establishes the downloads; it does not establish the exact cause of every duplicate request.
2. **Size posters for their displayed dimensions.** Estimated image savings are 101.1 KiB. The collection poster alone is 92.2 KiB at 1280×720 for a displayed size near 637×358, with estimated savings of 69.4 KiB. Deliver smaller responsive poster variants without losing transparency or rounded framing. The website and chatbot posters have estimated savings of 16.9 and 14.7 KiB.
3. **Investigate document response time.** The observed response is 654 ms, with an estimated 550 ms opportunity. Check public page rendering, data loading and hosting latency before choosing a change. The report already passes redirect avoidance and text compression. Do not blindly cache personalized pages or HTML containing per-request security nonces.
4. **Check the hero logo's fetch priority.** Lighthouse identifies a hero emblem image as LCP and asks for `fetchpriority="high"`. The current component renders front and back copies; the front already has Next Image `priority`, while the back does not. Confirm which face is measured in the live HTML before changing priority or preloading both copies.
5. **Treat small CSS/JavaScript findings as later work.** Unused CSS is estimated at 20 KiB; legacy JavaScript at 11.5 KiB. There is a 38 ms unattributed reflow and one 85 ms long task. Profile the responsible code before changing animations or removing browser support. The existing low blocking time and zero layout shift do not justify a broad rewrite.

The owner should authorize a separate performance pass before these behavior changes. Rerun the same mobile audit afterward; this copy-only update does not claim to reduce payload or improve measured scores. Search titles and descriptions can change after deployment and recrawling; Google may rewrite search snippets and ranking is not guaranteed.

## Changed source files

- `data/site.ts`: homepage metadata, service introduction and hero text.
- `data/navigation.ts`: the two service-page metadata descriptions.
- `lib/page-metadata.ts`: descriptive service-page titles.
- `components/home-directory.tsx`: purpose and service-card wording, About/contact descriptions.
- `tests/pages.browser.mjs`, `tests/editorial-motion.browser.mjs`: replace assertions tied to the superseded homepage text.

Documentation and the existing source review package are refreshed with this change.

## Local verification

- `npm run lint`: passed with zero warnings.
- `CONTENT_SOURCE=files ADMIN_BOOTSTRAP_ON_BUILD=false npm run build`: passed, including TypeScript and static page generation; no private bootstrap was invoked.
- `npm run test:pages:browser`: passed at 390px and 1440px, covering the ten subject pages, real navigation, canonical URLs, both themes, Motion Off, mobile 3D, original collection and server-rendered content/sitemap.
- A separate production browser check verified the exact title, description, Open Graph/Twitter tags, canonical, one H1 and indexability for `/`, `/websites` and `/ai-bots` with JavaScript disabled. It also checked fitting copy in both themes at 390px/1440px, the three original homepage videos, footer, default Motion On, no runtime errors and no optional provider calls before consent.
- Full-page screenshots were inspected: [mobile](seo-home-390.png), [desktop](seo-home-1440.png).

No new Lighthouse score is claimed. Live Vercel deployment and Google's recrawl remain outside these local checks.

## Follow-up: legal pages inheriting the homepage description

The owner supplied a Google result where Cookie Policy displayed the previous homepage portfolio description. The current local production HTML confirmed that `/cookies` inherited the homepage meta/Open Graph description because it defined only a title and canonical. Privacy and Terms had the same omission.

`lib/legal-metadata.ts` now supplies a separate description, social title/description, page URL and canonical for each legal page. `app/cookies/page.tsx`, `app/privacy/page.tsx` and `app/terms/page.tsx` use this helper. The Cookie Policy description is: **How Elvora uses cookies and browser storage, which features are optional, and how to manage your cookie settings.** Policy text, cookie choices, consent behavior and page design are unchanged.

The screenshot alone cannot establish whether the newest source has reached Production. Public-domain and GitHub status requests from this environment are blocked by its outbound proxy before reaching those services. A current successful Production deployment must be confirmed before treating the remaining old Google text as solely a recrawl delay. Google may choose snippets from visible text even after the metadata is corrected.

Follow-up validation passed: lint and a production build, followed by HTTP 200 HTML checks for homepage and all three legal routes. Each has its intended meta/Open Graph/Twitter description, its own canonical and no indexing block; each legal page also has its own Open Graph URL.
``````

## docs/SHOWCASE_UPDATE.md

``````md
# Curved work showcase and website workflow

The supplied second image guides the new presentation: a curved, densely arranged wall of previews with a gentle tilt, soft edge fades and staggered vertical movement. This uses the existing original website and UI-study screenshots. It adds no outside artwork, fictitious clients or new project-count claims.

The wall is CSS 3D, with nine columns and 54 visual tiles reusing the original browser views. Decorative repetition is excluded from screen-reader and keyboard navigation. A clearly labeled index below provides each of the ten unique project/study links once. The heading and exploration link sit above the wall, following the reference composition. Both dark and warm off-white themes inherit their actual background, text and accent tokens.

Motion pauses outside the viewport and while the wall is hovered. The shared Motion Auto/On/Off preference remains functional on desktop and mobile; reduced motion stops the vertical drift while preserving the curved composition. Image sizes are bounded and loading remains lazy. The component uses the existing shared scroll subscriber, removing its separate Framer useScroll subscription. Home first-load JavaScript measured by the build is 169 kB, versus 171 kB in the previous build.

The workflow heading is now **How I Build Websites.** Its five steps have a new editorial layout: a sticky introduction and numbered rows on desktop, with a single readable column on smaller screens. Build & Connect explains using custom-trained AI assistants for selected project tasks, grounded in approved information and with human review. AI is optional to the website process and no longer part of the heading.

Only two reference images were attached to this request; no fourth image was available. The existing light/dark palette is retained while the presentation changes.

Validation: production build, lint and type checking passed. Local production browser checks at 360,390,768,1024,1440,1920px in both themes verified the 3D wall, ten accessible destinations, motion On/Off, five workflow steps, the requested copy and no horizontal overflow. There were no runtime/hydration errors. Scoped axe WCAG A/AA scans passed for the sampled 1440px dark/light and 390px light sections. Actual screenshots are `showcase-*.png` and `workflow-*.png` in this folder. The previous Lighthouse report is retained as historical evidence; it was not rerun for this visual-only follow-up.

Implementation: `components/work-bunch.tsx`, `app/showcase.css`, `components/studio-sections.tsx`, `data/studio.ts`, and the stylesheet import in `app/layout.tsx`.
``````

## docs/VIDEO_MOTION_UPDATE.md

``````md
# Motion from the supplied video

The supplied recording is 19.38 seconds long. It visibly shows a profile card turning through a narrow edge into an About composition, followed by words gaining emphasis in reading order as the page scrolls. It ends around the services introduction; it does not show the reference testimonials. The implementation follows those visible motion ideas in Elvora's existing design rather than copying another person's profile, text or branding.

## Implementation

- **Logo:** the existing Elvora vector now has two correctly oriented faces, hidden reverse surfaces, a full scroll-scrubbed 3D turn and a restrained light sweep. The scroll range accounts for the logo's position on narrow screens, so the flip is visible on mobile too. Shine pauses offscreen; motion Off/OS reduced motion disables the effects.
- **Reading text:** hero introduction, About paragraphs and selected section introductions gain ink emphasis one word at a time, including reverse scrolling. A consistent reading line advances through each paragraph before reaching the next. The base copy remains readable at all times. An absolutely positioned ink layer changes opacity/translation without changing font widths or moving the lines. Screen readers get one complete copy, and text remains available without JavaScript.
- **Small interactions:** service icons and detail/contact arrows gain short, restrained transform feedback. Existing magnetic buttons, reveal timings, velocity marquees and theme-aware presentation remain.
- **Reviews:** published reviews use larger editorial quotes, softly angled adjacent cards, word-staggered entry, progress, previous/next and touch swipe. Autoplay pauses on hover, focus, offscreen, hidden document and reduced motion. Pausing preserves the remaining interval. Manual navigation stops autoplay; single-review controls are disabled. Only one active slide is exposed to assistive technology.
- **No reviews supplied:** the public file-backed page displays a clearly worded invitation state instead of fabricated client names or endorsements. Existing CMS permission/publication filters remain. The animated carousel is checked with explicit local QA records in a separate loopback-only component harness; those records are never added to application data or a public fixture route.

## Files

`components/logo-motion.tsx`, `hero-emblem.tsx`, `reading-text.tsx`, `reading-effects.tsx`, `hero.tsx`, `experience.tsx`, `studio-sections.tsx`, `wall-of-love.tsx`, `app/reference-motion.css` and the page/layout composition. The existing shared scroll stream handles both new effects; there is no additional global scroll listener or animation dependency.

## Checks

Production build, lint and TypeScript checks passed. Browser regressions passed logo faces/shine, desktop and touch flip timing, forward/reverse reading order, stable word widths, reduced-motion cleanup, no-JavaScript copy, honest review state and actual carousel controls/autoplay/swipe/OS reduced motion with QA-only records. Existing responsive, theme, consent and form checks passed at 360, 390, 768, 1024, 1440 and 1920px; gallery and FAQ checks also passed. Desktop/mobile axe scans in both themes found zero WCAG A/AA violations. See the newest entry in [verification](../VERIFICATION.md).

[Logo front and shine](logo-front.png) / [logo after scrolling](logo-flipped.png). [Reading emphasis, desktop light](reading-desktop-light.png) / [desktop dark](reading-desktop-dark.png) / [mobile light](reading-mobile-light.png) / [mobile dark](reading-mobile-dark.png). [Public review invitation, desktop dark](reviews-empty-desktop-dark.png) / [desktop light](reviews-empty-desktop-light.png) / [mobile dark](reviews-empty-mobile-dark.png) / [mobile light](reviews-empty-mobile-light.png). These captures show the actual public page; they do not substitute QA records for genuine testimonials.

```sh
npm run build
npm start -- --port 3008
# Separate terminal, after the local production server is ready:
npm run test:video-motion:browser
npm run test:motion:browser
npm run test:finishing:browser
# Independent local component harness, no database/provider needed:
npm run test:reviews:browser
```

These are local checks, not proof of physical-device 60fps, a fresh Lighthouse score, a working live owner account or successful Vercel production deployment. No credentials, database records or authenticator settings were changed.
``````

## docs/WEBSITES_TESTIMONIALS.md

``````md
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
``````

## docs/about-preview.png

Binary asset: 701410 bytes. SHA-256 `33c5edb3c85019d356f3a28d62f1e9c7e92f16e4bc07ae21adc08572118f030e`. Available in the repository and source ZIP.

## docs/agency-about-desktop.png

Binary asset: 261585 bytes. SHA-256 `5a6e147dd9735dc3da818ae4e85a58279a14d55b684141a8d9f7e9b7bcd8517d`. Available in the repository and source ZIP.

## docs/agency-about-mobile.png

Binary asset: 150570 bytes. SHA-256 `99c66fa7f0ded0f35a0068aab5d7c858295a99731340d3cd5c8c288959d16e74`. Available in the repository and source ZIP.

## docs/agency-admin-dashboard-desktop.png

Binary asset: 48632 bytes. SHA-256 `fd49da33f939be6df7c60833641a5f470f4d814bb895cf449cc0eb137eb869ba`. Available in the repository and source ZIP.

## docs/agency-admin-dashboard-mobile.png

Binary asset: 30293 bytes. SHA-256 `ace34bd6ae8a3f00ba1b4265e60d7c5e8aee67c64b8c5bcb9bdf596954a21b19`. Available in the repository and source ZIP.

## docs/agency-admin-inbox-desktop.png

Binary asset: 64708 bytes. SHA-256 `d6b39dd9749edebf8af1c4419479cd09dce2dd154c95104f5aab347b225498ff`. Available in the repository and source ZIP.

## docs/agency-admin-inbox-mobile.png

Binary asset: 45508 bytes. SHA-256 `41e0e7c52704f693b7ad72068bd6d56af280305dabff64195202948268e48592`. Available in the repository and source ZIP.

## docs/agency-contact-desktop.png

Binary asset: 770332 bytes. SHA-256 `3ba47b6b6053d56ce1607cc9a75bb395d05326ab39016ca8000d7667c11c70fb`. Available in the repository and source ZIP.

## docs/agency-contact-mobile.png

Binary asset: 427446 bytes. SHA-256 `86faeae554d3194f83ff342f64d8b178eb790ecd7ea1ca9bde8e457e6508f006`. Available in the repository and source ZIP.

## docs/agency-faq-desktop.png

Binary asset: 71833 bytes. SHA-256 `d0a60439618ede50a619f54c50424e8e15b8726d710e002088851331f304a960`. Available in the repository and source ZIP.

## docs/agency-faq-mobile.png

Binary asset: 51502 bytes. SHA-256 `e7f39d42eb54c62eea24bc07817f226671bce3d1078cde69c9218d3904b50f75`. Available in the repository and source ZIP.

## docs/agency-home-desktop.png

Binary asset: 310755 bytes. SHA-256 `f04625a63c7e7eec3ef96e71101ea24706aa46c8ebfec9473f296b427fc8da80`. Available in the repository and source ZIP.

## docs/agency-home-mobile.png

Binary asset: 93592 bytes. SHA-256 `00961c2ce87307f85258f5c9abf5ea17c10e02595b73229c5de02719d67a70e8`. Available in the repository and source ZIP.

## docs/agency-performance.json

``````json
{
  "source": "Local production build, explicit file content mode, fresh mobile-emulated Lighthouse run; no simultaneous captures/tests. Not a live deployment guarantee.",
  "date": "17 October 2026",
  "fetchTime": "2026-10-17T08:25:46.463Z",
  "lighthouseVersion": "13.5.0",
  "scores": {
    "performance": 92,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100
  },
  "metrics": {
    "first-contentful-paint": {
      "value": 1211.353,
      "display": "1.2 s"
    },
    "largest-contentful-paint": {
      "value": 3265.3677500000003,
      "display": "3.3 s"
    },
    "total-blocking-time": {
      "value": 17.5,
      "display": "20 ms"
    },
    "cumulative-layout-shift": {
      "value": 0,
      "display": "0"
    },
    "speed-index": {
      "value": 1211.353,
      "display": "1.2 s"
    }
  },
  "settings": {
    "formFactor": "mobile",
    "throttlingMethod": "simulate",
    "throttling": {
      "rttMs": 150,
      "throughputKbps": 1638.4,
      "requestLatencyMs": 562.5,
      "downloadThroughputKbps": 1474.5600000000002,
      "uploadThroughputKbps": 675,
      "cpuSlowdownMultiplier": 4
    },
    "screenEmulation": {
      "mobile": true,
      "width": 412,
      "height": 823,
      "deviceScaleFactor": 1.75,
      "disabled": false
    }
  },
  "limitations": [
    "Public hosting, actual provider services and physical devices were not audited.",
    "LCP is 3.3 seconds in this simulated mobile run; scores vary with host, CPU and network.",
    "Dependency security is a separate audit in SECURITY_STATUS.md."
  ]
}
``````

## docs/agency-project-desktop.png

Binary asset: 2009711 bytes. SHA-256 `d59af0835d6eec0f5b70e8a89698e660d984df00313dfa40b308aa8a5fc36551`. Available in the repository and source ZIP.

## docs/agency-project-mobile.png

Binary asset: 597787 bytes. SHA-256 `557d174f09482c8505bc755624b14b04c1d6d9dab4053e6c20f04a5063dfe418`. Available in the repository and source ZIP.

## docs/agency-service-desktop.png

Binary asset: 926485 bytes. SHA-256 `911a4e65624761b5e22ceee7e2f210b5c80e0a048ab0ada7ffa8169e4d316998`. Available in the repository and source ZIP.

## docs/agency-service-mobile.png

Binary asset: 442708 bytes. SHA-256 `7ecfe21f591ca291ea8e30ffddcdd0c187f6a06aaccc51b13309e914128e0c5d`. Available in the repository and source ZIP.

## docs/apple-hig-browser-results.json

``````json
[
  {
    "width": 320,
    "theme": "dark",
    "touch": true,
    "send": {
      "width": 44,
      "height": 44,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(10, 10, 15)",
      "fontSize": "14px"
    },
    "field": {
      "width": 221,
      "height": 61.1875,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(167, 139, 250)",
      "fontSize": "16px"
    },
    "appearance": {
      "background": "rgb(10, 10, 15)",
      "blur": "none",
      "border": "rgb(160, 156, 181)",
      "solid": "rgb(10, 10, 15)",
      "muted": "#A09CB5",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 320,
    "theme": "light",
    "touch": true,
    "send": {
      "width": 44,
      "height": 44,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(255, 255, 255)",
      "fontSize": "14px"
    },
    "field": {
      "width": 221,
      "height": 61.1875,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(124, 58, 237)",
      "fontSize": "16px"
    },
    "appearance": {
      "background": "rgb(250, 250, 252)",
      "blur": "none",
      "border": "rgb(107, 104, 128)",
      "solid": "rgb(250, 250, 252)",
      "muted": "#6B6880",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 390,
    "theme": "dark",
    "touch": true,
    "send": {
      "width": 44,
      "height": 44,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(10, 10, 15)",
      "fontSize": "14px"
    },
    "field": {
      "width": 291,
      "height": 61.1875,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(167, 139, 250)",
      "fontSize": "16px"
    },
    "appearance": {
      "background": "rgb(10, 10, 15)",
      "blur": "none",
      "border": "rgb(160, 156, 181)",
      "solid": "rgb(10, 10, 15)",
      "muted": "#A09CB5",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 390,
    "theme": "light",
    "touch": true,
    "send": {
      "width": 44,
      "height": 44,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(255, 255, 255)",
      "fontSize": "14px"
    },
    "field": {
      "width": 291,
      "height": 61.1875,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(124, 58, 237)",
      "fontSize": "16px"
    },
    "appearance": {
      "background": "rgb(250, 250, 252)",
      "blur": "none",
      "border": "rgb(107, 104, 128)",
      "solid": "rgb(250, 250, 252)",
      "muted": "#6B6880",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 768,
    "theme": "dark",
    "touch": true,
    "send": {
      "width": 44,
      "height": 44,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(10, 10, 15)",
      "fontSize": "14px"
    },
    "field": {
      "width": 457,
      "height": 54.78125,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(167, 139, 250)",
      "fontSize": "14px"
    },
    "appearance": {
      "background": "rgb(10, 10, 15)",
      "blur": "none",
      "border": "rgb(160, 156, 181)",
      "solid": "rgb(10, 10, 15)",
      "muted": "#A09CB5",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 768,
    "theme": "light",
    "touch": true,
    "send": {
      "width": 44,
      "height": 44,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(255, 255, 255)",
      "fontSize": "14px"
    },
    "field": {
      "width": 457,
      "height": 54.78125,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(124, 58, 237)",
      "fontSize": "14px"
    },
    "appearance": {
      "background": "rgb(250, 250, 252)",
      "blur": "none",
      "border": "rgb(107, 104, 128)",
      "solid": "rgb(250, 250, 252)",
      "muted": "#6B6880",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 1440,
    "theme": "dark",
    "touch": false,
    "send": {
      "width": 39,
      "height": 39,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(10, 10, 15)",
      "fontSize": "14px"
    },
    "field": {
      "width": 462,
      "height": 54.78125,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(167, 139, 250)",
      "fontSize": "14px"
    },
    "appearance": {
      "background": "rgb(10, 10, 15)",
      "blur": "none",
      "border": "rgb(160, 156, 181)",
      "solid": "rgb(10, 10, 15)",
      "muted": "#A09CB5",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  },
  {
    "width": 1440,
    "theme": "light",
    "touch": false,
    "send": {
      "width": 39,
      "height": 39,
      "outline": "3px",
      "outlineStyle": "none",
      "outlineColor": "rgb(255, 255, 255)",
      "fontSize": "14px"
    },
    "field": {
      "width": 462,
      "height": 54.78125,
      "outline": "2px",
      "outlineStyle": "solid",
      "outlineColor": "rgb(124, 58, 237)",
      "fontSize": "14px"
    },
    "appearance": {
      "background": "rgb(250, 250, 252)",
      "blur": "none",
      "border": "rgb(107, 104, 128)",
      "solid": "rgb(250, 250, 252)",
      "muted": "#6B6880",
      "transparency": true,
      "contrast": true
    },
    "mockedReply": true,
    "focusRestored": true,
    "pageErrors": []
  }
]
``````

## docs/apple-hig-mobile-chat.png

Binary asset: 38172 bytes. SHA-256 `1f490519fb4f933053df48ef131d04097578385bca7c4689218eaed5366c8a38`. Available in the repository and source ZIP.

## docs/brand-preview.png

Binary asset: 496538 bytes. SHA-256 `5db7c029677108382f5669bc6053b8e60f395d9e26051f23315f539eb67341ff`. Available in the repository and source ZIP.

## docs/brief-performance.json

``````json
{
  "scope": "Local Next.js production build; Lighthouse 13.5.0; simulated mobile; fresh consent banner; not live production",
  "scores": {
    "performance": 93,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100
  },
  "metrics": {
    "first-contentful-paint": {
      "value": 1441.7240000000002,
      "display": "1.4\u00a0s"
    },
    "largest-contentful-paint": {
      "value": 3194.3130136108393,
      "display": "3.2\u00a0s"
    },
    "total-blocking-time": {
      "value": 13.499999999999773,
      "display": "10\u00a0ms"
    },
    "cumulative-layout-shift": {
      "value": 0,
      "display": "0"
    },
    "speed-index": {
      "value": 1743.0526816088236,
      "display": "1.7\u00a0s"
    }
  },
  "productionVerified": false,
  "targets": {
    "performance95": false,
    "lcpBelow2Seconds": false,
    "clsBelow005": true,
    "fieldINPMeasured": false,
    "physicalDevice60fpsMeasured": false
  }
}
``````

## docs/certificate-showcase.png

Binary asset: 288928 bytes. SHA-256 `d953dd4825170428cfc8bd8cfc4cb49f517455fece767fb291e2e48221decc38`. Available in the repository and source ZIP.

## docs/contact-desktop-dark.png

Binary asset: 625648 bytes. SHA-256 `ea87523d181c5634335111cad843b0a54dd4081eea3bb082847bc7fa1812fb26`. Available in the repository and source ZIP.

## docs/contact-desktop-light.png

Binary asset: 815301 bytes. SHA-256 `d45e7149c535bf22f46dc100414347b81e893bb717ded2c1fbdc8df40b600eba`. Available in the repository and source ZIP.

## docs/contact-mobile-dark.png

Binary asset: 345548 bytes. SHA-256 `ce510ab818ecf5ce29e9e46784d01ff9d0ac6ee533148ae6a64026e2b05d54ba`. Available in the repository and source ZIP.

## docs/contact-mobile-light.png

Binary asset: 404370 bytes. SHA-256 `33b5b59ccefbab3119acef2de1cb8e667bb6033b21c76d20bdb497b30660dbff`. Available in the repository and source ZIP.

## docs/curated-work-desktop-dark.png

Binary asset: 1278321 bytes. SHA-256 `fa978dc41fd066aef9e8b0bef28ce35b24c9854b0dc70fcb217b4727845bedd4`. Available in the repository and source ZIP.

## docs/curated-work-desktop-light.png

Binary asset: 1401834 bytes. SHA-256 `19ddc9655f5c5a64cf32c48d657ce626b02f6759bf8be82b1f5095f0c88b1a5c`. Available in the repository and source ZIP.

## docs/curated-work-mobile-dark.png

Binary asset: 468252 bytes. SHA-256 `e05e5f84fcb20d0c088f90b361143d083c0c46bfedd71344ed52931e2384cd76`. Available in the repository and source ZIP.

## docs/curated-work-mobile-light.png

Binary asset: 491906 bytes. SHA-256 `009ecd7bb38a9a274d9963d12bc677815aeb84fb3f28a7578367de6b602bf56e`. Available in the repository and source ZIP.

## docs/editorial-contact-desktop.png

Binary asset: 573344 bytes. SHA-256 `5a65396856bd3365ed68206dbac6f52ed6f7e473dd163bf99b8df540184b1ac3`. Available in the repository and source ZIP.

## docs/editorial-contact-mobile.png

Binary asset: 372892 bytes. SHA-256 `ad49bfc45d7c204b87573f541361ef8c84a9c5728c62b77f1ddee592511d4ce4`. Available in the repository and source ZIP.

## docs/editorial-desktop-hero.png

Binary asset: 295688 bytes. SHA-256 `8911b92f58aa5a84639fa2d6959a86bebef2c9de2e48f2f1b6d36a40e6109666`. Available in the repository and source ZIP.

## docs/editorial-desktop-work.png

Binary asset: 435634 bytes. SHA-256 `3bd5b7c9ccd9482af9094f69da6db654c70b174d993d25373b206a331ff442e1`. Available in the repository and source ZIP.

## docs/editorial-domains-desktop.png

Binary asset: 276610 bytes. SHA-256 `52a023c8b8f31b739c00d4f374b5e5fdc1fc482b30a5fe652d245f43d0a6bb9d`. Available in the repository and source ZIP.

## docs/editorial-domains-mobile.png

Binary asset: 153554 bytes. SHA-256 `8ced7b04865fe7a11ccfb88a289fbfe0f36a6303013269ef4b59c02b8af7f72a`. Available in the repository and source ZIP.

## docs/editorial-footer-desktop.png

Binary asset: 917972 bytes. SHA-256 `1c3ecb2b683b7127a96c52b1b05bedba3a22836a8d15393d8469628fad0398bd`. Available in the repository and source ZIP.

## docs/editorial-footer-mobile.png

Binary asset: 345687 bytes. SHA-256 `75c9425155412d240c0cb99b3ef9f6fca68f9384faadc9613a364852fde032b5`. Available in the repository and source ZIP.

## docs/editorial-journey-desktop.png

Binary asset: 456344 bytes. SHA-256 `3ca3e5d53e7a36c20a1e27f465bc4b6697964b30db83fd944c7fb5adb1d976cb`. Available in the repository and source ZIP.

## docs/editorial-journey-mobile.png

Binary asset: 191852 bytes. SHA-256 `9c71dc3f5ac094eccfb12adf96029dbacf7405a9629bf12014b9ed10c08a46d0`. Available in the repository and source ZIP.

## docs/editorial-mobile-hero.png

Binary asset: 118453 bytes. SHA-256 `52202e7e07f2e986d844bfd81966802722ba3a23eae29bb0a881e8bf19bef344`. Available in the repository and source ZIP.

## docs/editorial-mobile-work.png

Binary asset: 165372 bytes. SHA-256 `529ca98a6c576ee30c1dd77369754cea7b43c3ca9b20650dd7e181c71ac7fda6`. Available in the repository and source ZIP.

## docs/editorial-performance.json

``````json
{
  "scope": "Local production, mobile simulated throttling, fresh consent banner, Lighthouse 13.5.0",
  "scores": {
    "performance": 95,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100,
    "agentic-browsing": 100
  },
  "metrics": {
    "first-contentful-paint": {
      "value": 1361.335,
      "display": "1.4 s"
    },
    "largest-contentful-paint": {
      "value": 2942.0025,
      "display": "2.9 s"
    },
    "total-blocking-time": {
      "value": 30.5,
      "display": "30 ms"
    },
    "cumulative-layout-shift": {
      "value": 0,
      "display": "0"
    },
    "speed-index": {
      "value": 1554.210417751738,
      "display": "1.6 s"
    }
  },
  "productionVerified": false
}
``````

## docs/editorial-reviews-desktop.png

Binary asset: 222637 bytes. SHA-256 `589626faefcd496c917980a27be8668bbdc1b77fa85cfbf25312e5fabe31e5ec`. Available in the repository and source ZIP.

## docs/editorial-reviews-mobile.png

Binary asset: 70988 bytes. SHA-256 `57a4f96b80a0d1197c9d49c3becc0c81f2279f83a3c57df6a93983897fffc2de`. Available in the repository and source ZIP.

## docs/editorial-skills-desktop.png

Binary asset: 309964 bytes. SHA-256 `f15710e35cc02c4d92a77888f4d9cb8d8597637802b833001c6b424ac633b038`. Available in the repository and source ZIP.

## docs/editorial-skills-mobile.png

Binary asset: 119669 bytes. SHA-256 `2825147f5cfd55770f4fd9261fc5747ddc93bcb3ae7cdebdc649e90a022b3efc`. Available in the repository and source ZIP.

## docs/editorial-tools-desktop.png

Binary asset: 330001 bytes. SHA-256 `e05d211add7670940e322f66b8aa3a508f3b87ebd2938a61ab76a03b0e84927a`. Available in the repository and source ZIP.

## docs/editorial-tools-mobile.png

Binary asset: 121178 bytes. SHA-256 `884b0407e7d46517e4f3fad45a3b15b9966fdf3899ee8bb2377d14f7f1afaf28`. Available in the repository and source ZIP.

## docs/elvora-project-preview.png

Binary asset: 327312 bytes. SHA-256 `190310850af8858ee2ea97e33ba61e5809ffea539d014a19584ade8eb96db7b2`. Available in the repository and source ZIP.

## docs/emil-browser-results.json

``````json
[
  {
    "width": 390,
    "savedOffVideoRequests": 0,
    "onVideoRequests": 3,
    "footerRunningWhenVisible": 4,
    "toolbarTracksSelectedTheme": true
  },
  {
    "width": 1440,
    "savedOffVideoRequests": 0,
    "onVideoRequests": 3,
    "footerRunningWhenVisible": 4,
    "toolbarTracksSelectedTheme": true
  }
]
``````

## docs/emil-mobile-contact.png

Binary asset: 222579 bytes. SHA-256 `fad970bacac8d2f11acbae84ea680f3be72a7ed0947d2cf293fe88267d63a7a7`. Available in the repository and source ZIP.

## docs/emil-mobile-footer.png

Binary asset: 164383 bytes. SHA-256 `f7398f190f3701668952119ce3a08c08975cd9f92fe3560a0dcd20946ce6a4fa`. Available in the repository and source ZIP.

## docs/forte-bot-card.png

Binary asset: 56227 bytes. SHA-256 `7fd938fd1da1dbc92babcd12adae4062f6fe3a1e7db31d845489884e5b08348c`. Available in the repository and source ZIP.

## docs/home-bands-accessibility.json

``````json
[
  {
    "width": 390,
    "theme": "dark",
    "backgrounds": [
      {
        "section": "home-purpose home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-feature home-feature-websites home-band-dark",
        "bg": "rgb(0, 0, 0)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-feature home-feature-bots home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-feature home-feature-collection home-band-purple",
        "bg": "color(srgb 0.10698 0.0500392 0.204471)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-more home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 390
        }
      }
    ],
    "violations": []
  },
  {
    "width": 390,
    "theme": "light",
    "backgrounds": [
      {
        "section": "home-purpose home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-feature home-feature-websites home-band-dark",
        "bg": "rgb(0, 0, 0)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-feature home-feature-bots home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-feature home-feature-collection home-band-purple",
        "bg": "color(srgb 0.10698 0.0500392 0.204471)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 0,
          "right": 390
        }
      },
      {
        "section": "home-more home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 390
        }
      }
    ],
    "violations": []
  },
  {
    "width": 1440,
    "theme": "dark",
    "backgrounds": [
      {
        "section": "home-purpose home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 1440
        }
      },
      {
        "section": "home-feature home-feature-websites home-band-dark",
        "bg": "rgb(0, 0, 0)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 0,
          "right": 1440
        }
      },
      {
        "section": "home-feature home-feature-bots home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 714
        }
      },
      {
        "section": "home-feature home-feature-collection home-band-purple",
        "bg": "color(srgb 0.10698 0.0500392 0.204471)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 726,
          "right": 1440
        }
      },
      {
        "section": "home-more home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 1440
        }
      }
    ],
    "violations": []
  },
  {
    "width": 1440,
    "theme": "light",
    "backgrounds": [
      {
        "section": "home-purpose home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 1440
        }
      },
      {
        "section": "home-feature home-feature-websites home-band-dark",
        "bg": "rgb(0, 0, 0)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 0,
          "right": 1440
        }
      },
      {
        "section": "home-feature home-feature-bots home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 714
        }
      },
      {
        "section": "home-feature home-feature-collection home-band-purple",
        "bg": "color(srgb 0.10698 0.0500392 0.204471)",
        "color": "rgb(245, 243, 255)",
        "rect": {
          "left": 726,
          "right": 1440
        }
      },
      {
        "section": "home-more home-band-light",
        "bg": "rgb(250, 250, 252)",
        "color": "rgb(10, 10, 15)",
        "rect": {
          "left": 0,
          "right": 1440
        }
      }
    ],
    "violations": []
  }
]
``````

## docs/home-bands-dark-1440.png

Binary asset: 1756498 bytes. SHA-256 `196a6c6856f3cdc4465209052387b1c75964392f50a1ffe4219adfa5ee3fce7d`. Available in the repository and source ZIP.

## docs/home-bands-dark-390.png

Binary asset: 692934 bytes. SHA-256 `df6b46da6649cbc36b118ee85029d266a6be2135d6f1f2a67ccffde55185b387`. Available in the repository and source ZIP.

## docs/home-bands-light-1440.png

Binary asset: 1874826 bytes. SHA-256 `3e5f2a006774d711066fc9f2cbf32c555da7a6c139ff3a7abd5c91d835620942`. Available in the repository and source ZIP.

## docs/home-bands-light-390.png

Binary asset: 677836 bytes. SHA-256 `e5ce0e49953a6f336fd2db3b2606f7e09a15893516c46d42d685812e4956fa22`. Available in the repository and source ZIP.

## docs/home-bands-overview-desktop.png

Binary asset: 849389 bytes. SHA-256 `df1c786972bf96fb215d23e97881d4e2fc2162d6f9f65d96486b77f833f19a57`. Available in the repository and source ZIP.

## docs/home-bot-loop-1440.png

Binary asset: 145643 bytes. SHA-256 `857729ce42b87a9ebc3798a3fa311039276b8000245b24a59b0715bb63c0d7f2`. Available in the repository and source ZIP.

## docs/home-bot-loop-390.png

Binary asset: 59570 bytes. SHA-256 `f7b1a2714e77768ce3672edc85a05c431e29e9415d7b5013761f01e3d68bffa5`. Available in the repository and source ZIP.

## docs/home-collection-loop-1440.png

Binary asset: 223504 bytes. SHA-256 `eb33b14b2a00e386a7c67088f748885c923e5ac1e4baae40cb327b5dfffddbd6`. Available in the repository and source ZIP.

## docs/home-collection-loop-390.png

Binary asset: 79670 bytes. SHA-256 `a848c5e8348ed127439c9fae9869e85aca0a00cd8cfabf77a17a66d7fa746b93`. Available in the repository and source ZIP.

## docs/home-explore-highlight-1440.png

Binary asset: 41476 bytes. SHA-256 `3d914f96f0a3e79e0a3cfc204aa04c0d982bc77708f5bb76e89a13b56bb38ce8`. Available in the repository and source ZIP.

## docs/home-explore-highlight-390.png

Binary asset: 33965 bytes. SHA-256 `b05f6bbe92e75686eb4e700e3b70acea77b96536d0619b89742998ad2f8b14ed`. Available in the repository and source ZIP.

## docs/home-websites-loop-1440.png

Binary asset: 288298 bytes. SHA-256 `2778adfe0e8a0ff7981c67904a2a0cf7768422a1e6bfb2b8f5f503461761ce10`. Available in the repository and source ZIP.

## docs/home-websites-loop-390.png

Binary asset: 46082 bytes. SHA-256 `c707816a02d7bc591de6a6f88559f0bd868a721c44bc3f9111f0b1060f25c9be`. Available in the repository and source ZIP.

## docs/horizon-explore-accessibility.json

``````json
[
  {
    "width": 390,
    "theme": "dark",
    "hover": false,
    "violations": []
  },
  {
    "width": 390,
    "theme": "light",
    "hover": false,
    "violations": []
  },
  {
    "width": 1440,
    "theme": "dark",
    "hover": false,
    "violations": []
  },
  {
    "width": 1440,
    "theme": "dark",
    "hover": true,
    "violations": []
  },
  {
    "width": 1440,
    "theme": "light",
    "hover": false,
    "violations": []
  },
  {
    "width": 1440,
    "theme": "light",
    "hover": true,
    "violations": []
  }
]
``````

## docs/image-optimization.json

``````json
{
  "beforeBytes": 3203846,
  "afterBytes": 1367634,
  "reductionPercent": 57,
  "maxWidth": 1600,
  "files": [
    {
      "file": "public/projects/aster-1.webp",
      "before": 235952,
      "after": 83292
    },
    {
      "file": "public/projects/aster-2.webp",
      "before": 106390,
      "after": 41188
    },
    {
      "file": "public/projects/aster-3.webp",
      "before": 96896,
      "after": 81368
    },
    {
      "file": "public/projects/aster-4.webp",
      "before": 293288,
      "after": 101860
    },
    {
      "file": "public/projects/kovo-1.webp",
      "before": 321498,
      "after": 118558
    },
    {
      "file": "public/projects/kovo-2.webp",
      "before": 87428,
      "after": 37842
    },
    {
      "file": "public/projects/kovo-3.webp",
      "before": 95934,
      "after": 83894
    },
    {
      "file": "public/projects/kovo-4.webp",
      "before": 67930,
      "after": 30794
    },
    {
      "file": "public/projects/solenne-1.webp",
      "before": 311386,
      "after": 116226
    },
    {
      "file": "public/projects/solenne-2.webp",
      "before": 73266,
      "after": 32396
    },
    {
      "file": "public/projects/solenne-3.webp",
      "before": 80346,
      "after": 67900
    },
    {
      "file": "public/projects/solenne-4.webp",
      "before": 248062,
      "after": 89390
    },
    {
      "file": "public/projects/vanta-1.webp",
      "before": 180002,
      "after": 70756
    },
    {
      "file": "public/projects/vanta-2.webp",
      "before": 74376,
      "after": 30972
    },
    {
      "file": "public/projects/vanta-3.webp",
      "before": 59656,
      "after": 51860
    },
    {
      "file": "public/projects/vanta-4.webp",
      "before": 172958,
      "after": 67900
    },
    {
      "file": "public/studies/aura.webp",
      "before": 65846,
      "after": 26308
    },
    {
      "file": "public/studies/elsewhere.webp",
      "before": 297080,
      "after": 98902
    },
    {
      "file": "public/studies/form.webp",
      "before": 66070,
      "after": 26666
    },
    {
      "file": "public/studies/noma.webp",
      "before": 82876,
      "after": 33704
    },
    {
      "file": "public/studies/offscript.webp",
      "before": 107188,
      "after": 43486
    },
    {
      "file": "public/studies/orbit.webp",
      "before": 79418,
      "after": 32372
    }
  ]
}
``````

## docs/lighthouse-summary.json

``````json
{
  "source": "Earlier premium visual build, before the four-concept/direct-chat update; local file content mode, mobile emulation; not rerun for latest update and not a live-site guarantee",
  "fetchTime": "2026-10-15T18:45:43.020Z",
  "lighthouseVersion": "13.5.0",
  "scores": {
    "performance": 85,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100
  },
  "metrics": {
    "first-contentful-paint": "1.2\u00a0s",
    "largest-contentful-paint": "3.7\u00a0s",
    "total-blocking-time": "250\u00a0ms",
    "cumulative-layout-shift": "0",
    "speed-index": "2.7\u00a0s"
  },
  "securityNote": "Next.js 14 still has reported critical advisories; see SECURITY_STATUS.md"
}
``````

## docs/login-fields-mobile.png

Binary asset: 78961 bytes. SHA-256 `97e805e6864f01d06f02cd5933c6a5d2d6fa69ea077bc0cfb08476a48a76e2ee`. Available in the repository and source ZIP.

## docs/logo-flipped.png

Binary asset: 144508 bytes. SHA-256 `e1ba15a079232154cd7b689cc38a8e4860399c31bd22ad8234833c6f79800f5c`. Available in the repository and source ZIP.

## docs/logo-front.png

Binary asset: 148486 bytes. SHA-256 `f33f6eab9cccaa67caa81834426c225c5053a70ca7005188af9f7f0b0bf24866`. Available in the repository and source ZIP.

## docs/mobile-about-preview.png

Binary asset: 139652 bytes. SHA-256 `c43073f9bda4da3745f6961c2a17d66e594bc231607c7332fa0499ee5dd13e8a`. Available in the repository and source ZIP.

## docs/new-work-preview.png

Binary asset: 1052258 bytes. SHA-256 `efa86397780d804c8cc4b0c285a3e591c0d9e835fe2caab09136fb7a07735476`. Available in the repository and source ZIP.

## docs/owner-portrait-1440.png

Binary asset: 191755 bytes. SHA-256 `9f9f5b5faff202eedb93b23954a6580ab8621d2bb9f7bc8e080c0401d49f46f5`. Available in the repository and source ZIP.

## docs/owner-portrait-390.png

Binary asset: 112676 bytes. SHA-256 `96b2a221f2124e24b183797b3d61e4894cec1df66a9872fb48f402ec1107e2a7`. Available in the repository and source ZIP.

## docs/pages-accessibility.json

``````json
[
  {
    "width": 390,
    "path": "/",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-websites",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-websites",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-bots",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-bots",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-bots/how-i-embed-bots",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-bots/how-i-embed-bots",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/about",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/about",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/testimonials",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/testimonials",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-websites",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-websites",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-bots",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-bots",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-bots/how-i-embed-bots",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-bots/how-i-embed-bots",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/about",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/about",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/testimonials",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/testimonials",
    "theme": "light",
    "violations": []
  }
]
``````

## docs/pages-ai-websites-1440.png

Binary asset: 1264416 bytes. SHA-256 `3f579748b4f2ea88ede3f95c929b376289d3f834db20526bd0cf5e8de2e366f6`. Available in the repository and source ZIP.

## docs/pages-ai-websites-390.png

Binary asset: 465279 bytes. SHA-256 `4a3934239979a0de092aa6f62b409fc2c897e12a22c99e0dcfb8415510cac191`. Available in the repository and source ZIP.

## docs/pages-bunch-of-work-1440.png

Binary asset: 770778 bytes. SHA-256 `b6e801819682afac480e9a36a1ab3ed54b088bf4ad47ea45bc6000e476e7eadf`. Available in the repository and source ZIP.

## docs/pages-bunch-of-work-390.png

Binary asset: 238658 bytes. SHA-256 `08d9e52e3a985cb407903e99218affd01d37cd02c9ad67f5577110d1a73fafd5`. Available in the repository and source ZIP.

## docs/pages-home-1440.png

Binary asset: 206962 bytes. SHA-256 `e6583dc767ac961746c71bc60cb01135b664f546dc9489368ee2023a92a7d39b`. Available in the repository and source ZIP.

## docs/pages-home-390.png

Binary asset: 144687 bytes. SHA-256 `90be81278a61a70304378a8f887155051f4879c6275537899c2479d5f3c0cbcf`. Available in the repository and source ZIP.

## docs/pages-scroll-readiness.json

``````json
[
  {
    "width": 1440,
    "route": "/",
    "imagesBefore": 3,
    "totalImages": 3,
    "scrollResourceRequests": 8,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 24,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 1440,
    "route": "/ai-websites",
    "imagesBefore": 9,
    "totalImages": 9,
    "scrollResourceRequests": 8,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 39,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 1440,
    "route": "/bunch-of-work",
    "imagesBefore": 55,
    "totalImages": 55,
    "scrollResourceRequests": 8,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 20,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/",
    "imagesBefore": 3,
    "totalImages": 3,
    "scrollResourceRequests": 14,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 21,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/ai-websites",
    "imagesBefore": 9,
    "totalImages": 9,
    "scrollResourceRequests": 13,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 19,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/bunch-of-work",
    "imagesBefore": 55,
    "totalImages": 55,
    "scrollResourceRequests": 13,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 20,
    "longTasks": 0,
    "longTaskMs": 0
  }
]
``````

## docs/pages-testimonials-1440.png

Binary asset: 1004596 bytes. SHA-256 `732506da140d707061f08a56a9835a642ebd383afb0e0291718a91f4244c083d`. Available in the repository and source ZIP.

## docs/pages-testimonials-390.png

Binary asset: 540101 bytes. SHA-256 `b8e7f16a6fea579b0d149e72912b68768090bd111760fbc4fb54dcecfb3988e7`. Available in the repository and source ZIP.

## docs/portrait-transparency-accessibility.json

``````json
[
  {
    "width": 390,
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "theme": "light",
    "violations": []
  }
]
``````

## docs/preview.png

Binary asset: 1052258 bytes. SHA-256 `efa86397780d804c8cc4b0c285a3e591c0d9e835fe2caab09136fb7a07735476`. Available in the repository and source ZIP.

## docs/purple-accessibility.json

``````json
{
  "scope": "Local production Chromium; WCAG A/AA automated scans are not a full accessibility certification.",
  "contrast": {
    "light": {
      "textOnBackground": 18.95,
      "textOnSurface": 19.75,
      "mutedOnBackground": 5.14,
      "mutedOnSurface": 5.36,
      "linksOnSurface": 5.7,
      "buttonText": 5.7,
      "buttonHover": 7.1
    },
    "dark": {
      "textOnBackground": 18.01,
      "textOnSurface": 16.7,
      "mutedOnBackground": 7.45,
      "mutedOnSurface": 6.91,
      "linksOnSurface": 6.73,
      "buttonText": 4.66,
      "buttonHover": 7.26
    }
  },
  "axe": [
    {
      "width": 1440,
      "theme": "light",
      "violations": []
    },
    {
      "width": 1440,
      "theme": "dark",
      "violations": []
    },
    {
      "width": 390,
      "theme": "light",
      "violations": []
    },
    {
      "width": 390,
      "theme": "dark",
      "violations": []
    }
  ]
}
``````

## docs/purple-ai-video.png

Binary asset: 273191 bytes. SHA-256 `4ae148241bdb0a7569703cacfdb2d15d5b0bc97e3ebe953d853ac951470452dd`. Available in the repository and source ZIP.

## docs/purple-contact-dark.png

Binary asset: 491148 bytes. SHA-256 `1d39944298e96543be7fda0bc7ed49cd101e28fd6021fea7847b891678802dad`. Available in the repository and source ZIP.

## docs/purple-contact-light.png

Binary asset: 597130 bytes. SHA-256 `d1355a64205c2657366aa8fd3344c3f8aa7297f6f90f5d69bc0b43f48480872e`. Available in the repository and source ZIP.

## docs/purple-hero-dark.png

Binary asset: 244201 bytes. SHA-256 `bc483b8f350fdf4faad067ba885e563292fb3197cb2fa26607e709053546b7f2`. Available in the repository and source ZIP.

## docs/purple-hero-light.png

Binary asset: 249696 bytes. SHA-256 `109b16caeacdd4f75f8a0d347e5606684dd8015fe82b442b65c0cd0773697531`. Available in the repository and source ZIP.

## docs/purple-preserved-work-wall.png

Binary asset: 874872 bytes. SHA-256 `37905b9066ca763dce48fbe36724dc15cc10d5dc1e670eca9308bb9cecc86855`. Available in the repository and source ZIP.

## docs/purple-testimonials-dark.png

Binary asset: 76143 bytes. SHA-256 `13f41472e84884c54d776a39661eab7209821decfc6d344ee85eef4398f4b37f`. Available in the repository and source ZIP.

## docs/purple-testimonials-light.png

Binary asset: 74338 bytes. SHA-256 `d34b12434354e0124766d6ac08a4b61fb6aa9c675489b64465c4ad4cface4f9c`. Available in the repository and source ZIP.

## docs/purple-testimonials-mobile-dark.png

Binary asset: 85118 bytes. SHA-256 `ff8aed793ca6aff16e0a17c1c99739c8ecac4d9f29e6132bb9832691c96fe785`. Available in the repository and source ZIP.

## docs/purple-testimonials-mobile-light.png

Binary asset: 85481 bytes. SHA-256 `9e023d96fdc5a2d7af4bb3fc61efa741bacac68bb63cc3a67df388f399820059`. Available in the repository and source ZIP.

## docs/purple-work-video.png

Binary asset: 266940 bytes. SHA-256 `dffcbb1a061bcac0e71c71e3fb45c44bd60611699403e783723a2a0ed8ee59ac`. Available in the repository and source ZIP.

## docs/reading-desktop-dark.png

Binary asset: 445472 bytes. SHA-256 `304e89e7e9b4ef451d366d8ef60ca79473ff1a52447ebf9574b4e420451f6cf4`. Available in the repository and source ZIP.

## docs/reading-desktop-light.png

Binary asset: 451188 bytes. SHA-256 `19e3663f2427e679349cb2269e5f9337daf091a92d36a314c855d6747831ef5b`. Available in the repository and source ZIP.

## docs/reading-mobile-dark.png

Binary asset: 175344 bytes. SHA-256 `f16209c8027f274d49644d4452ec7151e2c56105d6bbad9daff3fdb0279cf17e`. Available in the repository and source ZIP.

## docs/reading-mobile-light.png

Binary asset: 180239 bytes. SHA-256 `a8e0ec3890d29f22a24380692e63d0fe31bb1e85ad0b5460e8e8af273dc208ee`. Available in the repository and source ZIP.

## docs/ready-accessibility.json

``````json
[
  {
    "width": 1440,
    "theme": "dark",
    "scope": "public portfolio",
    "violations": []
  },
  {
    "width": 1440,
    "theme": "light",
    "scope": "public portfolio",
    "violations": []
  },
  {
    "width": 1440,
    "theme": "dark",
    "scope": "preview window chrome; original concept artwork excluded",
    "violations": []
  },
  {
    "width": 1440,
    "theme": "light",
    "scope": "preview window chrome; original concept artwork excluded",
    "violations": []
  },
  {
    "width": 390,
    "theme": "dark",
    "scope": "public portfolio",
    "violations": []
  },
  {
    "width": 390,
    "theme": "light",
    "scope": "public portfolio",
    "violations": []
  },
  {
    "width": 390,
    "theme": "dark",
    "scope": "preview window chrome; original concept artwork excluded",
    "violations": []
  },
  {
    "width": 390,
    "theme": "light",
    "scope": "preview window chrome; original concept artwork excluded",
    "violations": []
  }
]
``````

## docs/ready-demo-mobile.png

Binary asset: 211372 bytes. SHA-256 `dfe15ed901f0c1846bb1bccdf2786fd9a933a0bf533f660c2a8564ccc9e4c919`. Available in the repository and source ZIP.

## docs/ready-demo-window.png

Binary asset: 941785 bytes. SHA-256 `ef2d805de8ed61cfcc8a63dccba799a6aed4a9e9ab3c4e4e410355ee794f880a`. Available in the repository and source ZIP.

## docs/ready-scroll-results.json

``````json
{
  "method": "Local Chromium; 160 animation-frame scroll steps through the complete page after initial image readiness. Timings are single-run observations, not device FPS guarantees. Baseline mobile used video posters; current mobile uses loops.",
  "before": [
    {
      "width": 1440,
      "imagesBefore": 4,
      "totalImages": 73,
      "scrollResourceRequests": 37,
      "scrollImageRequests": 33,
      "scrollScriptRequests": 1,
      "framesOver50ms": 1,
      "worstFrameMs": 237,
      "longTasks": 1,
      "longTaskMs": 224
    },
    {
      "width": 390,
      "imagesBefore": 4,
      "totalImages": 74,
      "scrollResourceRequests": 37,
      "scrollImageRequests": 34,
      "scrollScriptRequests": 1,
      "framesOver50ms": 0,
      "worstFrameMs": 21,
      "longTasks": 0,
      "longTaskMs": 0
    }
  ],
  "after": [
    {
      "width": 1440,
      "imagesBefore": 67,
      "totalImages": 67,
      "scrollResourceRequests": 2,
      "scrollImageRequests": 0,
      "scrollScriptRequests": 0,
      "framesOver50ms": 1,
      "worstFrameMs": 206,
      "longTasks": 1,
      "longTaskMs": 194
    },
    {
      "width": 390,
      "imagesBefore": 67,
      "totalImages": 67,
      "scrollResourceRequests": 2,
      "scrollImageRequests": 0,
      "scrollScriptRequests": 0,
      "framesOver50ms": 1,
      "worstFrameMs": 67,
      "longTasks": 1,
      "longTaskMs": 51
    }
  ]
}
``````

## docs/ready-video-1440.png

Binary asset: 455213 bytes. SHA-256 `fe5c6105795ce1c19afbd9579800b3e07f8cd814909fb80518732fb93fc250f7`. Available in the repository and source ZIP.

## docs/ready-video-390.png

Binary asset: 170774 bytes. SHA-256 `bf4bb3f08b958486baef3b2cc3867ade62bc248f6e591446c53d5db7592df712`. Available in the repository and source ZIP.

## docs/reference-about-preview.png

Binary asset: 492826 bytes. SHA-256 `7a3a97251b5aa14625cd779d5072e2668a76a50a7a8b9b561e4b74982e8d9bb0`. Available in the repository and source ZIP.

## docs/reference-footer-preview.png

Binary asset: 287876 bytes. SHA-256 `b0a6e83afe03ffd3af8e30e5eb8d3a3a9b7b2a238e483c869b54cf1bc30e2ae7`. Available in the repository and source ZIP.

## docs/reference-hero-preview.png

Binary asset: 400211 bytes. SHA-256 `4db1f2ee313766c4af758aa0b4f92378e44c41c3e139905e92353711b865e92c`. Available in the repository and source ZIP.

## docs/reference-journey-preview.png

Binary asset: 303282 bytes. SHA-256 `83e96da3e82747d10d082b9e9632329fd86572dd68e23e9bcbb81593e1af2e96`. Available in the repository and source ZIP.

## docs/reference-mobile-about.png

Binary asset: 167143 bytes. SHA-256 `28e8b4cf92a7a45f2ca5f2b97fd34d329a94f7bdb4ab230385f532cec5bafbe8`. Available in the repository and source ZIP.

## docs/reference-mobile-consent-preview.png

Binary asset: 102393 bytes. SHA-256 `b772f6f81bb3cff2a776db2a84fe9deb0eea352aafcd2c90dc3f59e76520e0a1`. Available in the repository and source ZIP.

## docs/reference-mobile-work-bunch.png

Binary asset: 287979 bytes. SHA-256 `f505f07a9ef9e1d0665886c03c3ed677253fb913288a1b3a5ee9be9919cf2ebf`. Available in the repository and source ZIP.

## docs/reference-mobile-workflow.png

Binary asset: 110818 bytes. SHA-256 `16b8c5b18db8d4571a70119a0ef3018056a9bf4878c78855a8e2db61bd61e4c8`. Available in the repository and source ZIP.

## docs/reference-services-preview.png

Binary asset: 236255 bytes. SHA-256 `201fc914bdb903580069aa87c06d7d4bb6ffb315f362b9adfcfd1e4a63748ec4`. Available in the repository and source ZIP.

## docs/reference-tools-preview.png

Binary asset: 259707 bytes. SHA-256 `1f85a8f095633bd5185e90dcd532006009b99b57e45b65c2511d91b766b8eeb3`. Available in the repository and source ZIP.

## docs/reference-wall-of-love-preview.png

Binary asset: 208944 bytes. SHA-256 `0aa2d801e2b04c49df7fbf50339bab1234165b9ca3a0cc3f5b63f1d63b34b182`. Available in the repository and source ZIP.

## docs/reference-work-bunch-preview.png

Binary asset: 723689 bytes. SHA-256 `fe6849f1a3dc2c78769060ced64cc02a4bd4b0e20145f274f054c1efba187b7e`. Available in the repository and source ZIP.

## docs/reference-workflow-preview.png

Binary asset: 202277 bytes. SHA-256 `d0ce6a82ce67c89d56d9afa19fd5fc489c7480909978944267637f8fec950a4f`. Available in the repository and source ZIP.

## docs/restored-accessibility.json

``````json
[
  {
    "width": 390,
    "path": "/",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-websites",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-websites",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-bots",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/ai-bots",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-websites",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-websites",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-bots",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/ai-bots",
    "theme": "light",
    "violations": []
  }
]
``````

## docs/restored-footer-1440.png

Binary asset: 639530 bytes. SHA-256 `f976626ab9053bc3b34fc98599f61cea8c7043d912536386defabfd10e8282ca`. Available in the repository and source ZIP.

## docs/restored-footer-390.png

Binary asset: 249629 bytes. SHA-256 `9292898aef5b50bc8138678a91c97162ac72ba745fcd7a11fb3b2a9b66d61ae5`. Available in the repository and source ZIP.

## docs/restored-home-dark-1440.png

Binary asset: 1736331 bytes. SHA-256 `7605b6683cd133ebe9a3b03f86072c8717613d11eae3c51048c449096c589dab`. Available in the repository and source ZIP.

## docs/restored-home-dark-390.png

Binary asset: 678155 bytes. SHA-256 `361eb8d7c30f6d49ef21b06754153f40a9276136ea1088047c2c3952076796c0`. Available in the repository and source ZIP.

## docs/restored-home-light-1440.png

Binary asset: 1798644 bytes. SHA-256 `4b4eac8c025f4ce7c59ab788d2ff54219e1d370c6c4ad6fc8b90fcb7f135cf27`. Available in the repository and source ZIP.

## docs/restored-home-light-390.png

Binary asset: 668199 bytes. SHA-256 `2d1cfe0c771f8101b44d9b756c654688251ecdef905a26f4f77a9222d07f9cb7`. Available in the repository and source ZIP.

## docs/restored-scroll-readiness.json

``````json
[
  {
    "width": 1440,
    "route": "/",
    "imagesBefore": 12,
    "totalImages": 12,
    "scrollResourceRequests": 2,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 27,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 1440,
    "route": "/ai-websites",
    "imagesBefore": 10,
    "totalImages": 10,
    "scrollResourceRequests": 2,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 33,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 1440,
    "route": "/bunch-of-work",
    "imagesBefore": 56,
    "totalImages": 56,
    "scrollResourceRequests": 2,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 20,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/",
    "imagesBefore": 12,
    "totalImages": 12,
    "scrollResourceRequests": 8,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 19,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/ai-websites",
    "imagesBefore": 10,
    "totalImages": 10,
    "scrollResourceRequests": 3,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 18,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/bunch-of-work",
    "imagesBefore": 56,
    "totalImages": 56,
    "scrollResourceRequests": 3,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 18,
    "longTasks": 0,
    "longTaskMs": 0
  }
]
``````

## docs/reviews-empty-desktop-dark.png

Binary asset: 143383 bytes. SHA-256 `012edfbb575e41e6c672c6eafb28e8746c507461906d99524103d78d18802b2f`. Available in the repository and source ZIP.

## docs/reviews-empty-desktop-light.png

Binary asset: 144909 bytes. SHA-256 `e3d63829111ce0e9b9f37c157697995547d3e28e82b0f211cfbeec4ffe698573`. Available in the repository and source ZIP.

## docs/reviews-empty-mobile-dark.png

Binary asset: 62544 bytes. SHA-256 `96945a63d05957fdcb47995afe56e406b5675f44068a454eb95cb89a94e8fba0`. Available in the repository and source ZIP.

## docs/reviews-empty-mobile-light.png

Binary asset: 64169 bytes. SHA-256 `8cd511560b11f6a9ce7be527bf624d48de1ffd8df0528a73fbcc55a3eef05bb2`. Available in the repository and source ZIP.

## docs/seo-home-1440.png

Binary asset: 1751358 bytes. SHA-256 `4b2ceb7a9717ab6df4d2537e388772fdd4b3d74a4ee148d2a01d07d547a1ab4e`. Available in the repository and source ZIP.

## docs/seo-home-390.png

Binary asset: 747996 bytes. SHA-256 `359bf30d0b58f31ee95890c44549f58d74d959a5107b3cefbf6d5b926e3c9297`. Available in the repository and source ZIP.

## docs/showcase-1440-dark.png

Binary asset: 965434 bytes. SHA-256 `bc5417d4a301c1586f32b6585c880cd2401b86fd51b59b11b61704e68902677f`. Available in the repository and source ZIP.

## docs/showcase-1440-light.png

Binary asset: 974964 bytes. SHA-256 `7cbbcf6940ed2c554e9cbb4994e015d46741d5beb5849f70d294b865754c0c9d`. Available in the repository and source ZIP.

## docs/showcase-390-light.png

Binary asset: 244021 bytes. SHA-256 `128d1705f2a0c40911cc6f0ea49c218ddeea130ce1571dd04473bc9e14cadd25`. Available in the repository and source ZIP.

## docs/studio-footer-preview.png

Binary asset: 348162 bytes. SHA-256 `c6e28917b071acc4f4dcf9353d0cad5e28cea4b962e17ef7d0adb08b3b517f43`. Available in the repository and source ZIP.

## docs/studio-hero-preview.png

Binary asset: 404977 bytes. SHA-256 `a28916fe17ad5bb2d5c0dee41503daaa1da0620675ce6b4fdf95b39d1856cf69`. Available in the repository and source ZIP.

## docs/studio-journey-preview.png

Binary asset: 454768 bytes. SHA-256 `81116fef24213f87af67514dcbbd8004e4924fc4315f9f1280055df4616b6fc0`. Available in the repository and source ZIP.

## docs/studio-mobile-consent-preview.png

Binary asset: 102849 bytes. SHA-256 `744f16d69ca2e94e25a858f203f8c4dbd55a126d51dc0761bf835bcac5555003`. Available in the repository and source ZIP.

## docs/studio-services-preview.png

Binary asset: 480712 bytes. SHA-256 `4337c789b10fd969e970263589d7ea655b3e1017b4ac0c8e9f4b9a66b33586a5`. Available in the repository and source ZIP.

## docs/studio-tools-preview.png

Binary asset: 259589 bytes. SHA-256 `74800de09b771bf2b08a3153098410bb192b0657e803281085877e39427d6884`. Available in the repository and source ZIP.

## docs/studio-wall-of-love-preview.png

Binary asset: 311106 bytes. SHA-256 `d330d0be48962dc185d37fdfc6be1fe3271da07f7225062a6f6e92060151f1df`. Available in the repository and source ZIP.

## docs/studio-work-bunch-preview.png

Binary asset: 845616 bytes. SHA-256 `8aabb777245d17af26d44e968a31fbab7a7be375d4247c92160c536c956ac932`. Available in the repository and source ZIP.

## docs/studio-workflow-preview.png

Binary asset: 454501 bytes. SHA-256 `1735d85969122e959103186f9ec912ce159531221178846f220ec1dc757ecb77`. Available in the repository and source ZIP.

## docs/testimonials-floating-1440.png

Binary asset: 1113020 bytes. SHA-256 `bd4aa8b162e81a97c41c6847080388dd784d8454a63c08972e0f0ec1a27b1a76`. Available in the repository and source ZIP.

## docs/testimonials-floating-390.png

Binary asset: 573164 bytes. SHA-256 `f539762f0d2e7a11231b139d895c2120f89b4364e38f18442ca8b5009195eb8f`. Available in the repository and source ZIP.

## docs/web-positioning-about-1440.png

Binary asset: 1134753 bytes. SHA-256 `230f6c22650349a8a721720f54b4bae8bed3dd2312857eec88540d1e74e35a90`. Available in the repository and source ZIP.

## docs/web-positioning-about-390.png

Binary asset: 514191 bytes. SHA-256 `3637f0752b972dfd1d45db6375cb49b67cbbc6e290d30a70ecc22ba91c65c847`. Available in the repository and source ZIP.

## docs/web-positioning-home-1440.png

Binary asset: 1748096 bytes. SHA-256 `3ad5e269ac2b4fb633724da4a4dc01993cd7bc64ce54ee69afd77a723601731a`. Available in the repository and source ZIP.

## docs/web-positioning-home-390.png

Binary asset: 681082 bytes. SHA-256 `874f4a08481570d2ebc576b40cb88dfabeb51d948b2c0b941976c34a03a50505`. Available in the repository and source ZIP.

## docs/web-positioning-skills-1440.png

Binary asset: 1076621 bytes. SHA-256 `9666e030a93f894566e23cbb6dfe817e09936aa02a81a09db45f78a8e16b245b`. Available in the repository and source ZIP.

## docs/web-positioning-skills-390.png

Binary asset: 530061 bytes. SHA-256 `d2dd9ea2142428b95b61661baaa8b5e2072f1fd7e63701393be19384bb6665c2`. Available in the repository and source ZIP.

## docs/web-positioning-websites-1440.png

Binary asset: 2472524 bytes. SHA-256 `a7dabd98fc6e546083b1ab984317f0738e75d9ac14a50c7a6396f59cce55ef09`. Available in the repository and source ZIP.

## docs/web-positioning-websites-390.png

Binary asset: 1077953 bytes. SHA-256 `08928dd7137e54119f5c0a46fea057a3936357f5b6c674aa9235706c1c8691c2`. Available in the repository and source ZIP.

## docs/websites-testimonials-accessibility.json

``````json
[
  {
    "width": 390,
    "path": "/",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/websites",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/websites",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/skills",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/skills",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/about",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/about",
    "theme": "light",
    "violations": []
  },
  {
    "width": 390,
    "path": "/testimonials",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 390,
    "path": "/testimonials",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/websites",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/websites",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/skills",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/skills",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/about",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/about",
    "theme": "light",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/testimonials",
    "theme": "dark",
    "violations": []
  },
  {
    "width": 1440,
    "path": "/testimonials",
    "theme": "light",
    "violations": []
  }
]
``````

## docs/websites-testimonials-readiness.json

``````json
[
  {
    "width": 1440,
    "route": "/",
    "imagesBefore": 12,
    "totalImages": 12,
    "scrollResourceRequests": 2,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 22,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 1440,
    "route": "/websites",
    "imagesBefore": 10,
    "totalImages": 10,
    "scrollResourceRequests": 2,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 23,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 1440,
    "route": "/bunch-of-work",
    "imagesBefore": 56,
    "totalImages": 56,
    "scrollResourceRequests": 2,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 30,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/",
    "imagesBefore": 12,
    "totalImages": 12,
    "scrollResourceRequests": 8,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 19,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/websites",
    "imagesBefore": 10,
    "totalImages": 10,
    "scrollResourceRequests": 3,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 18,
    "longTasks": 0,
    "longTaskMs": 0
  },
  {
    "width": 390,
    "route": "/bunch-of-work",
    "imagesBefore": 56,
    "totalImages": 56,
    "scrollResourceRequests": 3,
    "scrollImageRequests": 0,
    "scrollScriptRequests": 0,
    "framesOver50ms": 0,
    "worstFrameMs": 17,
    "longTasks": 0,
    "longTaskMs": 0
  }
]
``````

## docs/workflow-1440-dark.png

Binary asset: 203960 bytes. SHA-256 `ef1cc423d4f7dfac3fa7d4c99428dd1136e356c9becc912dd116bb96e06fc385`. Available in the repository and source ZIP.

## docs/workflow-1440-light.png

Binary asset: 208331 bytes. SHA-256 `ea4096008106000ff295b865dcb690610d244e7b8b3f4fda5dba7bb751f02c83`. Available in the repository and source ZIP.

## docs/workflow-390-light.png

Binary asset: 138289 bytes. SHA-256 `17037ca9a4433bafa1033601f1abf2b8b84fd4ffda81eea7e24d7dd734115b08`. Available in the repository and source ZIP.
