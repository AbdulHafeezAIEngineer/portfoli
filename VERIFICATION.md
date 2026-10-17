# Verification — 17 October 2026

This records the current **local production build**. It does not establish that the external hosting deployment, real provider credentials or live inbox delivery work. The approved Next.js 15.5.28 migration resolves the earlier Next.js 14 production audit blocker. Remaining development-tool findings are documented separately.

## Owner sign-in follow-up

The reported return-to-login behavior was reproduced locally with missing private authentication settings. Auth.js's client helper can navigate to its error route when provider discovery fails, leaving the custom login screen apparently unchanged. The public hosting request was blocked by this cloud network's CONNECT policy; production variables/database/account state were not inspected or changed.

Replaced that submission path with CSRF-protected credential submission that retains safe inline errors and verifies database-authorized session cookies before navigating. Added a setup-incomplete notice, business-email prefill, old error-query feedback, and distinct invalid-credential/outage/rate/cookie messages. Public CMS metadata now lives on the homepage rather than the shared root layout, so private sign-in can render independently of the CMS database. No secrets or account-existence details are exposed.

Added private opt-in `ADMIN_BOOTSTRAP_ON_BUILD` activation. Against a separate empty local PostgreSQL database, it applied reviewed migrations and created the business-email owner with a generated test-only password. Repeated runs preserved the account/hash, including with the temporary password removed. Preview and default-off paths were checked. No public registration/setup endpoint or automatic password reset was added. `OWNER_LOGIN.md` gives the remaining Vercel activation steps.

`test:login`: **5 passed**. Security suite now **8 passed**, including configuration readiness. Production build, lint and typecheck passed. Real Chromium HTTPS checks passed for the setup notice, actual business-owner dashboard login/logout, wrong-password feedback, dropped session-cookie feedback, safe outage/error-query messages and zero page/hydration errors. The actual API agency/auth suites were rerun against the new owner fixture. Stopping the actual disposable database exposed and then verified the root-metadata dependency fix: sign-in remains readable and shows a safe unavailable error without navigation or cleared input.

The earlier website performance/public screenshots below describe the agency build. Public rendering is unchanged by this admin-only follow-up; Lighthouse was not rerun for it. Live owner activation still requires private Vercel/database configuration and remains unverified.

## Install, framework and unit checks

- Fresh locked `npm ci --cache /tmp/portfoli-npm-cache --no-audit --no-fund` passed and generated the pinned Prisma JavaScript/WASM client.
- `npm run lint`, `npm run typecheck` and the optimized Next.js 15.5.28 production build passed. Homepage first-load JavaScript is approximately 170 kB; service/project detail pages approximately 119 kB. The expected Open Graph edge-runtime static-generation notice is not a build failure.
- `npm run test:chat`: **16 passed**. Prompt/input/origin guards, provider contracts, quotas, controlled embeds and error handling.
- `npm run test:contact`: **13 passed**. Validation, fixed-recipient safe SMTP, missing credentials, origin/honeypot/quota behavior, optional fields, durable storage without SMTP, notification failure after acceptance and database failure without false success.
- `npm run test:security`: **8 passed**. Password byte rules, RFC 6238 TOTP vectors, authenticated encryption, strict content/connection/image schemas, Turnstile verification, actual image decoding/re-encoding, review publication permission and admin configuration readiness.
- `npm run test:login`: **5 passed**. Missing setup, safe login errors, CSRF submission, authorized cookie verification and malformed responses.
- `npm run test:consent`: **5 passed**. Malformed/expired/future/version handling, current accept/reject choices and equivalent initial-render visibility-script validation including blocked storage.
- Current production audit: **0 vulnerabilities**. Full audit: **7 high development-tool entries**, through unpatched braces/glob consumers. That full audit is not reported as clean.

## Actual PostgreSQL and production HTTPS

A disposable PostgreSQL 17.6 instance bound to loopback was used, with generated private test credentials and no production database. The actual Prisma migration CLI successfully applied both initial and additive agency migrations. First-admin bootstrap and development seed succeeded; repeated bootstrap and production demo seed were refused as intended.

`tests/agency.integration.mjs`: **8 passed** (including subtests). Actual Auth.js Credentials login and PostgreSQL queries were used. Verified unauthorized admin pages, all resource verbs and upload rejection; Secure/HttpOnly/SameSite=Strict cookies; same-origin and schema checks; FAQ/service publication and removal from public output/sitemap; durable inquiry storage without SMTP; lead search/status/notes/read; dashboard counts; audit pagination/no-store; and logout rejection of captured token replay.

