# Homepage with contrasting sections

The owner's reference uses separate light and dark product sections. Elvora's homepage now follows that rhythm with its existing content and purple palette:

1. The header and hero follow the saved light/dark preference, with purple primary actions and active states.
2. The purpose introduction uses a full-width light neutral background and dark text.
3. The website showcase uses a full-width black background and a large, centered original website preview.
4. AI Bots and Bunch of Work appear side by side in white and deep purple; phones stack them into separate sections.
5. The secondary About, Testimonials and Contact navigation returns to a light background before the original full footer.

Narrow neutral gutters separate the panels. The deep-purple background is a solid mix of the existing purple and black tokens, without gradients or neon effects. Section text, links and borders have explicit local contrast tokens. Both intentional light and dark panels remain present in either site theme; changing the theme still updates the header, hero and shared footer styling.

Original project images, custom mockups, curved collection, footer artwork, page content, logo/reading motion, cookie choices, Botpress and authentication are preserved. Only the homepage composition and its shared palette exports change. No application dependencies or credentials were added or changed.

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
