## plans/001-initialize-media-preference.md

``````md
# 001 — Honor saved motion before media fetches

- **Status**: DONE
- **Commit audited**: `520caf7`
- **Severity**: MEDIUM
- **Category**: Performance / preference
- **Scope**: motion context, provider, shared video player

## Problem

In `components/motion-provider.tsx:12`, `useState<MotionPreference>("full")` precedes reading the saved preference in an effect. `components/VisibilityVideo.tsx:129` exposes sources with `preload="auto"` during that first render. A saved Off visitor still requests all three homepage WebMs.

## Target and steps

1. Add `ready: boolean` to `MotionPreferenceContext`, default false.
2. In `MotionProvider`, initialize false and set true in the same effect that reads the root's initialized motion state.
3. In `VisibilityVideo`, attach `<source>` children only when ready; use `preload="none"` before ready and retain `auto` afterward. Skip the effect before ready or when reduced. Load newly attached sources before existing visibility/play logic.
4. Include ready in effect dependencies. Preserve the exact source ordering, responsive URLs, transparency probe, fallback, rounded container, inline muted loop and posters.

## Boundaries and conventions

Use the existing context and single shared player. Do not change default On, explicit On/OS policy, saved key `elvora-motion`, artwork, alpha assets, eager-On behavior, consent, provider setup or navigation. No new dependency.

## Verification

Run `npm run lint`, `CONTENT_SOURCE=files ADMIN_BOOTSTRAP_ON_BUILD=false npm run build`, start port 3008, then `npm run test:emil:browser` and `npm run test:showcase:browser`. Done when fresh saved Off pages at 390/1440px request zero media files, and On starts one appropriate source per clip. Feel-check visible desktop/mobile loops, Off/On reversal and the purple alpha fallback; no blank content or native controls should appear.
``````

## plans/002-touch-controls.md

``````md
# 002 — Make shared controls work well on touch

- **Status**: DONE
- **Commit audited**: `520caf7`
- **Severity**: MEDIUM
- **Category**: Accessibility / input feedback
- **Scope**: shared CSS and Tailwind hover capability flag

## Problem

Motion select text is 11px in `app/refinement.css:32`; contact service selection is 14px through `app/agency.css:11`. `app/globals.css:125` applies `translateY(-3px)` to `.button:hover` without input capability gating. `app/pages.css:686` similarly moves the homepage arrows. Footer policy/settings targets in `app/editorial.css:805` measure approximately 14px high.

## Target and steps

1. Under `(pointer: coarse)`, set `html .motion-control select` and `html .form-field select` to 16px. Keep the header select max-width 66px; verify 320px fit.
2. Keep label size but give footer legal/settings, brief links and return control a 44px minimum touch height.
3. Gate shared CTA/icon, homepage exploration, social and service/contact-arrow hover movement with `(hover: hover) and (pointer: fine)`. Retain independent keyboard focus styling.
4. Use `transform: scale(0.97)` for pointer active shared buttons/icons, exclude `:focus-visible` and disabled controls, and require site Motion On. Transition 160ms using existing `var(--ease-editorial)` (`cubic-bezier(0.22,1,0.36,1)`).
5. Set `touch-action: manipulation` on controls/links and non-selection only on controls. Preserve selectable content and pinch zoom. Enable Tailwind 3's `future.hoverOnlyWhenSupported` for generated hover styles.

## Boundaries and conventions

Do not disable zoom, sniff user agents, suppress document scrolling, replace native selects or change palette/artwork. Motion Off stays authoritative. Keep desktop layout and the existing editorial curve.

## Verification

Run lint/build and `npm run test:emil:browser`. At 320/390/768/1440px verify both themes and no overflow. Check coarse selects >=16px, footer targets >=44px, no touch-hover lift and selectable body content. Feel-check pointer press/release and keyboard focus separately; the keyboard should not move the control. Actual iOS focus zoom and sticky hover need a physical phone, which is unavailable in this environment.
``````

## plans/003-selected-theme-color.md

``````md
# 003 — Match browser chrome to the selected theme

- **Status**: DONE
- **Commit audited**: `520caf7`
- **Severity**: LOW
- **Category**: Theme cohesion
- **Scope**: root metadata/initializer and a small client observer