`tests/auth.integration.mjs`: **4 passed** (including subtests). Verified actual authenticator setup/confirmation, incorrect code rejection, password-only rejection with 2FA enabled, fresh-code login, disabling 2FA, password changes, old-password rejection and session invalidation. The guarded suite restores only its disposable fixture admin.

The tracked loopback-only HTTPS proxy was exercised for these checks so application production Secure cookies remained enabled. Test certificate exceptions were restricted to the explicit self-signed local fixture. No production TLS setting was weakened. Temporary review/inquiry records were cleaned, and fixture app/proxy/database services were stopped after use.

## Browser, accessibility and content

- System Chromium checks passed for public layouts at **360, 390, 768, 1024 and 1440px**, with no document overflow. Admin inbox layouts passed the same sizes.
- Dark/light homepage, service/project details, preferences dialog, private dashboard, FAQ management and inbox passed axe WCAG A/AA scans after transitions settled. Mobile menu Escape/focus behavior and native FAQ mouse/Enter controls passed.
- Actual browser sign-in and FAQ create/save/delete/cancel were verified against the real local database. A list-label issue found during testing was fixed so FAQ questions display instead of IDs.
- The real contact form submitted optional company/service and a message into PostgreSQL, displayed accurate saved acceptance, reset the optional values, and exposed the inquiry in admin. Search, filtering, status, private notes and deletion were exercised through the UI.
- Consent banner exists in initial server HTML. Verified default-denied embeds, stored rejection, explicit permission before iframe creation, saved-choice suppression, cross-tab revocation and iframe teardown, preference reopening and blocked-storage feedback. The embedded provider response was an explicit local HTML fixture; it does not prove real Botpress replies.
- Verified viewport word reveal/mask movement, immediately readable hero, reduced motion and public text with JavaScript disabled. Moving the root streaming loader to the private admin route fixed hidden public content without JavaScript.
- Three temporary local CMS review fixtures verified timed rotation, hover/pause behavior, keyboard next, one active accessible slide and disabled autoplay under reduced motion. All fixtures were removed. The ordinary public site has no unapproved testimonials or fabricated faces.
- Fresh browser sessions reported no page/hydration errors. Twelve public and four private dashboard/inbox screenshots show actual rendered pages. Private screenshots use clearly named local QA fixtures, not real customer information. The original Elvora About composition replaces the substitute portrait; supplied certificate, project captures, actual email and social URLs remain intact.

## Local mobile Lighthouse

Fresh ordinary file-mode production server; Lighthouse 13.5.0, simulated mobile throttling, no concurrent browser/capture workload:

| Category | Score |
| --- | ---: |
| Performance | 92 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

FCP **1.2 s**, LCP **3.3 s**, total blocking time **20 ms**, CLS **0**, speed index **1.2 s**. Shared CSS/observer reveals and initial consent rendering reduce hydration work. LCP remains above the 2.5-second good threshold in this simulated run. See `docs/agency-performance.json` for settings and numeric metrics. Scores vary with devices, CPU, network, content, providers and the production host; they are neither a security nor a legal certification. Earlier scores/captures describe older builds.

## Remaining real-world setup and limits

- Configure production PostgreSQL, migration access, auth secret and shared Redis limits; create the first admin privately with `npm run admin:bootstrap`. Populate reviewed CMS records before choosing database content mode. File mode remains the default; inquiry storage can be enabled independently.
- Configure actual Turnstile keys, Gmail sender/App Password, server-side AI key and optional Blob settings. Real SMTP mailbox delivery, paid AI/provider replies, Redis service, Blob upload and Turnstile challenges were not verified with real accounts.
- Preserve the supplied Botpress configuration and check provider publishing/domain permissions on the real host. Live external Framer timing, exact animation-copy parity and public deployment are not verified.
- Genuine review text/portrait permission and an optional personal photo must come from the owner. No client statistics, revenue, experience totals, success rates or business outcomes were invented.
- Verify public DNS/certificates/redirects, hosting deployment, backups/restoration, actual retention and served-region policy requirements. No DNS changes were made. Physical-device speech recognition/playback remains unverified.
- Saved cloud startup instructions are a configuration draft, separate from website deployment; review/save and publish environment settings to activate them for future tasks. Fresh-task restoration has not been independently verified.

See `AGENCY_AUDIT.md`, `DEPLOYMENT.md`, `TESTING.md`, `CONTACT_SETUP.md` and `SECURITY_STATUS.md` for implementation and setup details.
