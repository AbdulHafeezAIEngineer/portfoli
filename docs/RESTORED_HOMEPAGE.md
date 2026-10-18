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
