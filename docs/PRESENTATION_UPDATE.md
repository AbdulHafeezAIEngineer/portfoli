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
