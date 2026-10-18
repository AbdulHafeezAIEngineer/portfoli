# Original portrait and transparent collection video

The owner supplied a PDF containing one embedded 1312×1199 portrait. The embedded image was extracted directly, without a screenshot or generated replacement, and encoded as a 200KB WebP for the site. `components/experience.tsx` now displays it within the original rounded About frame. The frame, purple backing, owner name and signature remain; the large Code/Context/Craft poster text is replaced by the portrait. Small readable labels retain the existing identity. The image is cropped by CSS to fit the frame; the stored image preserves the full photograph and its original appearance.

## Collection background

The rotating-design clip has an opaque dark rectangular backdrop. `scripts/prepare-collection-transparency.py` prepares an outer silhouette across all 192 frames, uses a temporal median to stabilize its outline, and feathers its edge. It preserves the gallery's interior, including dark website designs, rather than making every black pixel transparent.

- Desktop and mobile WebM files contain a real alpha channel. Decoding confirms clear corner pixels (alpha 0) and an opaque gallery center (alpha 255).
- Matching MP4 fallbacks are precomposited onto the purple panel color derived from `data/theme-tokens.json`. MP4 does not carry an alpha channel.
- The poster is an alpha WebP. Collection frame backgrounds are transparent, so the section's purple shows through.
- `VisibilityVideo` checks one clear corner once after video data loads. Browsers that discard video alpha, or restrict the canvas check, switch to the matching MP4. There is no continuous canvas rendering or client-side background removal.
- Updated `home-collection-transparent*` URLs prevent a previously cached opaque poster or clip from being reused. Other showcase URLs are unchanged.

Both themes use the same intentional purple section. Its media keeps the existing rounded corners, local silent loops, mobile variants, offscreen pause and global Motion Off. Other pages, original interactive collection wall, artwork, consent/Botpress and private settings are preserved. No application dependency or credential was changed. The PDF itself is not published.

## Files

- `components/experience.tsx`, `public/abdul-hafeez.webp`: original portrait in the established design.
- `app/pages.css`: portrait fitting/readable labels and transparent collection containers.
- `components/VisibilityVideo.tsx`: alpha capability check and precomposited MP4 fallback.
- `public/videos/home-collection-transparent*`: alpha desktop/mobile WebM, purple desktop/mobile MP4 and transparent poster, replacing the earlier opaque asset names.
- `scripts/prepare-collection-transparency.py`: repeatable media preparation using ffmpeg, NumPy and Pillow; these tools are needed only to prepare assets, not to run or build the website.
- `tests/showcase-videos.browser.mjs`: actual alpha sampling, protected gallery center, normal playback and simulated missing-alpha fallback coverage.

To regenerate video assets with the original supplied clip available:

```bash
python3 scripts/prepare-collection-transparency.py /path/to/original-rotating-gallery.mp4
```

Re-run media preparation if the fixed purple panel palette changes, so the MP4 fallbacks continue to match it.

## Validation

Production build (including lint and TypeScript), all five showcase loops on desktop/mobile with both OS preference settings, and simulated absent-alpha support at 390/1440px passed. The browser checks sample actual decoded alpha, verify purple fallback pixels, retain Motion Off/On and offscreen pause, and report no runtime or provider-request errors.

The portrait and transparent Motion Off poster were checked at 390/1440px. The original photograph loads within its rounded frame, alt text names the owner, and the name/signature remain. [Four WCAG A/AA scans](portrait-transparency-accessibility.json) cover About in both themes with zero violations. Local checks do not verify the external Vercel deployment or real owner login.

## Previews

- [Portrait desktop](owner-portrait-1440.png) · [Portrait phone](owner-portrait-390.png)
- [Transparent collection desktop](home-collection-loop-1440.png) · [Transparent collection phone](home-collection-loop-390.png)
