# Current concept-site screenshots

Selected Work contains exactly four new custom concepts. Each gallery uses actual Chromium screenshots of its working Next.js demo. The imagery within those pages is original AI-generated fictional imagery plus original SVG illustrations; it does not depict real client work. The Elvora external/promotional card has been removed.

Desktop: 1440×900 at 2× (2880×1800). Mobile: 390×844 at 2× (780×1688). `npm run capture` captures these four selected demos. The hero assets are optimized WebP files in `public/concepts/`; their complete generation prompts are in `data/concept-images.ts`.

| Project      | Route           | Industry       |
| ------------ | --------------- | -------------- |
| Solenne      | `/demo/solenne` | Boutique hotel |
| Vanta Motors | `/demo/vanta`   | Automotive     |
| Aster Care   | `/demo/aster`   | Private clinic |
| Kovo Studio  | `/demo/kovo`    | Architecture   |

## Exact screenshot filenames

| Project      | View                     | Filename                         |
| ------------ | ------------------------ | -------------------------------- |
| Solenne      | Home page desktop        | `public/projects/solenne-1.webp` |
| Solenne      | Collection / inner page  | `public/projects/solenne-2.webp` |
| Solenne      | Mobile view              | `public/projects/solenne-3.webp` |
| Solenne      | Feature / design details | `public/projects/solenne-4.webp` |
| Vanta Motors | Home page desktop        | `public/projects/vanta-1.webp`   |
| Vanta Motors | Collection / inner page  | `public/projects/vanta-2.webp`   |
| Vanta Motors | Mobile view              | `public/projects/vanta-3.webp`   |
| Vanta Motors | Feature / design details | `public/projects/vanta-4.webp`   |
| Aster Care   | Home page desktop        | `public/projects/aster-1.webp`   |
| Aster Care   | Collection / inner page  | `public/projects/aster-2.webp`   |
| Aster Care   | Mobile view              | `public/projects/aster-3.webp`   |
| Aster Care   | Feature / design details | `public/projects/aster-4.webp`   |
| Kovo Studio  | Home page desktop        | `public/projects/kovo-1.webp`    |
| Kovo Studio  | Collection / inner page  | `public/projects/kovo-2.webp`    |
| Kovo Studio  | Mobile view              | `public/projects/kovo-3.webp`    |
| Kovo Studio  | Feature / design details | `public/projects/kovo-4.webp`    |

## Capture

```bash
npx playwright install chromium
npm run capture
```

If the app is already running, set `CAPTURE_BASE_URL` to its local origin. Stop development before a production build because both use `.next`. Capture opens fresh pages so filters and forms begin in their default states. Each `{slug}-capture.json` records route, viewport and method.

## Archived assets

The original restaurant/real-estate/SaaS/store demos and prior Elvora promotional image are retained as archived assets, without appearing in the selected grid or current sitemap. They are not silently deleted from an owner database. For database mode, unpublish older project records and add the four current entries, or use `CONTENT_SOURCE=files`.

## Additional UI-study collage assets

Six actual 1440×900 browser captures at 2× resolution now live in `public/studies/`: `noma.webp`, `orbit.webp`, `elsewhere.webp`, `form.webp`, `offscript.webp` and `aura.webp`. They show the original coded `/studies/[slug]` pages with fictional demo content. Refresh with `npx tsx scripts/capture-studies.ts`; stop other Next.js processes first or provide `CAPTURE_BASE_URL`. These are separate from the four complete selected concept websites and their 16-image galleries.

## Earlier editorial portfolio previews

`docs/editorial-{tools,skills,domains,journey,reviews,contact,footer}-{desktop,mobile}.png` capture the earlier editorial portfolio sections at 1440px and 390px. They show the implemented Elvora designs, not the reference uploads. Reduced-motion capture mode reveals every heading/card, and fixed navigation is hidden for unobstructed section previews. Review/profile placeholders remain clearly identified. Earlier `reference-` and `studio-` captures document previous design phases.

## Agency completion previews — 17 October 2026

`docs/agency-{home,about,faq,contact,service,project}-{desktop,mobile}.png` are twelve actual production-build public captures at 1440px/390px. They show original brand About artwork, genuine supplied content, FAQs and service/project notes. Fixed widgets are hidden only during unobstructed section captures. Reduced motion is used for still images; motion is separately verified in the browser.

`docs/agency-admin-{dashboard,inbox}-{desktop,mobile}.png` show actual local PostgreSQL-backed admin pages. Inbox material is explicitly named temporary QA fixture data, not customer information. Fixture records were removed after testing. These captures do not establish a live production database or deployment.

The ordinary public site hides reviews until genuine permission-approved records exist; earlier review-preview images are historical. `docs/agency-performance.json` records the current local mobile Lighthouse result and limits.
