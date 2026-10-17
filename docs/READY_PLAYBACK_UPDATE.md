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
