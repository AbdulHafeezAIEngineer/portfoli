# Four new custom concept websites

The selected portfolio now contains exactly four original concepts. The previous Elvora external/promotional card is removed from the selected grid.

| Website | Route | Visual direction | Working sample interaction |
|---|---|---|---|
| Solenne | `/demo/solenne` | Warm coastal photography, ivory/olive, editorial serif | Suites/villas filter, room selection, arrival/departure validation and local stay summary |
| Vanta Motors | `/demo/vanta` | Cinematic graphite/lime automotive campaign | Three model specifications, finish radio controls and local configuration summary |
| Aster Care | `/demo/aster` | Sage/ivory, rounded forms, calm care navigation | Care-category filtering and sample visit planner without personal/health data |
| Kovo Studio | `/demo/kovo` | Mineral/terracotta, architectural editorial grid | Residential/workplace filtering, illustrated design studies and local brief builder |

All are fictional **Concept Projects**. Original generated images and SVG illustrations support working Next.js pages; the gallery images are real browser captures of those pages. No client commissions, real buildings, clinical outcomes, reservations, vehicle sales or submitted enquiries are claimed. Sample forms do not call an external service or persist data.

`data/concepts.ts` contains page copy, themes, example items, labels and disclosures. `data/concept-images.ts` contains the complete prompts for the four generated hero assets in `public/concepts/`. `data/projects.ts` builds the selected cards and 16 gallery paths from the concept data. `components/concept-site.tsx` implements the different page layouts and interactions, styled by scoped `app/demo/concepts.css`. These pages run in the same Next.js app.

`npm run capture` renders the four selected pages at 1440×900 and 390×844, both 2×, into `public/projects/{slug}-1..4.webp`. See `SCREENSHOTS.md` for the exact filenames. Gallery navigation, the 3D laptop/phone compositions and full-page demo links use the existing portfolio components.

The Forte O Level Study Assistant is now a featured wide card with a static chat preview matching the supplied greeting. The entire card is a single accessible **Open chat** button. Clicking its preview, text or action opens the existing Botpress panel immediately; the adapter opens the provider widget when ready. The other three API demo cards remain available.

The default file content mode uses the new selection immediately. If an owner has switched to database mode, unpublish earlier project records and add/seed the four new project IDs (`solenne`, `vanta`, `aster`, `kovo`). Seeding preserves existing records; it does not silently remove previous projects. Rename the existing `real` Botpress bot in admin if needed. No schema migration is required.
