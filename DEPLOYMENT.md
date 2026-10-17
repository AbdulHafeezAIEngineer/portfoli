# Elvora deployment and operations

The app uses Next.js 15.5.28 App Router, React 18, TypeScript, Tailwind, Framer Motion, PostgreSQL/Prisma and Auth.js Credentials. Node 22/24 is supported; validation used Node 24. Deploy with a Next.js server/runtime, not a static file upload.

## Install and check

```bash
npm ci --cache /tmp/portfoli-npm-cache --no-audit --no-fund
npm run lint
npm run typecheck
npm run test:chat
npm run test:contact
npm run test:security
npm run test:consent
npm run build
npm start
```

Stop your own development server before building: development and production share `.next`. Keep the lockfile and security overrides. `postinstall` generates the Prisma JavaScript/WASM driver client; native Prisma engines are not needed at application runtime. The migration CLI downloads its verified engine when needed; allow `binaries.prisma.sh` without disabling integrity or TLS checks.

## Private configuration

Use `.env.example` as the variable-name template. Local values belong in ignored `.env.local`; hosted values belong in private hosting settings. Never put secrets in `NEXT_PUBLIC_*`, source files, chat or screenshots.

Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the actual HTTPS canonical origin, normally `https://www.elvoraai.online`. The canonical fallback is that real domain. Preview deployments receive noindex controls. DNS was already connected in the owner's setup; this change does not require replacing nameservers.

