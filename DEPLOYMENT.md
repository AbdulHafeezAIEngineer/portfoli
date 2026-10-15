# Production deployment

**Launch status:** the requested Next.js 14 release still has reported critical advisories. This is a review build; a patched major-version exception is needed before production. See `SECURITY_STATUS.md`.
## PostgreSQL and private settings

Create a Neon or Supabase PostgreSQL database in your own account. Use the provider's pooled TLS URL for `DATABASE_URL` and direct TLS URL for `DIRECT_URL`. Use a least-privilege application role and keep both URLs in hosting secrets. Do not expose PostgreSQL, database dashboards or service credentials to browser code. Supabase table APIs/RLS are not used; Prisma connects from the server.

Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the actual HTTPS origin, without a trailing path. Set a unique random `NEXTAUTH_SECRET` of at least 32 bytes. To generate secrets privately in your own terminal:

```bash
openssl rand -base64 48
openssl rand -base64 32
```

The first value can be your auth secret; the second can be `TOTP_ENCRYPTION_KEY`. Store them securely; do not paste them in chat or commit terminal output. Keep the TOTP encryption key stable and backed up. The seed creates the first admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`; use 14+ characters with upper/lowercase, a number and a symbol, at most 72 UTF-8 bytes. Passwords are hashed with bcrypt cost 12. Seed preserves existing credentials and content.

Run from a trusted deployment terminal with the private variables loaded:

```bash
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
```

The migration command uses `DIRECT_URL`. Do not run `db:dev` against production. `db:dev` is for creating later reviewed migrations on a development database. Allow Prisma's verified binary downloads if the migration CLI requires them; the deployed app uses its JavaScript driver and does not need native Prisma engines.

After seeding, set `CONTENT_SOURCE=database` and redeploy. Remove `ADMIN_PASSWORD` from normal runtime settings. File mode remains available without database services. Admin database changes affect projects, bots, grouped skills, certificates, brand/email/metadata and the chat-logging setting.

## Shared abuse protection

Configure an Upstash-compatible Redis REST URL/token for chat, contact and authentication. Contact/auth can reuse `CHAT_REDIS_REST_URL` and `CHAT_REDIS_REST_TOKEN` or use their own stores; each has a separate namespace. Keep all memory-limiter production overrides false on serverless hosting. Missing/unavailable shared protection fails closed. Configure a trusted visitor-IP header only if the edge platform overwrites it and prevents spoofing; the default shares a conservative visitor bucket.

Login allows 5 attempts per minute per bucket. Accounts also lock for 15 minutes after 5 failed password/2FA attempts. Errors are generic. Sessions have a maximum authenticated age of 15 minutes, use httpOnly Secure SameSite=strict cookies over production HTTPS, and are checked against the database password version for every admin API request. Changing/resetting the password invalidates old sessions on their next server request. Auth.js supplies CSRF tokens for authentication; admin mutations also validate their origin.

## Admin, 2FA and recovery

Open `/admin/login`. Content editing includes published state, typed validation, ordered project images, multi-image upload, create/edit/delete and accessible move-up/down ordering. Structured arrays/configuration use labeled JSON fields. Inbox, chat logs and audit views return the latest 100 entries. Record deletion is permanent and asks for confirmation. Audit entries store IDs/actions, not passwords or message bodies.

At `/admin/security`, enter your current password to change it or set up an authenticator. Setup secrets expire after five minutes; existing TOTP secrets are encrypted at rest. Enabling/disabling 2FA requires verification and invalidates existing sessions. Codes use a ±30-second window and replay protection; after setup, wait for a fresh code before signing in again. When 2FA is enabled, changing a password also requires a fresh authenticator code.

For CLI recovery, temporarily load the target `ADMIN_EMAIL` and new strong `ADMIN_PASSWORD` privately, then run:

```bash
npm run admin:reset
```

To recover a lost authenticator too, deliberately set `RESET_ADMIN_2FA=true` only for that reset. This privileged CLI operation requires database access and creates an audit entry. Remove reset/password variables afterward. There are no hardcoded default credentials or password-printing scripts.

## Images and bot providers

Create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` and the exact `BLOB_PUBLIC_HOST`. Blob can also be used from Netlify. Uploads accept 1–4 JPEG/PNG/WebP files, up to 3 MB each. The server limits total bytes/pixels, checks the decoded format and rejects SVG/animated/corrupt images, rotates/resizes and re-encodes to WebP to strip metadata. Random filenames avoid trusting user-provided names. Uploaded images are public: upload only public portfolio assets. Write accurate alt text and save the record after upload. Removing a URL/record does not delete potentially shared Blob assets; periodically remove orphaned assets through your storage dashboard.

`BOT_PROVIDER_ALLOWLIST` contains exact trusted provider hostnames, comma-separated. Set it before saving external iframe/script/API destinations in admin. No provider secrets belong in public configuration or widget attributes. `REAL_BOT_API_KEY` stays private. The real bot uses the same reusable `BotEmbed` component; generic scripts run in an opaque sandboxed document which is destroyed on close. The trusted Botpress adapter supports its official loader plus configuration script in a dedicated same-origin frame with storage access; this frame is not an origin security boundary. See `BOTPRESS_SETUP.md`. Check framing/CSP/provider storage permissions in the actual deployment. API responses are rendered as escaped plain text and control characters are removed; no provider HTML executes in custom API chat.

## Mail, Turnstile and AI

