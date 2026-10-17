# Dependency and application security status — 17 October 2026

The owner approved the major-version migration. The project now uses **Next.js 15.5.28** and matching ESLint configuration with React 18.3.1. Async `headers()` and dynamic route parameters, tracing and external-package configuration were migrated. Lint, TypeScript, production build, real PostgreSQL/Auth.js HTTPS integration and browser checks cover the upgrade.

Current `npm audit --omit=dev`: **0 vulnerabilities**. The earlier Next.js 14 launch blocker has been resolved by the approved migration. This is an audit snapshot, not a guarantee against all vulnerabilities.

The full development audit reports **7 high-severity affected entries** through `braces <=3.0.3` and its glob/watch consumers in ESLint and Tailwind. No patched braces version is published in the available registry. These are build/development dependencies, not a finding in the production-only dependency tree. Do not process untrusted glob patterns through those tools. Review upstream releases and re-audit before launch; the finding is not suppressed or relabeled as fixed.

Existing security updates and overrides remain: Auth.js/NextAuth 4.24.15, Prisma 6.19.3, Sharp 0.35.5, Blob 2.8.2, PostCSS 8.5.30, deepmerge-ts 8.0.2, uuid 11.1.1 and postcss-selector-parser 7.1.6. The Gmail SMTP implementation uses patched Nodemailer 10.1.1 as the `gmail-smtp` alias. This Credentials-only app does not enable Auth.js's optional email authentication provider.

Application controls include server page/API authorization, 15-minute absolute session limits, database password-version checks, revocation on logout/password/2FA changes, bcrypt hashes and byte limits, failed-login lockout, shared-store production rate limits, same-origin mutation checks, strict validation, nonced CSP, no-store private responses and restricted image upload decoding/re-encoding. Sign-out revokes all sessions for the single administrator. Recovery is a private CLI operation, with audit records; there is no public registration/reset endpoint.

Production still requires a strong private auth secret, HTTPS, least-privilege database access, backups, shared Redis limits for multiple instances, properly configured Turnstile, and actual provider configuration. Memory limits are an explicit single-process deployment option only. Review retention, provider agreements and served regions; consent controls do not certify legal compliance.

Recheck after dependency or authentication changes:

```bash
npm audit --omit=dev
npm audit
npm run test:chat
npm run test:contact
npm run test:security
npm run test:consent
npm run lint
npm run typecheck
npm run build
```

See `TESTING.md` for guarded real-database and HTTPS integration suites. No actual production credentials, database, mail delivery, paid AI call or public hosting deployment is established by local tests.
