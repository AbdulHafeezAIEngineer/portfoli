# Verification — 15 October 2026

This is a **review build**, not a verified live deployment. `SECURITY_STATUS.md` records the remaining critical Next.js 14 dependency blocker and the pending major-version decision.

## Passed

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

## Local Lighthouse

Mobile-emulated audit against the local production build, with the local database content source:

| Category | Score |
|---|---:|
| Performance | 91 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

Scores vary with device, CPU load, image replacements, network, third-party widgets, database latency and the production host. Lighthouse is not a dependency security certification. A compact result is in `docs/lighthouse-summary.json`; the standalone HTML/JSON reports are also prepared in the workspace.

## Still needs real owner configuration/verification

- A patched framework-major decision before external production launch. Current production dependency audit: one critical affected package, Next.js 14; other reported production findings were resolved.
- Specific AI-tool names and the owner's portrait remain clearly marked placeholders. The owner has now supplied 2+ years of experience and time invested in AI tools for About Me. The supplied Coursiv certificate and its award details are displayed; external issuer verification has not been performed.
- Actual public HTTPS origin settings, external database/Redis/storage credentials, OpenAI key for the three API demos, Gmail App Password and Cloudflare Turnstile keys in private settings. The real Botpress connection uses the owner's supplied public scripts; verify its publishing state, domain permissions and live replies on the deployed site.
- Live Gmail inbox delivery, real OpenAI/provider replies, actual Blob upload, real Redis REST service and real Turnstile challenge verification. Mock-based checks do not establish these integrations.
- Native Prisma migration CLI deployment to the owner's cloud database. Its verified engine download was blocked in the current environment; the network draft adds `binaries.prisma.sh` but must be reviewed/saved and published to activate. Initial SQL/seed were independently verified against local PostgreSQL.
- Physical-device microphone recognition and speech playback over HTTPS. Text fallback and application controls do not prove actual speech-service/device behavior.
- Public hosting deployment, DNS/SSL, backups/recovery, retention settings and the launch checks in `DEPLOYMENT.md`.
