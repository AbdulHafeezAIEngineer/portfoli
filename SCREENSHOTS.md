# Current concept-site screenshots

Selected Work contains exactly four new custom concepts. Each gallery uses actual Chromium screenshots of its working Next.js demo. The imagery within those pages is original AI-generated fictional imagery plus original SVG illustrations; it does not depict real client work. The Elvora external/promotional card has been removed.

Desktop: 1440×900 at 2× (2880×1800). Mobile: 390×844 at 2× (780×1688). `npm run capture` captures these four selected demos. The hero assets are optimized WebP files in `public/concepts/`; their complete generation prompts are in `data/concept-images.ts`.

| Project | Route | Industry |
|---|---|---|
| Solenne | `/demo/solenne` | Boutique hotel |
| Vanta Motors | `/demo/vanta` | Automotive |
| Aster Care | `/demo/aster` | Private clinic |
| Kovo Studio | `/demo/kovo` | Architecture |

## Exact screenshot filenames

| Project | View | Filename |
|---|---|---|
| Solenne | Home page desktop | `public/projects/solenne-1.webp` |
| Solenne | Collection / inner page | `public/projects/solenne-2.webp` |
| Solenne | Mobile view | `public/projects/solenne-3.webp` |
| Solenne | Feature / design details | `public/projects/solenne-4.webp` |
| Vanta Motors | Home page desktop | `public/projects/vanta-1.webp` |
| Vanta Motors | Collection / inner page | `public/projects/vanta-2.webp` |
| Vanta Motors | Mobile view | `public/projects/vanta-3.webp` |
| Vanta Motors | Feature / design details | `public/projects/vanta-4.webp` |
| Aster Care | Home page desktop | `public/projects/aster-1.webp` |
| Aster Care | Collection / inner page | `public/projects/aster-2.webp` |
| Aster Care | Mobile view | `public/projects/aster-3.webp` |
| Aster Care | Feature / design details | `public/projects/aster-4.webp` |
| Kovo Studio | Home page desktop | `public/projects/kovo-1.webp` |
| Kovo Studio | Collection / inner page | `public/projects/kovo-2.webp` |
| Kovo Studio | Mobile view | `public/projects/kovo-3.webp` |
| Kovo Studio | Feature / design details | `public/projects/kovo-4.webp` |

## Capture

```bash
npx playwright install chromium
npm run capture
```

If the app is already running, set `CAPTURE_BASE_URL` to its local origin. Stop development before a production build because both use `.next`. Capture opens fresh pages so filters and forms begin in their default states. Each `{slug}-capture.json` records route, viewport and method.

## Archived assets

The original restaurant/real-estate/SaaS/store demos and prior Elvora promotional image are retained as archived assets, without appearing in the selected grid or current sitemap. They are not silently deleted from an owner database. For database mode, unpublish older project records and add the four current entries, or use `CONTENT_SOURCE=files`.
