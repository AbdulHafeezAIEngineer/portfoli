# Dependency security status — 15 October 2026

**Production launch is blocked while the requested Next.js 14 version is retained.** The implemented app can be reviewed locally, but it must not be described as free of known production dependency vulnerabilities.

The user explicitly fixed the stack at Next.js 14. The current 14.x release available to this project is 14.2.35. `npm audit --omit=dev` still reports **one critical affected package: Next.js**. Reported advisories require a patched later major version; updating within 14.x does not resolve them. A stack exception has been requested before changing majors. No major upgrade is silently applied.

Relevant examples:

- [App Router CSP nonce XSS — GHSA-ffhc-5mcf-pf4q](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q)
- [Image Optimization API remote-code-execution advisory — GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4)
- [Server Components denial-of-service advisory — GHSA-8h8q-6873-q5fj](https://github.com/advisories/GHSA-8h8q-6873-q5fj)

Not every advisory applies to every feature/platform in this app. That does not justify treating the remaining affected framework as patched. CSP, validation, private admin checks and rate limits do not replace framework security updates.

Other findings were addressed by updating Auth.js/NextAuth 4.24.15, Prisma packages 6.19.3, Sharp 0.35.5, Vercel Blob 2.8.2, PostCSS 8.5.30, and compatible locked transitive dependencies. Prisma config uses a security override for deepmerge-ts 8.0.2; generation/build checks cover the pinned configuration. The current Gmail SMTP implementation uses Nodemailer 10.1.1 under the `gmail-smtp` npm alias because Auth.js declares an older optional mail-provider peer; this app uses Credentials authentication and does not use Auth.js's email provider. The alias keeps the patched SMTP library without installing the vulnerable optional version. Do not remove the lockfile or replace it with an incompatible peer override.

Recheck before any launch:

```bash
npm audit --omit=dev
npm run test:chat
npm run test:contact
npm run test:security
npm run lint
npm run typecheck
npm run build
```

Audit advisories change over time. Once a patched framework upgrade is authorized, migrate the affected APIs/configuration, rerun production browser/database tests, and update this document with the actual result. Lighthouse accessibility/best-practices/SEO scores are not a dependency security certification.
