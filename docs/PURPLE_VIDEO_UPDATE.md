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
