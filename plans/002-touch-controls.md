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
