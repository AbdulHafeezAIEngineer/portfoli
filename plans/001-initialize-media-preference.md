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
