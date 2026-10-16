# Elvora: supplied-reference design adaptation

The owner supplied seven images in this update; two show the same footer family. They are now available and were used to adapt the structure, spacing and card language. The latest implementation supersedes the earlier original layouts made before these images were received.

| Supplied visual | Elvora adaptation |
|---|---|
| Rounded 2×2 service grid | Four supplied services, centered section heading, gold icon circles, quiet tags, contact links and charcoal rounded cards |
| Five connected workflow cards | All five supplied AI-powered website steps in a horizontal sequence on desktop and readable cards on mobile |
| Vertical experience timeline | Four owner-supplied journey chapters, gold timeline dots, phase badges and factual bullets; no invented dates or numeric success claims |
| Portrait-left About block | Portrait frame on the left and a concise story/AI philosophy on the right; no copied person/photo or statistic cards |
| Feedback card family | Rounded charcoal review card with decorative offset cards; the requested one-at-a-time carousel and controls are retained |
| Three-column footer | Elvora identity, Navigation and Connect columns, owner-supplied GitHub/Instagram/email, and a compact legal/copyright row; the animated closing wordmark remains |

The real personal portrait and genuine approved review copy/client portraits remain pending. The About image and testimonial previews remain honestly labeled. Other people's reference testimonials, faces, locations, dates and accomplishments are not reused as the owner's facts.

## Motion

`TextReveal` uses clipped word masks, staggered spring transitions and one-time viewport entry. `Reveal` adds a short blur/scale/vertical transition to cards and image blocks. The existing logo shine, orbit, screenshot hover and scroll drift provide additional motion. Reduced-motion preferences disable these entrances, and a noscript style keeps headings and content visible without JavaScript.

The Framer URL `https://majd-portfolio.framer.website/` returned CONNECT/HTTP 403 from this environment again. Its exact live easing, sequence and timing could not be inspected or verified. The implementation matches the described pop-up/reveal behavior and supplied static composition; it does not claim an exact measured animation copy.

## My bunch of work

The separate collage below Selected Work now combines four existing concept website captures with six new coded UI studies. All are labeled concept work. No additional client count or commissioned-work claim is implied.

| UI study | Route | Art direction | Actual screenshot |
|---|---|---|---|
| noma | `/studies/noma` | Sage/ivory financial dashboard | `/studies/noma.webp` |
| ORBIT | `/studies/orbit` | Violet/dark AI analytics | `/studies/orbit.webp` |
| elsewhere. | `/studies/elsewhere` | Coastal travel editorial | `/studies/elsewhere.webp` |
| FORM / | `/studies/form` | Graphite/orange fitness and sculptural rings | `/studies/form.webp` |
| offscript. | `/studies/offscript` | Cream/coral creative typography | `/studies/offscript.webp` |
| aura | `/studies/aura` | Lilac/serif beauty and CSS product art | `/studies/aura.webp` |

These are interface presentations with fictional brands, balances, metrics and products. Their navigation/CTA links lead to design details or back to the portfolio. They do not submit financial transactions, appointments or orders. Travel imagery reuses the disclosed original generated Solenne scene; other illustrations/charts/products are original CSS/SVG. Screenshots are captured from the actual pages, not substituted generated website pictures.

Copy and themes live in `data/studies.ts` and `data/studio.ts`. `components/design-study.tsx` and `app/studies/studies.css` implement the six designs. The reusable collage uses the existing project records plus those studies; no schema migration or extra credentials are required.

Capture from an existing local app using `CAPTURE_BASE_URL=http://127.0.0.1:3008 npx tsx scripts/capture-studies.ts`, or stop other Next.js processes and run `npx tsx scripts/capture-studies.ts` to start/stop its own temporary server. It uses a 1440×900 viewport at 2× resolution and writes six WebP files plus `public/studies/capture.json`. Do not run a build and development server against the same `.next` output simultaneously.
