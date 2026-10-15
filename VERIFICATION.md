# Verification — 15 October 2026

This is a **review build**, not a verified live deployment. `SECURITY_STATUS.md` records the remaining critical Next.js 14 dependency blocker and the pending major-version decision.

## Latest four-concept and direct-chat update

- Built four new sample websites: Solenne (hotel), Vanta Motors (electric automotive), Aster Care (wellness/clinic), and Kovo Studio (architecture). Selected Work now contains exactly these four; the previous featured Elvora card is removed. Archived demo routes remain available separately.
- Passed `npm run lint`, `npm run typecheck`, `npm run test:chat` (16 tests) and the final production build. The existing contact/database/security integrations were unchanged; their earlier checks are recorded below.
- Browser checks passed for hotel room filters and date validation, car model/finish configuration, clinic service filters and sample visit planning, and architecture filters/local project briefs. These flows generate local sample summaries and do not make reservations, take payment or store personal information.
- All four concept pages passed axe accessibility scans after contrast refinements. Their navigation, layouts and section boundaries were checked at 320, 390, 768, 1024 and 1440 pixels.
- Captured 16 actual browser screenshots from the implemented pages: home, collection, mobile and feature views for every site. Original generated hero imagery is disclosed in `data/concept-images.ts` and `SCREENSHOTS.md`; these are fictional concept projects.
- Verified the four project galleries, four thumbnails each, matching demo links, arrow keys, Escape and focus return. Production HTTP checks passed for the four routes and hero images, selected-work grid, sitemap and real Botpress embed document. Preview: `docs/new-work-preview.png`.
- Forte now has a clearly labeled HTML chat preview matching the supplied greeting, with the entire card and preview acting as a single accessible Open chat button. Desktop/mobile SDK fixtures passed one-click opening from the preview, sequential script loading, ready/open, in-frame messages, storage, close cleanup and retry. Both themes passed axe checks for the updated bot cards, and layouts were checked from 320 to 1440 pixels. Preview: `docs/forte-bot-card.png`. Actual Botpress replies remain unverified because its public assets return HTTP 403 from this cloud environment.

## Earlier verified functionality

- Dependency installation and the pinned Prisma JS/WASM client generation.
- `npm run lint`, `npm run typecheck`, `npm run build`.
- `npm run test:chat`: 16 tests; server-only prompts, message/input guards, quotas, provider adapters, configured extra bots, contained embeds and Botpress's two-script/nonce/host-validation contract.
- `npm run test:contact`: 9 tests; validation, fixed-recipient mail, origin checks, honeypot, rate protection, credential absence and honest error handling.
- `npm run test:security`: 6 tests; password rules, RFC 6238 TOTP vectors, authenticated encryption, strict schemas, Turnstile hostname/action and actual image decoding/re-encoding/rejection.
- Actual initial migration SQL applied to an isolated temporary local PostgreSQL instance; additive seed completed.
- Real PostgreSQL/Auth.js browser login with Secure, HttpOnly, SameSite=Strict cookies; create/edit/delete/reorder and updated public rendering; contact inbox read/delete and delivery status; opt-in chat logs; audit records; cross-origin and invalid-input rejection.
- Authenticator setup, code verification, login, encrypted-secret storage and password-version session invalidation. Database failure counts, five-attempt/15-minute lockout, expiry recovery and CLI password/2FA recovery were checked without printing credentials.
- SMTP and AI responses in integration checks used explicit fixtures; no actual email delivery or paid AI request was asserted. Final SMTP fixtures prohibited real SMTP network connections.
- Four distinct demo pages, property filters, demo billing selector, demo shopping bag, accessible mobile navigation and actual 16 WebP screenshots captured by Playwright at the requested 2× desktop/mobile sizes.
- Four-image galleries with thumbnails, wraparound arrows, Escape, actual concept-site links; certificate zoom/keyboard/focus; form validation, error preservation and success reset; dark/light accessibility; 320px–1440px layouts.
- Deferred AI-tab/hash navigation, all four bot cards, pending real-bot state, three API demos, per-bot history retained across category changes, clear conversation, accessible modals and mobile chat layout.
- Production file tracing includes Prisma's query compiler WASM for routes that use the database.
- Supplied Coursiv certificate update: rendered the original PDF to a 2200×1555 WebP; checked the exact title, issuer, 31 October 2024 date, 6-hour duration and certificate ID against the document. Re-ran lint/typecheck and browser checks at 1440px/390px for image loading, absent placeholder wording, fullscreen zoom, keyboard shortcuts, Escape, focus return and overflow. Preview: `docs/certificate-showcase.png`.
- Branding/About Me update: E-and-amber-dot SVG logo in navbar/footer/favicon, Elvora wordmark and portrait label, About Me navigation, the owner's supplied 2+ years of experience, three story paragraphs and four full-stack blocks. The production build passed. Browser checks against both development and production passed at 320px–1440px, including mobile navigation and certificate zoom; dark/light axe scans reported no violations. `docs/brand-preview.png`, `docs/about-preview.png` and `docs/mobile-about-preview.png` show this update.
- Botpress connection: the supplied Forte Institute Study Assistant loader/configuration URLs are configured in the first real card. Explicit SDK fixtures verified lazy sequential loading, init selector, ready/open, provider storage, in-frame chat, close cleanup, desktop/mobile layout, errors and retry. These checks do not verify Botpress's actual SDK behavior or AI replies. Direct asset requests returned HTTP 403 from this cloud environment. Card preview: `docs/forte-bot-card.png`; setup details: `BOTPRESS_SETUP.md`.
- Earlier premium visual update (its Elvora card is superseded by the four-concept update above): Forma Living was replaced in Selected Work by the supplied Elvora URL and a clearly labeled generated 3D promotional render. Checked the external HTTPS link/rel, single-artwork gallery, remaining four-image concept galleries, About Me portrait frame, hover lighting/tilt, reduced-motion behavior and 320px–1440px layouts. Fixed a decorative-glow overflow at tablet width. Both themes reported zero axe violations. The production build and local HTTP 200/gallery-link smoke check passed. The six security tests passed, including HTTPS project-link acceptance and malformed/unsafe-link rejection. The personal photo is still missing and stays visibly labeled as a placeholder.

