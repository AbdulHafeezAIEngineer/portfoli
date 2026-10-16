# Elvora contact setup

Public contact: **abdulhafeez@elvoraai.online**. There are no phone or WhatsApp links. Owner-supplied GitHub and Instagram profiles are included. Update public identity in `data/site.ts`, form copy and limits in `data/contact.ts`. The destination is fixed on the server; visitors only set the reply-to address. The public domain inbox is separate from the Gmail SMTP sender. Set `GMAIL_SMTP_USER` to the actual authenticated Gmail account (defaults to the existing `buildwithelvora@gmail.com`) and use its matching `GMAIL_APP_PASSWORD`. Changing the public email does not configure Hostinger SMTP. Verify the new inbox can receive mail. In database content mode, also update the email in admin site settings; existing records are preserved.

## Gmail delivery

1. Configure production Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) for the exact public hostname. Verification checks its `contact` action. Production requires this protection by default.

Copy `.env.example` to ignored `.env.local` for local development. On Netlify, use the site's secure environment-variable settings instead.
2. Enable Google 2-Step Verification for the Gmail account and create a Gmail App Password if the account supports it. Set `GMAIL_APP_PASSWORD` securely. Use an App Password, never your normal Google password. Do not send either in chat or commit it. Google Workspace/account policies may prevent App Password creation; in that case keep the working email link until another mail service is configured.
3. The server connects to `smtp.gmail.com:465` using TLS with certificate verification. Your hosting/network must allow outbound SMTP. Restart/redeploy after setting secrets.
4. Set `NEXT_PUBLIC_SITE_URL` to the actual public HTTPS origin. A stale example origin rejects genuine form submissions.
5. Configure shared rate limiting as below. Then submit a real enquiry yourself and verify inbox/spam delivery and Reply-To behavior.

No email is sent without a configured App Password. A normal submission returns an explanatory 503 in that state, while the direct `mailto:` link works independently. A 202 means the SMTP server accepted the message, not that inbox delivery is guaranteed. SMTP timeouts can leave delivery uncertain; inputs are preserved on errors. This form does not promise exactly-once delivery. Do not store sensitive information in messages.

## Rate limiting

For Netlify/serverless or multiple instances, configure an Upstash-compatible Redis REST endpoint/token. `CONTACT_REDIS_REST_URL` and `CONTACT_REDIS_REST_TOKEN` can use a separate store; if blank they reuse `CHAT_REDIS_REST_URL` and `CHAT_REDIS_REST_TOKEN`. Contact keys have a separate namespace and do not consume chat quotas. Never expose the tokens to the browser. Allow outbound HTTPS to your actual Redis domain.

An atomic reservation permits 3 attempts per 10-minute fixed window, 10 per UTC day per visitor bucket, and 50 total per UTC day by default. `CONTACT_DAILY_SEND_CAP` accepts 1–500. Failed SMTP attempts consume quota too. Redis outages and missing production protection fail closed. Two concurrent SMTP calls per process are permitted; Redis enforces shared request quotas across instances.

The safe default uses a shared visitor bucket. Only configure `CONTACT_TRUSTED_IP_HEADER` (or its chat fallback) after confirming that your host overwrites that header and strips client-supplied values. Supported values: `x-vercel-forwarded-for`, `cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`. Incorrectly trusting a forwarded header lets callers evade per-visitor limits. The global daily quota still applies.

Development uses memory automatically. `CONTACT_ALLOW_IN_MEMORY_LIMITER=true` is an explicit option for a single persistent production process, not serverless hosting: counters reset on restart and are not shared. Do not enable this on Netlify as a substitute for Redis.

## Validation and abuse handling

Client and server share a Zod schema. Names contain 2–80 characters without control characters; email is trimmed, lowercased, valid, and at most 254 characters; messages contain 20–3,000 characters. Unknown payload fields are rejected. The body is limited to 32 KiB before parsing. Cross-site browser requests are rejected; origin checks are not authentication and do not stop arbitrary scripts, so quotas remain necessary.

The offscreen honeypot is removed from keyboard navigation and the accessibility tree. Validated requests that fill it receive a quiet acknowledgement and send no mail. No enquiry content, raw email address, provider error details, or credentials are written to application logs. Transport/network providers can retain their own operational data. Messages go to Gmail, so its retention policy and your inbox management apply.

## Checks

```bash
npm run test:contact
npm run test:chat
npm run lint
npm run typecheck
npm run build
```

Contact tests mock SMTP and Redis. They do not send mail or establish real Gmail delivery. Browser checks cover validation, error preservation, success reset, certificate controls, keyboard access, both themes and narrow layouts. Real SMTP delivery still needs a secure App Password and a host that permits SMTP.

## Database inbox

With `CONTENT_SOURCE=database`, validated submissions are saved to `ContactMessage` before SMTP delivery; the admin inbox records accepted/failed status. Honeypot requests are not stored. Keep a retention policy and delete enquiries when no longer needed. See `DEPLOYMENT.md` for admin, 2FA and launch configuration.
