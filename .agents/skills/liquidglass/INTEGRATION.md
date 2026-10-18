# Elvora Liquid Glass skill

Source: https://github.com/RmaNMetaverse/Apple-LiquidGlass-Skill
Pinned commit: `86c92a3074d0d16826e5612dbd0fc3003fa5c3c0`.
Installed 18 October 2026 as project-local development guidance, invoked with
`$liquidglass`. All five imported skill/reference/example/readme files match
upstream; original hashes are in UPSTREAM-SHA256.json. Existing Emil and Apple
HIG skill files are not overwritten.

Upstream describes a WebGL runtime powered by @ybouane/liquidglass. Installing
this skill does not install or run that package. Its examples are reference
material, not application code, and include colors/layouts that are unsuitable
for Elvora. The owner explicitly selected actual WebGL refraction with a new dependency,
overriding the earlier no-new-libraries limit for this integration. The website
uses a dynamically imported runtime behind the existing navigation controls,
with a local static texture and native live HTML above it. CSS is its fallback.
The runtime is pinned through a local npm tarball because the published package
has a broken install hook; see vendor/README.md and the combined final review.

The remote installers are not executed: they write to multiple global agent
folders. This installation is scoped to this repository and contains no remote
CDN imports or tracking. Git history and duplicate Copilot copies are omitted.
Upstream includes no LICENSE file; retain its README and attribution, and do
not apply the separate Emil license to this material.

Preserve Elvora’s purple/black/white theme, supplied work artwork/media, content,
layout, mobile touch behavior, Motion Off, consent and Botpress boundary. Scope
any material effect to navigation/control chrome; avoid whole-page DOM capture,
rainbow fringes, draggable navigation and animated distortion behind body text.
Use solid fallbacks when the effect is unavailable or transparency/contrast
preferences require them. Do not claim a CSS approximation is WebGL refraction.
