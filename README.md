# Elvora — Abdul Hafeez's portfolio

**Launch status:** the requested Next.js 14 release still has reported critical advisories. This is a review build; a patched major-version exception is needed before production. See `SECURITY_STATUS.md`.
Next.js 14 App Router, TypeScript, Tailwind CSS and Framer Motion. All application backend logic runs in Next.js route handlers. The portfolio includes four original demo sites, actual captured screenshots, CSS 3D laptop/phone cards, cinematic galleries, three AI chat demos, a configurable real bot, voice controls, honest experience/skills sections, a pending certificate viewer, Gmail-only contact, PostgreSQL/Prisma content management and a private Auth.js admin panel.

## Run

Use Node.js 22 or 24. Retain the lockfile.

```bash
npm ci --cache /tmp/portfoli-npm-cache
cp .env.example .env.local
npm run dev
```

Do not overwrite an existing `.env.local`. Set the actual site URL; the example origin is not a deployable value. The public portfolio works with `CONTENT_SOURCE=files` without database/API/mail credentials. Chat, mail, uploads and private administration need their own secure settings; unconfigured services report an honest unavailable state.

```bash
npm run test:chat
npm run test:contact
npm run test:security
npm run lint
npm run typecheck
npm run build
npm start
```

`npm ci` generates the Prisma JS-driver client through the pinned Prisma WASM parser. No native Prisma engine is needed at application runtime. Prisma's migration CLI may still download its verified schema engine; allow `binaries.prisma.sh` when running migrations. Never disable checksum checks. Fonts are bundled locally through npm and `next/font/local`.

## Actual concept screenshots

The fictional demo sites are `/demo/restaurant`, `/demo/real-estate`, `/demo/saas`, and `/demo/store`. Each uses original CSS/vector visuals, realistic fictional copy and a distinct visual direction. Restaurant reservations, property enquiries, SaaS subscriptions, shopping bags and prices are clearly demonstration content. No client work or real business affiliation is implied.

```bash
npx playwright install chromium
npm run capture
```

The capture script starts and stops its own development server on port 3100. Stop other Next.js servers first, since development and production share `.next`. Alternatively, set `CAPTURE_BASE_URL` to an already-running app and capture that server. Desktop views are 1440×900, mobile 390×844, both at 2× device scale. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select a system Chromium; `/usr/bin/chromium` is detected automatically when present. See `SCREENSHOTS.md` for all 16 filenames and four optional image-generation prompts. Existing captures are included, so a browser installation is not required to run the portfolio.

## Content and data boundaries

All editable portfolio content starts in `data/`. `lib/content-loader.ts` is the server-only boundary: `CONTENT_SOURCE=database` uses Prisma after migrations and seed, while file mode reads the same typed content. Components keep the same display props. Seed is additive and preserves existing records/passwords.

- `data/site.ts`: Elvora identity, Abdul Hafeez's introduction, Gmail, navigation and shared UI text.
- `data/projects.ts`, `demos.ts`: concept descriptions, actual screenshot paths, design highlights, optional promo prompts and demo copy.
- `data/bots.ts`: bot cards, disclosures, one `realBotConfig` object for iframe/script/API, and an optional `additionalBots` list for adding data-configured connections. `data/prompts/` contains the three server-only demo prompts.
- `data/experience.ts`, `skills.ts`: honest workflow explanations and explicitly missing personal facts; no invented years, client counts or testimonials.
- `data/certificates.ts`: pending certificate details and image, click-to-enlarge/zoom viewer.
- `data/contact.ts`, `admin.ts`: validated form content and admin labels/field definitions.
- `public/portrait-placeholder.svg`: replace with the owner's actual portrait and update its alt/placeholder wording in `data/site.ts`.

The only public contact is **buildwithelvora@gmail.com**. No WhatsApp, phone or social profiles are displayed. Add real certificate issuer/date/image and personal AI-tool/workflow facts when supplied. See `PART_3.md` for personalization.

## Backend setup

- `CHATBOT_SETUP.md`: real-bot methods, AI keys, shared limits, spending controls and voice limitations.
- `CONTACT_SETUP.md`: Gmail App Password, Turnstile, inbox persistence and delivery semantics.
- `DEPLOYMENT.md`: PostgreSQL, Auth.js, 2FA, uploads, migrations, seeding, Vercel/Netlify, domain/SSL and pre-launch checks.

No production password, API key, database connection or provider token is included. Keep secrets in ignored `.env.local` or hosting secret settings. Do not send passwords in chat.

## Review without downloading

![Elvora project showcase](docs/preview.png)

The complete file-by-file source snapshot, starting with the folder structure and Prisma schema, is available in [`delivery/README.md`](delivery/README.md). `VERIFICATION.md` records tested flows and remaining production requirements.