## Problem

`app/layout.tsx:77` sets theme-color with OS media queries, while `components/navbar.tsx:77` changes site `data-theme` independently. A light OS can therefore have a light toolbar with the site's default dark appearance, and manually selected themes do not update the tags.

## Target and steps

1. Export default dark `themeColor` from the existing `data/theme-tokens.json`, matching the site's default dark setting.
2. Extend the existing inline theme initializer to synchronize metadata to the actual `data-theme`, including after parsing when required. Use the same palette values and existing CSP nonce.
3. Add `components/theme-color-sync.tsx` using `usePathname` and a MutationObserver limited to the root `data-theme` attribute. Synchronize on mount, route changes and actual theme changes; return null, add no visible UI.
4. Mount once from the root layout. Preserve localStorage key and navbar toggle behavior.

## Boundaries and conventions

Use existing palette tokens only. Do not change visible colors, theme defaults, consent, cookie storage or metadata titles/canonicals. No viewport zoom restrictions or new library.

## Verification

Run lint/build and `npm run test:emil:browser`. Check a light OS with dark default, saved light, manual dark/light toggles and client navigation to Cookie Policy. Theme-color must match the selected theme each time. Real mobile toolbar appearance needs a phone; matching metadata is the locally testable contract.
``````

## plans/004-footer-visibility.md

``````md
# 004 — Pause offscreen footer loops

- **Status**: DONE
- **Commit audited**: `520caf7`
- **Severity**: LOW
- **Category**: Performance / background activity
- **Scope**: footer client wrapper and a scoped play-state rule

## Problem

At the homepage top, `document.getAnimations()` shows `wordmark-breathe`, both `editorial-wave` loops and `editorial-emblem` still running far below view. Baseline sources are `app/refinement.css:426` and `app/editorial.css:729,761`. This is unnecessary activity; it is not proof of dropped frames.

## Target and steps

1. Add `components/footer-motion.tsx`, following the existing `HomeExplore` visibility/foreground pattern. Render the same `.editorial-footer` tag with a ref and `data-footer-active`.
2. Observe the footer with 80px root margin; listen for document visibility changes and read the existing motion context.
3. Set active only when visible, foreground and not reduced. Clean up the observer/listener on unmount.
4. Replace only Footer's outer tag with this wrapper; keep all children, classes and artwork identical.
5. Scope `animation-play-state: paused` to the inactive footer's wordmark, waves and emblem pseudo-element. Resume the original animations in place; do not replace keyframes, duration, geometry or paint.

## Boundaries and conventions

Do not introduce a scroll listener, content visibility/loading gate, CSS variable per frame or new library. Preserve the full designed footer and all links, especially Cookie Settings and return-to-top. Server/no-JS content remains readable.

## Verification

Run lint/build, `npm run test:emil:browser` and the categorized-page browser test. At 390/1440px confirm original loops are paused at the top, running on footer entry, paused on a simulated hidden-tab event and stopped under Motion Off. Feel-check pause/resume without restarting from zero. Real-device energy/frame measurements are not available; do not claim a quantified FPS improvement.
``````

## plans/README.md

``````md
# Motion audit execution record

Audit base: `520caf7`. The owner requested skill integration and website improvements. Read-only findings were vetted before implementation; these records describe the completed, authorized fixes. No isolated worktree was needed in the existing cloud checkout.

| Order | Plan                                                                          | Severity | Status |
| ----- | ----------------------------------------------------------------------------- | -------- | ------ |
| 1     | [Honor saved motion before media fetches](001-initialize-media-preference.md) | Medium   | DONE   |
| 2     | [Make shared controls work well on touch](002-touch-controls.md)              | Medium   | DONE   |
| 3     | [Match browser chrome to selected theme](003-selected-theme-color.md)         | Low      | DONE   |
| 4     | [Pause offscreen footer loops](004-footer-visibility.md)                      | Low      | DONE   |

Plans 2–4 do not depend on each other. Run the media/playback regression after plan 1 and the complete checks after all four. High initial media payload with Motion On is deliberately retained; inherited-variable and scheduler concerns need profiling before an implementation plan.
``````
