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
