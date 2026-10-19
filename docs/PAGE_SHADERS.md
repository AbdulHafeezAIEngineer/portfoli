# Visible category backgrounds

The six requested category pages now paint a full-viewport shader background,
including while scrolling long pages. This replaces the faint approval-only
proposal. The homepage does not mount this background or request its runtime.

| Route            | Actual shader scene                                     |
| ---------------- | ------------------------------------------------------- |
| `/websites`      | Violet/black noise fields with contours                 |
| `/ai-bots`       | Violet/black satin folds and a signal grid              |
| `/bunch-of-work` | Violet/black fields and flowing strands                 |
| `/about`         | Violet/black satin folds                                |
| `/testimonials`  | Neutral grey atmosphere, particles and floating reviews |
| `/contact`       | Violet/black studio lighting                            |

Light mode uses corresponding pale violet or neutral surfaces. Shader output
passes through a duotone layer: all color endpoints come from the existing
`data/theme-tokens.json` via `lib/page-shader-preset.ts`. No second hard-coded
component palette is introduced. The original content, portrait, project art,
videos, custom curved gallery, navigation, footer and application logic remain.
Category tabs explicitly paint above the fixed canvas.

## Runtime and loading

`shaders@4.0.4` is pinned through the normal npm lockfile and used through its
public vanilla API in a Next.js client component. Repository reviewed:
https://github.com/shader-effects-inc/shaders, revision
`81fd4ece5d493ca6c424a2af41f0e2c361ec8258`; package license MIT.
The requested library's setup CLI ran with `--no-auth --no-skill --yes`.
No paid preset, account, global installer, external texture or telemetry is used.

The runtime imports dynamically after the saved site preference is ready and
only when motion is enabled and the main content is visible. The scene uses an
explicitly owned low-power GPU device. Leaving the page, hiding the tab,
scrolling the main content out of view, Motion Off and appearance accessibility
preferences dispose the renderer and device. Async starts are serialized;
stale or cancelled initialization also releases its device. No shared default
SDK device is retained by this integration. Testimonials' local pause button
stops both the cards and the shader.

The canvas covers the viewport; its actual render buffer is bounded to
960 by 720, including high-density phones, independently of the sharp native
HTML text and controls above it. Local static WebP images generated from actual
shader frames supply the same complete design while loading, with Motion Off,
without JavaScript, or when WebGPU is unavailable. Increased contrast, forced
colors and reduced transparency use a solid background.

The SDK costs about 2.60 MB raw / 704 KB gzip across its three lazy chunks in
this build. This is an enabled category-page download, cached across routes;
it is excluded from fresh homepage and saved-Off requests. It adds real GPU
work while active. No physical-device frame-rate or battery claim is made.
See `page-shader-bundle-results.json` for measured chunk sizes.

## Testimonials

The existing four illustrated, visibly fictional review examples remain labeled.
No person or endorsement from the reference image was copied. Cards stay within
their grid cells with different 19/22/25/28-second cycles, offsets and directions:
desktop translation up to 12px horizontally/10px vertically and 0.6-degree
rotation; phone up to 4px/6px and 0.3 degrees. Gaps leave room for the motion.
Hover pauses the hovered desktop card. Global Off, local Pause, offscreen state
and hidden tabs retain their existing control behavior.

## Verification

- Production build, lint and type checks pass; production dependency audit has
  zero reported vulnerabilities.
- `npm run test:shaders:browser`: six pages at 1440/390px in both themes, with
  phone DPR 3 and OS reduced motion while the site's explicit Motion On is
  selected. Checks actual opaque WebGPU pixels, changing frames, bounded
  buffers, full viewport coverage, small-text contrast, original content,
  native video playback/form entry, global Off device release, homepage/runtime
  exclusion and unsupported-browser static rendering.
- `node tests/page-shader-lifecycle.browser.mjs`: hidden tab, main content out of
  view, higher contrast, live theme changes, cancellation during initialization
  and native SPA navigation home release GPU devices.
- `npm run test:pages:browser`: original ten-page navigation, content, mobile 3D,
  themes, saved Off, sitemap and no-JavaScript checks pass.
- `npm run test:testimonials:browser`: desktop, phone, OS reduced motion with
  explicit On, pause/resume, hover, offscreen state and no-JavaScript checks pass.
- All pixels of the twelve lossless fallback images were inspected against the
  body/muted/accent text tokens: the measured minimum is 4.59:1. Actual animated
  frame checks also require 4.5:1. These measurements concern the new backgrounds;
  they do not certify text baked into photographs/videos or every existing UI.

Evidence is in `page-shader-browser-results.json`,
`page-shader-lifecycle-results.json`, `page-shader-poster-contrast.json` and the
`page-shader-*.png` screenshots. Software Chromium's screenshot compositor omits
its WebGPU canvas, so screenshot tooling places the canvas's own pixel readback
at the identical position. That workaround is test-only; production uses the
real animated canvas. Physical phones and Safari were not available for testing.

## Changed implementation files

- `components/page-shader-background.tsx`: client lifecycle, real GPU renderer,
  theme observation, static background, visibility/preferences and cleanup.
- `lib/page-shader-preset.ts`: route whitelist, scene composition and colors.
- `app/page-shaders.css`: category-only full background, layering, neutral
  testimonial cards, bounded floating movement and appearance fallbacks.
- `components/site-shell.tsx`, `app/layout.tsx`: six-route mounting and CSS import.
- `components/testimonials.tsx`: staggered review motion timing.
- `package.json`, `package-lock.json`, `shaders.config.ts`: pinned SDK and tooling.
- `public/shaders/`: twelve locally generated fallback images.
- `tests/page-shaders.browser.mjs`, `tests/page-shader-lifecycle.browser.mjs`,
  `tests/testimonials-floating.browser.mjs`: rendering/lifecycle tests and the
  existing review regression adapted to the new background.
- This report, verification/README notes, browser evidence and refreshed delivery
  source sections document the release.

The cloud environment's proxy denies requests to the live domain and GitHub's
hosting/status API. Git repository publication can be verified independently;
external hosting completion cannot be certified from that restriction. A Git
push is not itself proof that the hosting build has completed.
