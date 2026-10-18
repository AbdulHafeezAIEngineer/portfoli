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
