# Elvora agency completion audit — 17 October 2026

Scope: the supplied complete-agency and UI/UX audit prompts. Preserve the existing Elvora identity, four fictional website concepts, six UI studies, genuine supplied Coursiv certificate, actual contact email and social profiles. The owner approved moving beyond Next.js 14 to resolve its reported framework advisories.

| Area | Existing baseline | Result |
| --- | --- | --- |
| Framework | Next.js 14.2.35 with a critical production finding | Next.js 15.5.28, React 18 retained; async request APIs migrated; current production audit has zero findings |
| Public content | Established homepage, demos, studies, policies, tools, workflow and journey | Preserved and refined; service details, project notes, FAQs, canonical metadata and factual Person structured data added |
| CMS | Projects, bots, skills, certificates, settings | Added services, FAQs and permission-approved testimonials, ordering, publishing and audit events |
| Inquiries | SMTP required before optional storage | Durable database acceptance independent from email; company/service fields; accurate notification state |
| Lead management | Read/delete, latest 100 only | Search, status filter, chronological sort, bounded pagination, status and private notes |
| Authentication | Credentials, bcrypt, optional encrypted TOTP, version checks in APIs | Server page checks, bcrypt byte-bound login, expired lockout recovery, database session revocation on sign-out |
| Initial admin | Coupled to demonstration seed | Separate first-admin bootstrap; serializable refusal when any admin exists; no public registration |
| Authenticity | Labeled review/portrait previews | Unapproved reviews hidden; genuine review publication requires permission; original Elvora About composition |
| Motion | Many per-word Framer components | Shared viewport observer and CSS word/card reveals; interactive motion retained; hero immediately readable |
| Consent | Banner inserted after hydration | Initial server HTML banner; valid saved choice hidden before hydration; same parser/expiry rules; optional features default off |
| Loading | Root streaming fallback | Loading boundary scoped to private admin; public text visible without JavaScript |
| Deployment | Next 14 launch blocker and historical setup | Current migration/bootstrap/contact/security/testing guidance; real provider configuration remains necessary |

Important implementation paths:

- `app/services/[slug]/page.tsx`, `app/work/[slug]/page.tsx`, `components/faq-section.tsx`, `app/agency.css`.
- `data/agency.ts`, `lib/content-loader.ts`, `lib/admin/schemas.ts`.
- `app/api/admin/[resource]/route.ts`, `components/admin-app.tsx`, `data/admin.ts`.
- `app/api/contact/route.ts`, `lib/records.ts`, `components/contact-form.tsx`.
- `lib/admin/auth.ts`, `scripts/bootstrap-admin.ts`, `prisma/schema.prisma`, additive migration `202610170001_agency_content_and_leads`.
- `components/reveal-observer.tsx`, `components/text-reveal.tsx`, `components/reveal.tsx`, `lib/consent.ts`.
- `tests/agency.integration.mjs`, `tests/auth.integration.mjs`, `tests/helpers/https-proxy.mjs`.

The CMS uses PostgreSQL through Prisma. File mode is explicit and remains the default; database content mode fails rather than silently substituting file records. `CONTACT_STORAGE=database` can store inquiries while public content stays in file mode. No role hierarchy is added: this is a single-operator private admin, with all privileged operations authorized on the server.

No client identities, customer quotes, approved portraits, metrics, business results or provider credentials were invented. The reference animation timings and live deployment are not claimed as verified. See `VERIFICATION.md` for executed checks and measured limitations, and `DEPLOYMENT.md` for the remaining owner configuration.
