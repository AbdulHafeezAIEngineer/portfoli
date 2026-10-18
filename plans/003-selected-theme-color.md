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