## Local Lighthouse

Earlier mobile-emulated audit against the premium local production build, in file content mode, before the four-concept/direct-chat update above. Lighthouse was not rerun for the latest update:

| Category | Score |
|---|---:|
| Performance | 85 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

The earlier build recorded 91 performance; the earlier premium visual update recorded 85 on its final run (82–86 across local runs). Trimming the initial hero animation reduced measured heading render delay, and CSS scroll progress avoids an extra client hook. Performance remains below the earlier result. Scores vary with device, CPU load, image replacements, network, third-party widgets, database latency and the production host. Lighthouse is not a dependency security certification. A compact result is in `docs/lighthouse-summary.json`; the standalone HTML/JSON reports are also prepared in the workspace.

## Still needs real owner configuration/verification

- A patched framework-major decision before external production launch. Current production dependency audit: one critical affected package, Next.js 14; other reported production findings were resolved.
- Specific AI-tool names and the owner's portrait remain clearly marked placeholders. The owner has now supplied 2+ years of experience and time invested in AI tools for About Me. The supplied Coursiv certificate and its award details are displayed; external issuer verification has not been performed.
- An owner-uploaded photo is needed to complete the About Me portrait area. The previous Elvora featured card has been removed; no screenshot of that external website is needed for the current selected-work grid.
- Actual public HTTPS origin settings, external database/Redis/storage credentials, OpenAI key for the three API demos, Gmail App Password and Cloudflare Turnstile keys in private settings. The real Botpress connection uses the owner's supplied public scripts; verify its publishing state, domain permissions and live replies on the deployed site.
- Live Gmail inbox delivery, real OpenAI/provider replies, actual Blob upload, real Redis REST service and real Turnstile challenge verification. Mock-based checks do not establish these integrations.
- Native Prisma migration CLI deployment to the owner's cloud database. Its verified engine download was blocked in the current environment; the network draft adds `binaries.prisma.sh` but must be reviewed/saved and published to activate. Initial SQL/seed were independently verified against local PostgreSQL.
- Physical-device microphone recognition and speech playback over HTTPS. Text fallback and application controls do not prove actual speech-service/device behavior.
- Public hosting deployment, DNS/SSL, backups/recovery, retention settings and the launch checks in `DEPLOYMENT.md`.
