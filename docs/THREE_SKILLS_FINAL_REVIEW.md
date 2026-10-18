# Final review: Emil, Apple HIG and Liquid Glass

18 October 2026. This records the actual repository implementation and local
production-browser evidence. It does not certify the external hosting deployment.

## What was integrated

| Integration                                                  | Installed guidance                                                      | Website work performed                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [Emil Kowalski skills](EMIL_SKILLS_AUDIT.md)                 | 15 skills, original source/license/provenance                           | Fixed saved Motion Off downloads, touch feedback/target sizing, selected-theme browser color and offscreen footer animation work. |
| [Apple HIG skill](APPLE_HIG_INTEGRATION.md)                  | `apple-hig-design`, 123 generated guidelines plus curated references    | Larger chat touch buttons, visible composer keyboard focus and reduced-transparency/increased-contrast UI fallbacks.              |
| [Liquid Glass skill](../.agents/skills/liquidglass/SKILL.md) | `liquidglass`, configuration reference and original React/HTML examples | Actual WebGL refraction behind the existing navigation controls, plus restrained CSS header/menu material and solid fallbacks.    |

All three sources coexist: **17 uniquely named skills**. These Markdown skills
are development guidance. They are not chatbot prompts, automatic visitor-side
agents or site plugins that run on their own. The Liquid Glass runtime below is
the only new browser dependency introduced by these three integrations.

## 1. Emil: motion, performance and mobile interactions

Completed in commit `4a8a8f9`:

- Saved Motion Off no longer exposes video URLs before preferences are read:
  zero initial video requests in the measured phone/desktop cases. On retains
  eager readiness and one responsive source for each homepage clip.
- Original footer wordmark/waves/emblem pause outside view, in a hidden tab and
  under Motion Off; their design and animations are retained.
- Shared buttons/icons use brief pointer-down feedback and hover capability
  gating. Contact/Motion selects use 16px on touch devices; footer touch actions
  have a 44px minimum height. Page zoom and body text selection remain available.
- Browser theme-color follows the actual saved/manual theme through navigation,
  instead of following a different OS theme.

Main implementation files: `components/motion-provider.tsx`,
`components/motion-preference.tsx`, `components/VisibilityVideo.tsx`,
`components/footer-motion.tsx`, `components/theme-color-sync.tsx`,
`app/layout.tsx`, `components/footer.tsx`, `app/globals.css`, `app/pages.css`,
`app/refinement.css`, `app/editorial.css`, `app/reference-motion.css`,
`tailwind.config.ts`. The original audit contains the detailed changed-file and
test records. Already-present animation features are not new work from this step.

## 2. Apple HIG: controls, focus and appearance

Completed in commit `49c2fc2`:

- Chat send/microphone touch buttons: 39px to 44px; voice playback: 32px to
  44px. Desktop sizing stays unchanged.
- Composer: a 2px focus-visible ring supplements its existing focused border.
- Reduced-transparency and higher-contrast preferences now have explicit UI
  treatment. The new Liquid Glass integration extends this to the navigation.
- Existing tokens, forms, modal focus containment, theme toggle and readable
  content hierarchy were reviewed and retained.

The prior HIG audit records unchanged text token contrast of **5.14:1 or higher**
for its measured opaque backgrounds, and focus-ring pairs of **5.47:1 or higher**.
Those numbers do not establish contrast for every photograph, video or overlay.
Native Apple-app conventions are not imposed on this Next.js website.

Main application changes: `app/bots.css`, `app/globals.css`. The skill has its own
name to avoid overwriting Emil’s separate `apple-design` guidance.

## 3. Liquid Glass: actual rendering, scope and fallbacks

Source skill: RmaNMetaverse/Apple-LiquidGlass-Skill at
`86c92a3074d0d16826e5612dbd0fc3003fa5c3c0`. The five imported files match
upstream hashes, with local provenance alongside them. Remote global installers
were inspected, not executed.

The owner explicitly chose **actual WebGL refraction and a new library** after
being offered CSS-only styling. `@ybouane/liquidglass` 1.0.3 is now used through
a local, integrity-pinned package. This is real shader output, not a CSS blur
presented as refraction. CSS provides the non-WebGL fallback and menu finish.

- One small WebGL scene sits behind the existing Motion/theme/mobile-menu
  controls. It samples a local static neutral/purple texture, not the entire
  webpage. Control text, icons, accessibility names, focus and clicks remain
  native HTML/SVG above it. The geometry of the navigation is preserved.
- The refraction responds to press state and theme changes. Chromatic aberration,
  cyan tint, procedural distortion and dragging are disabled; no rainbow accent,
  animated gradient or new full-page effect is introduced.
- The library is dynamically imported only when initialized preferences allow
  full motion, the scene is visible and no transparency/contrast preference
  blocks it. It is not part of a saved-Off runtime download.
- Motion Off, hidden tabs, offscreen controls, higher contrast, reduced
  transparency and forced colors tear down the renderer. Resume recreates one
  renderer. Unmount cleans observers/listeners/resources; asynchronous starts
  are serialized and stale instances are destroyed.
- Unsupported/blocked/lost WebGL leaves the native controls and CSS/solid UI
  usable. No canvas captures contact details, bot messages or private content.