| Requirement | Variables |
| --- | --- |
| Database/admin | `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET` |
| Initial admin, temporary | `ADMIN_EMAIL`, `ADMIN_PASSWORD` |
| Shared rate protection | `AUTH_REDIS_REST_URL/TOKEN`, `CONTACT_REDIS_REST_URL/TOKEN`, `CHAT_REDIS_REST_URL/TOKEN`; blank separate stores reuse CHAT settings |
| Authenticator 2FA | Stable private `TOTP_ENCRYPTION_KEY`, 32 random bytes encoded as base64 |
| Optional contact notifications | `GMAIL_SMTP_USER`, `GMAIL_APP_PASSWORD` |
| Contact anti-abuse | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TURNSTILE_REQUIRED=true` |
| AI API demos | `OPENAI_API_KEY`, optional model and quota settings |
| Admin image uploads | `BLOB_READ_WRITE_TOKEN`, exact `BLOB_PUBLIC_HOST` |
| External bot configuration | Exact approved `BOT_PROVIDER_ALLOWLIST` hosts and published provider configuration |

Check the complete comments in `.env.example`. Shared quotas fail closed when unavailable. Set an in-memory limiter override only for an intentional single-process host; it resets on restart and does not protect multiple serverless instances. Trust an IP header only when the edge proxy overwrites it.

## Database and first administrator

For the one-time Vercel build activation, see [OWNER_LOGIN.md](OWNER_LOGIN.md). `ADMIN_BOOTSTRAP_ON_BUILD=true` runs the private migration/first-owner operation before `next build`; the default is off. Existing accounts are preserved and preview deployments skip it. Remove the temporary admin password and disable the flag after activation.


Provision PostgreSQL with TLS. Use a pooled application URL and a direct migration URL if your provider separates them. Back up existing data and review migration SQL before deployment.

```bash
npm run db:migrate
npm run admin:bootstrap
```

Bootstrap reads privately supplied `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD`: at least 14 characters, upper/lowercase, a number and a symbol, at most 72 UTF-8 bytes. It stores only a bcrypt hash, prints no credentials, creates initial genuine site identity and refuses when any administrator exists. It does not create demonstration projects or reviews. Remove `ADMIN_PASSWORD` from the normal web runtime after bootstrap.

The additive agency migration adds services/FAQs/reviews and inquiry workflow fields. It preserves existing contact rows, backfills timestamps and adds status/permission constraints. Existing settings/email records are not overwritten by a changed schema default; update them through `/admin/settings` if needed.

Sign in at `/admin/login`. Admin pages and APIs check server authorization against the database session version. Enable authenticator 2FA from Security after configuring and backing up the encryption key. Password/2FA changes and sign-out invalidate previous sessions. Sign-out revokes all sessions for this single operator.

For private recovery, supply `ADMIN_EMAIL` and a new strong `ADMIN_PASSWORD`, then run `npm run admin:reset`. Set `RESET_ADMIN_2FA=true` only when deliberately recovering a lost authenticator. The command records the recovery and revokes old sessions. Do not run reset automatically during web builds.

## Choose public content and inquiry storage separately

- `CONTENT_SOURCE=files` is the default. The actual owner content and labeled fictional portfolio concepts come from `data/`. CMS edits do not replace this source automatically.
- `CONTENT_SOURCE=database` reads published database records, including services, projects, FAQs and approved reviews. Populate and review content through `/admin` before switching. Missing settings or a database outage produces an error; there is no silent file fallback.
- `CONTACT_STORAGE=database` stores inquiries independently from public content mode. Recommended when keeping file-based portfolio content with the private lead inbox.
- Email-only file mode without database storage needs working SMTP configuration. It does not invent inbox persistence.

For an isolated development database only:

```bash
SEED_CONTENT=demo npm run db:seed
```

Demo seed refuses `NODE_ENV=production`. It imports owner content and clearly labeled concepts without overwriting existing records; it creates no administrator or testimonial. Do not use demo seed to initialize real production data. Use the CMS to publish reviewed records.

## Manage content and leads

The private dashboard shows database counts and recent inquiries. Projects, bots, skills, certificates, services, FAQs and reviews support editing, ordering, publishing and deletion. Reviews require permission confirmation before publishing; add only genuine approved quotes and portraits. No reviews are displayed by default.

The inbox supports search, status filters, chronological ordering and pagination. Statuses are `new`, `contacted`, `in-progress`, `closed`; read/unread is separate. Internal notes are private. Notification status describes SMTP acceptance/failure/unconfigured state, not an assurance of inbox delivery. Audit entries record administrative mutations. Chat logging remains opt-in; establish retention before enabling it.

Image uploads require configured Blob storage. The server authorizes, limits, decodes and re-encodes JPEG/PNG/WebP, strips metadata and restricts displayed remote hosts. Local source assets work without Blob. Do not configure arbitrary remote image hosts.

## Contact and AI integrations

The public recipient is **abdulhafeez@elvoraai.online**. The Gmail SMTP sender/account is separately configured and must match its Gmail App Password. Do not replace the recipient with the SMTP login address. See `CONTACT_SETUP.md` for precise acceptance/failure behavior.

AI demos need an actual server-side API key and provider billing limits. App request quotas are not a currency spending cap. Keep shared quotas and output limits; verify real provider replies after deployment. The supplied Forte/Botpress scripts are preserved. Confirm its publishing state and allowed domains on the real provider account. Optional external chat must remain blocked until consent, and withdrawing permission removes embeds.

## Hosting, HTTPS and launch

For Vercel, import the repository, use the Next.js preset and set private variables. Review and run migrations in a trusted deployment job before releasing schema-dependent code. Use the same application schema for previews only when intentionally isolated; do not point routine tests at production. Netlify uses the included Next.js adapter configuration; configure the actual domain rather than historical preview URLs.

After deployment, verify the canonical redirect, valid certificates, all service/work routes, sitemap/robots, admin sign-in/logout/2FA, new inquiry visibility, real notifications and failure states. Check metadata, keyboard navigation and mobile layouts. Local build and browser tests do not prove the external deployment completed.

Configure automated encrypted PostgreSQL backups and retention with the provider, test restoration to a separate database, and back up stable auth/TOTP secrets through a secure process. Back up owned uploaded assets. Define inquiry/chat/audit deletion periods and access responsibilities. Code rollback across schema changes must preserve compatible columns; never drop real production data just to revert the UI.

Current dependency audit and remaining development-tool findings are in `SECURITY_STATUS.md`. Measured checks and screenshots are in `VERIFICATION.md`. No production service credentials or legal-compliance certification are included.