Configure Gmail App Password delivery and Cloudflare Turnstile using `CONTACT_SETUP.md`. Production requires Turnstile by default. Add your exact domain in Cloudflare and set public/private keys; verification checks hostname and the `contact` action. Contact submissions are stored before SMTP delivery when database content is enabled; delivery status is recorded. A 202 means Gmail accepted a message, not guaranteed inbox delivery. Configure outbound SMTP and actually test delivery yourself.

Set OpenAI/model settings using `CHATBOT_SETUP.md`. Request/token quotas are not a monetary spending cap: configure provider project budgets/alerts and an enforceable cap where offered. The booking bot is a simulation and voice depends on supported HTTPS browsers and microphone permissions.

Chat logging is **off by default**. If enabled in site settings, the last user message and AI reply are retained in PostgreSQL. The public chat notice describes possible retention. Establish a lawful purpose, retention period, user notice and deletion routine before enabling it. Delete messages/logs you no longer need. Application logs do not print enquiry bodies, passwords or provider diagnostic details. Hosting/SMTP/AI/Redis providers have their own operational logging and retention.

## Vercel + Neon/Supabase

1. Import `AbdulHafeezAIEngineer/portfoli` from GitHub, selecting the reviewed branch. Choose Next.js, Node.js 22/24, install `npm ci`, build `npm run build`.
2. Add the public URL and private service settings in the Vercel dashboard. Keep production and preview databases/keys separate. Never grant untrusted preview deployments production secrets.
3. Run reviewed production migrations and the initial seed from a trusted terminal/CI job. Do not run seed on every web build.
4. Deploy with `CONTENT_SOURCE=database`, connect your domain in Vercel, set the requested DNS records, wait for managed SSL, then pin both origin variables to that domain and redeploy.
5. Test admin, content updates, public galleries/bots, email, Turnstile and real storage uploads on the HTTPS domain.

## Netlify

The complete portfolio is on GitHub's `main` branch, including the Elvora logo, About Me section and supplied Coursiv certificate. The older main version displayed AH and contained only Parts 1/2. For the owner's existing `portfolio3821.netlify.app` project, select repository `AbdulHafeezAIEngineer/portfoli` and production branch `main` in Netlify's continuous deployment settings. Once linked, pushes to `main` trigger a build. If automatic builds are disabled, choose **Deploys → Trigger deploy → Deploy site**. Use **Clear cache and deploy site** only if a successful build still serves stale assets.

Use the provided `netlify.toml`: `npm run build`, publish `.next`, Node 24 and the Next.js adapter. Do not upload the source folder as static HTML; API routes/auth need the Next.js runtime. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to `https://portfolio3821.netlify.app` unless using a new custom domain. Configure the same private services/Redis/origin variables. Keep `CONTENT_SOURCE=files` for the included file-based content. Existing database records are preserved by seeding; update them in `/admin` when choosing database mode.

Selected Work in file mode now contains Solenne, Vanta Motors, Aster Care and Kovo Studio. The Elvora promotional card and previous samples are no longer selected. Database-mode owners should unpublish the previous project records and seed/add the four entries from `data/projects.ts`; the additive seed does not silently delete or overwrite existing records. Set `CONTENT_SOURCE=files` to display the supplied selection immediately. Update an existing database real-bot name to Forte O Level Study Assistant and retain its supplied Botpress configuration.

Verify outbound SMTP support; if your host blocks it, keep the email link and move delivery to an allowed email API before launch. No successful Netlify deployment is claimed without a completed hosting build and public URL verification. The cloud environment could not access the owner's Netlify URL (HTTP/CONNECT 403), so local checks do not establish the current live-site state. The framework security limitation at the top of this document remains outstanding.

## Headers and launch checks

Middleware supplies a per-request nonce CSP, HSTS on external production hosts, SAMEORIGIN framing, nosniff, referrer and permissions policies. Inline Next.js/theme scripts use the nonce; style attributes remain permitted for Framer Motion. Development permits eval for tooling. Microphone permission is restricted to self so voice remains usable. Widget scripts load in their own document; trusted Botpress has same-origin access as described above. Only explicitly configured public Blob images and bot frame hosts are allowed. No wildcard CORS is enabled; API mutations validate same-origin requests. Robots disallows `/admin` and `/api/admin`, and admin metadata uses noindex; these are indexing preferences, not access control.

Before launch:

- [ ] Verify owner name, Elvora brand, portrait, genuine certificate and real workflow facts; remove only placeholders you can substantiate.
- [ ] Use actual HTTPS origins and managed SSL; check security headers and nonce hydration on the deployed host.
- [ ] Apply migrations, seed once, verify backups/recovery and least-privilege database access.
- [ ] Configure Redis, strong auth secret, private Gmail/AI/storage/Turnstile settings and trusted provider hosts. Remove seed/reset passwords from runtime.
- [ ] Enable and verify 2FA if desired; test lockout, sign-out, recovery and session invalidation.
- [ ] Submit and receive a real enquiry; verify inbox persistence, reply-to, honeypot and rate-limit behavior.
- [ ] Test a real Blob upload, alt text, image order and public rendering.
- [ ] Test real provider chat/embedding and device microphone/voice playback over HTTPS.
- [ ] Choose contact/chat retention, keep chat logging off unless needed, and remove test records.
- [ ] Run `npm run test:chat`, `npm run test:contact`, `npm run lint`, `npm run typecheck`, `npm run build`; check keyboard/mobile flows and Lighthouse on the final host.
- [ ] Review dependency security updates and provider usage/billing alerts. No particular Lighthouse score or absolute security guarantee is claimed.
