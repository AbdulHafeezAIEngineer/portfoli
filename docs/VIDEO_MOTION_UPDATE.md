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
