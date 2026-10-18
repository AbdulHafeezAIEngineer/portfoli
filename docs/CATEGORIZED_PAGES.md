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
