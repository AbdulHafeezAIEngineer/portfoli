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
