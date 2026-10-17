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
