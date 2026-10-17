# Activate the Elvora owner login on Vercel

Owner sign-in: **https://www.elvoraai.online/admin/login**

Login email: **abdulhafeez@elvoraai.online**. This is an identifier for the website owner account. The mailbox password is not automatically connected to website authentication. Choose a separate strong administrator password privately.

The admin dashboard and database-backed authentication are implemented. The deployed project must have its own private configuration and first owner account. Adding details to the login form does not create an account.

## One-time private deployment setup

Open the **elvora-studio** Vercel project → **Settings → Environment Variables**. Use the **Production** environment. Never put secrets in NEXT_PUBLIC variables, source code, screenshots or chat.

| Variable | Set privately in Vercel |
| --- | --- |
| `DATABASE_URL` | Application connection URL from your PostgreSQL provider |
| `DIRECT_URL` | Direct migration connection URL from the same provider |
| `NEXTAUTH_SECRET` | Securely generated random secret, at least 32 characters; keep it stable |
| `NEXTAUTH_URL` | `https://www.elvoraai.online` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.elvoraai.online` |
| `AUTH_REDIS_REST_URL` | Shared Redis REST endpoint for login rate protection |
| `AUTH_REDIS_REST_TOKEN` | Matching private Redis REST token |
| `ADMIN_EMAIL` | `abdulhafeez@elvoraai.online` |
| `ADMIN_PASSWORD` | Your new strong admin password: 14+ characters with upper/lowercase, number and symbol; maximum 72 UTF-8 bytes |
| `ADMIN_BOOTSTRAP_ON_BUILD` | `true` for the first production deployment |

Vercel's connected storage integrations can provision the required PostgreSQL and Redis accounts; map their actual connection variables to the names above. Use verified provider URLs and TLS. Do not replace missing values with examples. A serverless Vercel deployment requires shared login protection; do not use an in-memory override to bypass this requirement.

Redeploy the current GitHub main branch using the repository's normal `npm run build` command. With the private flag enabled, the build applies the reviewed additive migrations and creates **only the first owner**. It does not seed demonstration data, expose a web registration/setup endpoint or change existing accounts/passwords. Preview deployments skip owner creation. Setup failures stop the flagged deployment with a safe message in its private build logs; no credentials or database URLs are printed.

After a successful first deployment, remove `ADMIN_PASSWORD`, set `ADMIN_BOOTSTRAP_ON_BUILD=false`, and redeploy. Sign in with the business email and the password you chose. Keep `NEXTAUTH_SECRET` and the database/Redis configuration in the runtime.

If an account already exists, the setup operation preserves it. It will not turn a newly entered environment password into a password reset. Existing-account recovery is the deliberate private `npm run admin:reset` procedure in `DEPLOYMENT.md`; no public reset endpoint exists.

## Login feedback

- Incomplete private configuration shows **Owner sign-in needs setup** and a Check again button, rather than submitting into a redirect loop.
- Wrong credentials show a clear inline error and preserve entered details.
- Infrastructure failures and request throttling have separate safe messages.
- A successful callback must also establish an authorized session before navigating to the dashboard. Missing/blocked session cookies leave a visible explanation on the login page.
- Old `?error=...` redirects display a safe message instead of an apparently unchanged screen.

The initial email is prefilled, but there is no default password. No email verification or SMTP account is required for this Credentials sign-in. SMTP and AI configuration remain separate integrations.

## What has and has not been verified

Local production HTTPS checks verify the real owner creation, credentials, session, dashboard and failure paths against isolated PostgreSQL. They do not configure your Vercel account. Live environment values, production database state and deployment logs require access to the actual hosting project. Do not report live activation until those checks succeed on that project.
