# Contact and inquiry setup

Public recipient: **abdulhafeez@elvoraai.online**. The form accepts name, email, optional company/service and a project message. The server validates strict input, checks origin, discards filled honeypots, applies quotas and verifies configured Turnstile before accepting work.

## Durable inbox

Configure PostgreSQL, run `npm run db:migrate`, bootstrap the admin and set `CONTACT_STORAGE=database`. This is independent of `CONTENT_SOURCE`; file-based public content can keep a real private inbox. Database content mode also enables inquiry storage.

The server saves first. Its 202 response reports `acceptance: "stored"`; optional notification is `accepted`, `failed` or `not-configured`. Missing SMTP or failed notification does not discard an already stored inquiry. The UI says the inquiry was saved without claiming delivery. A database save failure returns 503 and does not send mail or show success.

## Optional Gmail notification

Set private `GMAIL_SMTP_USER` to the Gmail sender and `GMAIL_APP_PASSWORD` to that account's Gmail App Password with 2-Step Verification. The sender defaults to the existing buildwithelvora@gmail.com account; the recipient remains the domain email above. Never use the ordinary Google password, expose credentials to the browser or paste them into source.

The implementation uses verified TLS on smtp.gmail.com:465, bounded timeouts, a fixed recipient, a validated reply-to and plaintext content. SMTP acceptance does not prove inbox delivery; check the actual recipient mailbox, spam folder and sender restrictions after deployment.

Without database storage, SMTP is required and failure returns an honest 502/503. No credentials produces no success response. Keep form details on failure so visitors can retry or email directly.

## Protection and privacy

Configure shared Redis REST limits for serverless/multiple instances and Turnstile keys for the actual hostname. Production protection fails closed when required settings are unavailable. Trust proxy IP headers only if the edge overwrites them. In-memory fallback is a deliberate single-process option, not a shared limit.

Private inbox access requires admin authorization. Review retention and provider agreements, and delete records when no longer needed. Optional chat consent does not control an inquiry the visitor deliberately submits. See `PRIVACY_SETUP.md` and the actual privacy policy.

Contact tests use explicit SMTP/Redis/Turnstile/storage fixtures; real-database integration also verifies durable acceptance without SMTP. Real email delivery must be checked with the configured provider on the public host. No real message was sent during automated verification.
