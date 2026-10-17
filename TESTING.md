# Verification workflow

Node 24 was used. Install with the lockfile, retain Prisma/security overrides and do not run dev and build concurrently.

```bash
npm ci --cache /tmp/portfoli-npm-cache --no-audit --no-fund
npm run lint
npm run typecheck
npm run test:chat
npm run test:contact
npm run test:security
npm run test:consent
npm run test:login
npm run build
npm audit --omit=dev
npm audit
```

The unit suites verify guards, quotas, provider adapters, safe SMTP, durable-storage failure semantics, schemas, TOTP/encryption, real image decoding and consent expiry. Provider requests in those tests are explicit fixtures; no real mail or paid AI request is sent. The full development audit currently has an upstream finding documented in `SECURITY_STATUS.md`; it must not be reported as a passing zero-vulnerability check.

## Opt-in real PostgreSQL and HTTPS integration

Use a disposable local PostgreSQL database and generated test-only admin/auth secrets in an ignored private environment file outside the repository. Never use production data or credentials. The auth suite additionally requires a loopback database URL whose database name begins `elvora_agency_test` and resets only that fixture admin when cleaning up.

1. Set private `DATABASE_URL` and `DIRECT_URL` for that isolated database. Run the actual migration CLI, bootstrap and deliberate development seed. Confirm repeated bootstrap is refused and production demo seed is refused.
2. Set `AGENCY_TEST_DATABASE=isolated`, `NEXTAUTH_URL=https://127.0.0.1:3443`, `NEXT_PUBLIC_SITE_URL` to that test origin, `CONTENT_SOURCE=database`, `CONTACT_STORAGE=database`. Leave real SMTP, AI and storage credentials absent.
3. For this single-process fixture only, enable `AUTH_ALLOW_IN_MEMORY_LIMITER=true`, `CONTACT_ALLOW_IN_MEMORY_LIMITER=true`, `CONTACT_TURNSTILE_REQUIRED=false`. The auth suite varies local `x-real-ip` fixture headers with `AUTH_TRUSTED_IP_HEADER=x-real-ip` to exercise multiple session transitions without waiting through the shared login bucket. This is a test setting, not evidence of a trusted production proxy.
4. Create a self-signed certificate with localhost/127.0.0.1 SANs. Set `AGENCY_TEST_TLS=self-signed-local`, `AGENCY_TEST_TLS_KEY` and `AGENCY_TEST_TLS_CERT` to the private local files.
5. Run the production build without fixture credentials embedded in it, then start the production app with the private fixture environment on port 3008. In another persistent terminal run `npm run test:proxy` with the same fixture environment. The helper binds loopback, forwards only to loopback and refuses use outside the explicitly isolated fixture.
6. Run suites sequentially with the same private environment:

```bash
node --env-file=/private/path/test.env --test --test-concurrency=1 tests/agency.integration.mjs
node --env-file=/private/path/test.env --test --test-concurrency=1 tests/auth.integration.mjs
```

The agency suite covers unauthorized verbs/pages/uploads, actual credential login, Secure/HttpOnly/Strict cookies, origin/schema rejection, CMS publication, sitemap, stored inquiries, status/notes/search/pagination/audit, logout and captured-token replay rejection. The auth suite covers authenticator confirmation, password-only rejection, 2FA disabling, password changes and session revocation. The only certificate-validation exception in the test client is guarded by the explicit local self-signed fixture; application production cookies and TLS settings are not weakened.

Stop only your fixture app/proxy/database after testing. Restart the ordinary app without those credentials/settings. These tests create temporary local content and test accounts; they do not prove production configuration, external service delivery or deployment success.

## Browser and performance review

Use system Chromium or a compatible Playwright browser. Check public/admin layouts at 360, 390, 768, 1024 and 1440px, themes, keyboard navigation, accessible dialogs, form errors/success/reset, lead editing, genuine review carousel controls, reduced motion and JavaScript-off content. Under CSP, inject axe with the page's script nonce. Scan after theme transitions/reveal effects settle; do not hide genuine contrast failures.

Verify consent defaults off, saved rejection, explicit embed creation, cross-tab permission revocation and frame teardown, storage failures and preference reopening. An explicit local iframe fixture can verify consent behavior without invoking the real provider; label that evidence accordingly.

Run Lighthouse alone against a production server in ordinary file mode. Save the actual score, device/throttling settings and metrics; don't substitute a previous result or certify the public deployment from a local audit. Capture helpers may hide fixed navigation/skip-link widgets only in screenshots. `VERIFICATION.md` records measured outcomes and `docs/` contains actual captures.

Owner login regression checks cover missing setup, safe credential/outage/rate errors, CSRF submission, callback success with blocked cookies, and malformed responses. Private build activation is opt-in, skips previews, and must be tested against a separate empty disposable database. Verify first owner creation, repeat-run password preservation and removal of the temporary password; never test it against production incidentally.

For `npm run test:login:browser`, provide the guarded isolated HTTPS fixture environment and `AGENCY_TEST_UNCONFIGURED_URL` pointing to a separate ordinary loopback app without auth settings. It verifies the setup notice, business-email prefill, wrong password, real owner dashboard login/logout, an explicitly dropped session cookie, safe failure messaging and old error-query handling. It uses system Chromium or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. No real credential is embedded in the test.

To regress the CMS-metadata outage bug, stop only the disposable local PostgreSQL instance while its fixture app/proxy remain running, then run `AGENCY_TEST_DATABASE_UNAVAILABLE=true node --env-file=/private/path/test.env tests/admin-database-outage.browser.mjs`. This must still render sign-in and report its actual database failure inline; restart the fixture database before other suites. Never stop a production database for this check.

## Editorial motion and private setup regression

`npm run test:motion:browser` uses `PUBLIC_TEST_URL` (default loopback port 3008) and system Chromium. It checks six viewport widths, themes, actual filter contents, live OS motion changes, explicit animation preference persistence, native touch behavior, lazy AI demos, form validation, overflow, no-JavaScript content and browser errors. It refuses nonlocal targets.

`node --env-file=/private/path/local-test.env tests/owner-setup.integration.mjs` requires `AGENCY_TEST_DATABASE=isolated` and an explicitly local PostgreSQL connection on port 55432. It creates/drops its own disposable database, runs real private build setup, verifies weak credential diagnostics, first-owner creation and repeat-run preservation, and never prints generated fixture secrets. It must never be run against a real production database.
