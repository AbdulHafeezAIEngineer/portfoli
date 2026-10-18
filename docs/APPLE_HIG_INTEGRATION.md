# Apple HIG integration — 18 October 2026

## Summary

Overall rating for the reviewed web controls: **Good**. Elvora’s visual identity
comes from its purple accent, original device previews, rotating collection and
editorial footer. The new guidance is installed and used for a focused review of
chat controls, keyboard feedback and appearance preferences; this is not a full
site accessibility certification or a redesign.

Source: [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill),
pinned at `914b6a377c22755597e4405e54911b996de822d7`.
The local name is [`apple-hig-design`](../.agents/skills/apple-hig-design/SKILL.md)
to preserve the existing Emil `apple-design` skill. Invoke `$apple-hig-design`.
Its 133 imported files include 123 generated HIG pages and one curated Liquid
Glass reference. Only the new SKILL.md frontmatter name differs from upstream;
[provenance and usage](../.agents/skills/apple-hig-design/INTEGRATION.md) and
[original SHA-256 hashes](../.agents/skills/apple-hig-design/UPSTREAM-SHA256.json)
are included. It adds no client JavaScript, dependency or tracking.

## Improvements

- **Medium — touch controls. What:** chat send/microphone buttons measured
  39×39 CSS px, and voice playback buttons were 32×32. **Why:**
  `accessibility.md › Mobility`: “Offer sufficiently sized controls.” **Fix:**
  coarse-pointer devices now get 44×44 CSS px for these controls. Desktop sizes
  remain unchanged. This is a web comfort target adapted from the HIG, not a
  claim that a 39px control automatically fails WCAG.
- **Low — keyboard indication. What:** the composer had no textarea outline;
  focusing it changed only the enclosing 1px border. **Why:**
  `focus-and-selection.md › Best practices`: “use a focus ring for a text or
  search field.” **Fix:** add a 2px focus-visible ring, offset by 2px, using the
  existing semantic accent text token. The previous border indication is kept.
- **Low — appearance preferences. What:** the header always blurred content
  beneath it, and functional borders had no increased-contrast variant. **Why:**
  `liquid-glass.md › Review checklist` (upstream’s curated guide): “Reduce
  Transparency gets an opaque fallback, Increase Contrast gets stronger fills
  and borders.” **Fix:** reduced-transparency makes header/glass UI opaque with
  no backdrop blur; higher contrast strengthens header/glass and chat frame/input
  borders using the existing muted token. This does not alter video transparency
  or artwork. Unsupported media queries simply leave the normal appearance.

## Craft notes

Keep the custom work, purple palette and supplied media. No stock Apple fonts,
new glass effects, iOS tab bar, gradients, generic replacement artwork or page
reorganization were introduced. Default theme styling and existing layout are
preserved except for the deliberately larger coarse-pointer chat buttons.

## What works

The website already has native button/input semantics, labeled chat controls,
modal keyboard containment with Escape/focus restoration, clear service page
navigation, theme and Motion controls, phone text fields at 16px, and separate
light/dark tokens. Website/bot workflows and Technical Domains retain their
current locations. Consent, Botpress, API/auth/mail logic and dependency versions
are untouched.

The unchanged token pairs below were calculated with WCAG relative luminance.
This verifies these opaque combinations, not every image/overlay or text fragment
on the site. Text pairs exceed 4.5:1; the focus ring also exceeds 3:1.

| Theme | Role                           | On background | On surface |
| ----- | ------------------------------ | ------------: | ---------: |
| Dark  | Text                           |       18.01:1 |    16.70:1 |
| Dark  | Muted / higher-contrast border |        7.45:1 |     6.91:1 |
| Dark  | Accent text / focus ring       |        7.26:1 |     6.73:1 |
| Light | Text                           |       18.95:1 |    19.75:1 |
| Light | Muted / higher-contrast border |        5.14:1 |     5.36:1 |
| Light | Accent text / focus ring       |        5.47:1 |     5.70:1 |

Tokens remain defined by `data/theme-tokens.json` and its generated CSS. No new
colors or token changes were needed.

## Platform notes

This is a Next.js website. HIG principles are translated into HTML, CSS media
queries and browser behavior. Native SwiftUI materials, App Store review,
Apple Pay and platform-specific navigation rules do not apply to this task.
The owner’s explicit Motion On/Off behavior remains intact. Mobile checks use
Chromium touch emulation; physical iPhone/Android, Safari, screen-reader and
speech-provider testing are not claimed. Browser media-feature emulation checks
the new appearance fallbacks; it does not validate an OS settings panel.

## Verification

- `npm run lint` and the file-mode production build passed.
- Import integrity: all 133 upstream file hashes match, after reversing the
  documented one-line name alias; the previous Emil Apple skill is unchanged.
  Sixteen installed skill names are unique, cited local guideline files exist,
  and no unresolved `doc://` links remain in the imported HIG pages.
- `node --check .agents/skills/apple-hig-design/scripts/pull-hig.mjs` passed.
  This installs a pinned reference snapshot. The network refresh script and
  external installer were not run; no newer Apple snapshot is claimed.
- `npm run test:apple:browser` passed all eight width/theme cases at
  320/390/768/1440px. The actual local production UI renders a mocked chat reply,
  traps Tab, restores focus on Escape, keeps phone input text at 16px and uses
  44px coarse-pointer buttons. It verifies the 2px focus ring, opaque/blur-free
  header and stronger border under emulated preferences, no horizontal overflow
  and zero page errors. See [measurements](apple-hig-browser-results.json) and
  [mobile preview](apple-hig-mobile-chat.png). The reply is a local UI fixture,
  not a paid provider test.
- `npm run test:emil:browser` also passed: saved Motion Off still starts zero
  video requests, On loads one responsive source per homepage clip, footer
  animations pause/resume with visibility, browser theme color follows the
  selected theme, and controls/layout pass all four widths. No fresh Lighthouse,
  FPS, physical-device or live-deployment measurement is claimed.

## Changed files

- `.agents/skills/apple-hig-design/`: upstream skill, original references,
  refresh script and upstream entry points/readme, plus local integration and
  hash manifest. No changes to the existing Emil skill package.
- `app/bots.css`: composer keyboard ring, coarse-pointer button sizes and
  higher-contrast functional borders.
- `app/globals.css`: reduced-transparency and higher-contrast UI fallbacks.
- `tests/apple-hig.browser.mjs`, `package.json`: repeatable focused browser check.
- `docs/apple-hig-browser-results.json`, `docs/apple-hig-mobile-chat.png`:
  measured results and mobile chat preview.
- `docs/APPLE_HIG_INTEGRATION.md`, `README.md`, `VERIFICATION.md`: integration,
  evidence and limits.
- Generated `delivery/` source sections/index: refreshed reviewable source bundle.