- The header uses existing palette-derived CSS tokens, a faint edge highlight,
  a 96% opaque fill and bounded blur. Larger menus keep an opaque surface with
  subtle rim/shadow detail so page text never shows through them. Solid material
  is the base when backdrop filtering is unsupported. No new hex colors were
  introduced.

### Reproducible dependency installation

The published npm package declares `postinstall: patch-package`, without shipping
that executable as a dependency. Its ordinary isolated install reproduced exit 127. The committed `vendor/liquidglass-1.0.3.tgz` removes only that broken hook
from package.json. All rendering/source/type/readme files remain byte-for-byte
identical to the npm-verified artifact. A clean isolated install and `npm ci`
with normal lifecycle-script behavior pass using the local tarball. Other
packages’ scripts and Prisma setup remain enabled. Original/local hashes and
attribution are in [vendor provenance](../vendor/README.md).

Main files added/edited in this step:

- `.agents/skills/liquidglass/`: original skill, README, configuration reference,
  two examples, local integration record and upstream hash manifest.
- `components/navigation-glass.tsx`: dynamic WebGL scene, interaction, theme and
  lifecycle handling.
- `components/navbar.tsx`: adds the decorative scene behind existing controls.
- `app/liquid-glass.css`, `app/layout.tsx`: scoped material and fallback styling.
- `package.json`, `package-lock.json`, `vendor/`: pinned runtime and test command.
- `tests/liquid-glass.browser.mjs`: actual rendering, native navigation,
  preferences and teardown checks.
- `docs/liquid-glass-*`: measured results and browser previews.
- This review, `README.md`, `VERIFICATION.md`, generated `delivery/` sections:
  combined record and refreshed reviewable source bundle.

## What remains preserved

Custom project/device art, owner portrait, 54-tile curved gallery, rounded video
loops, transparent collection video, testimonials, footer, content and page
organization remain intact. Website workflow and Technical Domains stay under
Websites; bot creation/embedding stays under AI Bots. Theme/Motion controls,
SEO copy, cookie/consent, Botpress, API, authentication and mail logic are not
rewritten by this integration.

## Final verification and limits

- `npm run lint` and the file-mode production build passed. Production
  dependency audit reported zero known vulnerabilities; this does not replace
  the separately documented development-tool findings or a security review.
- Skill hashes and local runtime hashes match their pinned sources, apart from
  the documented Apple skill name alias and runtime install-hook removal.
- `npm run test:glass:browser`: **nine passed cases**. Eight width/theme cases
  cover 320/390/768/1440px, real WebGL, refraction changes in rendered pixels,
  live theme updates, keyboard menu navigation/focus, offscreen/hidden-tab
  teardown, preference fallbacks and Motion Off cleanup. Actual context loss
  was exercised at 390px. The ninth case blocks WebGL entirely and verifies
  usable native navigation with no leaked renderer or page error. The eight
  ordinary cases also reported no console errors.
- `npm run test:apple:browser`: **eight passed width/theme cases** for chat
  reply fixtures, touch targets, keyboard ring/Tab/Escape/focus restoration,
  appearance preferences and no overflow. Real paid chatbot responses were not
  used by the fixture test.
- `npm run test:emil:browser` passed: saved Off still starts zero video requests,
  On selects one responsive file per clip, original footer animations obey
  visibility, theme-color follows the selected theme, and touch/layout checks
  pass all four widths in both themes.
- `npm run test:showcase:browser` passed: all five silent loops actually wrap,
  show no controls, pause out of view, obey Off/On and preserve consent at
  390/1440px with OS reduced motion both enabled and disabled. The transparent
  collection video's forced purple MP4 fallback also passes at both widths.
- Four header/menu axe WCAG A/AA scans reported **zero detected violations**.
  Each retained an incomplete color-contrast check for translucent/painted
  surfaces; this is not reported as a complete accessibility pass. Visual
  inspection and bounded token calculations supplement it: even over the
  worst black/white backdrop, the 96% header's measured muted/accent text pairs
  stay at **4.71:1 or higher**, and the recorded opaque menu pairs also exceed
  4.5:1. These calculations do not certify every shader pixel or animation frame.

The separate lazy WebGL chunk measures **51,378 bytes raw / 16,677 bytes gzip**
in this build, plus the small integration controller in the shared UI bundle.
Saved Off does not request the shader chunk. WebGL adds GPU work while enabled;
the effect is deliberately limited to a small static scene. This is not a
claim that the new effect has zero performance cost.

Evidence: [rendering/lifecycle measurements](liquid-glass-browser-results.json),
[accessibility scan results](liquid-glass-accessibility-results.json),
[contrast calculations](liquid-glass-contrast-results.json),
[dark mobile](liquid-glass-390-dark.png),
[light mobile](liquid-glass-390-light.png),
[dark desktop](liquid-glass-1440-dark.png),
[light desktop](liquid-glass-1440-light.png).

The tests use local Chromium with emulated touch and software WebGL. They can
verify real shader pixels, state changes and cleanup; they cannot promise a
physical phone’s GPU frame rate, battery life, Safari behavior or live Vercel
deployment. No new Lighthouse score, top Google ranking or Apple certification
is claimed. Eager Motion On videos remain the owner’s deliberate loading choice;
this work does not change that bandwidth tradeoff.
