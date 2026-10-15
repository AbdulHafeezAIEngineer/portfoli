```text
portfoli/
├── .env.example
├── .eslintrc.json
├── .gitignore
├── BOTPRESS_SETUP.md
├── CHATBOT_SETUP.md
├── CONCEPTS.md
├── CONTACT_SETUP.md
├── DEPLOYMENT.md
├── PART_3.md
├── README.md
├── SCREENSHOTS.md
├── SECURITY_STATUS.md
├── VERIFICATION.md
├── middleware.ts
├── netlify.toml
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── app/
│   ├── bots.css
│   ├── devices.css
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── page.tsx
│   ├── premium.css
│   ├── profile.css
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── admin/
│   │   ├── admin.css
│   │   └── [[...path]]/
│   │       └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── [resource]/
│   │   │   │   └── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── bot-embed/
│   │   │   └── route.ts
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── contact/
│   │       └── route.ts
│   └── demo/
│       ├── concepts.css
│       ├── demo.css
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── admin-app.tsx
│   ├── back-to-top.tsx
│   ├── bot-chat-panel.tsx
│   ├── bot-embed.tsx
│   ├── bot-services.tsx
│   ├── brand-mark.tsx
│   ├── certificate-viewer.tsx
│   ├── certifications.tsx
│   ├── concept-site.tsx
│   ├── contact-form.tsx
│   ├── contact.tsx
│   ├── demo-site.tsx
│   ├── experience.tsx
│   ├── footer.tsx
│   ├── forte-preview.tsx
│   ├── hero.tsx
│   ├── motion-provider.tsx
│   ├── navbar.tsx
│   ├── project-card.tsx
│   ├── project-gallery.tsx
│   ├── reveal.tsx
│   ├── scroll-progress.tsx
│   ├── skills.tsx
│   ├── turnstile.tsx
│   └── work.tsx
├── data/
│   ├── admin.ts
│   ├── bots.ts
│   ├── certificates.ts
│   ├── concept-images.ts
│   ├── concepts.ts
│   ├── contact.ts
│   ├── demos.ts
│   ├── experience.ts
│   ├── project-presentation.ts
│   ├── projects.ts
│   ├── site.ts
│   ├── skills.ts
│   └── prompts/
│       ├── booking.ts
│       ├── support.ts
│       └── voice.ts
├── docs/
│   ├── about-preview.png
│   ├── brand-preview.png
│   ├── certificate-showcase.png
│   ├── elvora-project-preview.png
│   ├── forte-bot-card.png
│   ├── lighthouse-summary.json
│   ├── mobile-about-preview.png
│   ├── new-work-preview.png
│   └── preview.png
├── hooks/
│   ├── use-modal.ts
│   └── use-voice.ts
├── lib/
│   ├── bot-runtime.ts
│   ├── content-loader.ts
│   ├── content.ts
│   ├── db.ts
│   ├── records.ts
│   ├── admin/
│   │   ├── auth.ts
│   │   ├── images.ts
│   │   ├── password.ts
│   │   ├── rate-limit.ts
│   │   ├── schemas.ts
│   │   ├── security.ts
│   │   ├── session.ts
│   │   └── totp.ts
│   ├── chat/
│   │   ├── embed.ts
│   │   ├── guard.ts
│   │   ├── http.ts
│   │   ├── protocol.ts
│   │   ├── provider.ts
│   │   └── rate-limit.ts
│   └── contact/
│       ├── mail.ts
│       ├── rate-limit.ts
│       ├── schema.ts
│       └── turnstile.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│       ├── migration_lock.toml
│       └── 202610150001_initial/
│           └── migration.sql
├── public/
│   ├── elvora-logo.svg
│   ├── portrait-placeholder.svg
│   ├── certificates/
│   │   ├── coursiv-master-of-chatgpt.webp
│   │   └── prompt-engineering-placeholder.png
│   ├── concepts/
│   │   ├── aster-hero.webp
│   │   ├── kovo-hero.webp
│   │   ├── solenne-hero.webp
│   │   └── vanta-hero.webp
│   └── projects/
│       ├── aster-1.webp
│       ├── aster-2.webp
│       ├── aster-3.webp
│       ├── aster-4.webp
│       ├── aster-capture.json
│       ├── elvora-promo.webp
│       ├── kovo-1.webp
│       ├── kovo-2.webp
│       ├── kovo-3.webp
│       ├── kovo-4.webp
│       ├── kovo-capture.json
│       ├── real-estate-1.webp
│       ├── real-estate-2.webp
│       ├── real-estate-3.webp
│       ├── real-estate-4.webp
│       ├── real-estate-capture.json
│       ├── restaurant-1.webp
│       ├── restaurant-2.webp
│       ├── restaurant-3.webp
│       ├── restaurant-4.webp
│       ├── restaurant-capture.json
│       ├── saas-1.webp
│       ├── saas-2.webp
│       ├── saas-3.webp
│       ├── saas-4.webp
│       ├── saas-capture.json
│       ├── solenne-1.webp
│       ├── solenne-2.webp
│       ├── solenne-3.webp
│       ├── solenne-4.webp
│       ├── solenne-capture.json
│       ├── store-1.webp
│       ├── store-2.webp
│       ├── store-3.webp
│       ├── store-4.webp
│       ├── store-capture.json
│       ├── vanta-1.webp
│       ├── vanta-2.webp
│       ├── vanta-3.webp
│       ├── vanta-4.webp
│       └── vanta-capture.json
├── scripts/
│   ├── capture.ts
│   ├── generate-certificate.mjs
│   ├── generate-client.mjs
│   └── reset-admin.ts
├── tests/
│   ├── chat.test.mjs
│   ├── contact.test.mjs
│   └── security.test.mjs
└── types/
    ├── gmail-smtp.d.ts
    └── next-auth.d.ts
```

## Prisma schema

```prisma
generator client {
  provider = "prisma-client-js"
  engineType = "client"
  output = "../node_modules/.prisma/client"
}
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
model AdminUser {
  id String @id @default(cuid())
  email String @unique
  passwordHash String
  passwordVersion Int @default(1)
  failedAttempts Int @default(0)
  lockedUntil DateTime?
  totpSecret String?
  totpLastStep Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Project {
  id String @id
  title String
  subtitle String
  industry String
  description String
  stack String[]
  accent String @default("#d4af37")
  demoUrl String
  highlights String[]
  order Int @default(0)
  published Boolean @default(true)
  images ProjectImage[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model ProjectImage {
  id String @id @default(cuid())
  projectId String
  project Project @relation(fields:[projectId],references:[id],onDelete:Cascade)
  src String
  title String
  alt String
  order Int @default(0)
  @@index([projectId,order])
}
model Bot {
  id String @id
  name String
  description String
  tags String[]
  method String
  kind String
  welcome String
  starters String[]
  note String
  config Json?
  systemPrompt String?
  order Int @default(0)
  published Boolean @default(true)
  updatedAt DateTime @updatedAt
}
model Skill {
  id String @id
  name String
  category String
  order Int @default(0)
  published Boolean @default(true)
}
model Certificate {
  id String @id
  title String
  issuer String
  dateLabel String
  issuedAt String?
  description String
  image String
  alt String
  isPlaceholder Boolean @default(true)
  order Int @default(0)
  published Boolean @default(true)
}
model ContactMessage {
  id String @id @default(cuid())
  name String
  email String
  message String
  read Boolean @default(false)
  deliveryStatus String @default("pending")
  createdAt DateTime @default(now())
  @@index([createdAt])
}
model ChatLog {
  id String @id @default(cuid())
  botId String
  userMessage String
  reply String
  createdAt DateTime @default(now())
  @@index([createdAt])
}
model SiteSettings {
  id String @id @default("main")
  brand String @default("Elvora")
  email String @default("buildwithelvora@gmail.com")
  title String
  description String
  chatLogging Boolean @default(false)
  updatedAt DateTime @updatedAt
}
model AuditLog {
  id String @id @default(cuid())
  adminId String
  action String
  resource String
  recordId String?
  createdAt DateTime @default(now())
  @@index([createdAt])
}
```

Complete source files follow in folder order. Binary PNG/WebP assets are included in the project; source snapshots do not pretend image bytes are code. The four selected concept sites have 16 actual browser captures. Original generated hero imagery is disclosed; see SCREENSHOTS.md. Private environment files, dependencies and build outputs are excluded.

**Review status:** Next.js 14 remains at the user-requested version, with one reported critical production dependency finding. Other production findings were patched. See SECURITY_STATUS.md before any external launch.

## Every source file, in folder order

1. [root/ — complete files](01-root.md)
2. [app/ — complete files](02-app.md)
3. [components/ — complete files](03-components.md)
4. [data/ — complete files](04-data.md)
5. [docs/ — complete files](05-docs.md)
6. [hooks/ — complete files](06-hooks.md)
7. [lib/ — complete files](07-lib.md)
8. [prisma/ — complete files](08-prisma.md)
9. [public/ — complete files](09-public.md)
10. [scripts/ — complete files](10-scripts.md)
11. [tests/ — complete files](11-tests.md)
12. [types/ — complete files](12-types.md)

The delivery/ directory contains these generated snapshots and is excluded from recursive source listing. The running application uses the original files above.

## Install / run / capture / migrate / seed

```bash
npm ci --cache /tmp/portfoli-npm-cache
test -e .env.local || cp .env.example .env.local
npm run dev
```

Set the actual site URL and private service settings securely in .env.local. Never send passwords or API keys in chat. Stop Next.js before running capture or a production build.

```bash
npx playwright install chromium
npm run capture
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:chat
npm run test:contact
npm run test:security
npm run lint
npm run typecheck
npm run build
npm start
```

Migration/seed require the owner’s PostgreSQL and private admin settings. The native migration CLI needs verified engine-download access. Keep CONTENT_SOURCE=files until a database has been prepared. Current Next.js 14 is a review build with a known critical dependency finding: do not externally launch before resolving SECURITY_STATUS.md.

## Owner replacement / setup checklist

- [ ] Keep brand **Elvora**, owner **Abdul Hafeez**, and public email **abdulhafeez@elvoraai.online**. No phone/WhatsApp/social profiles are required.
- [ ] Replace the portrait and remaining factual workflow placeholders. The supplied Coursiv Master of ChatGPT certificate is included with its original award details.
- [ ] Add real AI-tool names and factual workflow/testing examples. No years, client totals or testimonials are invented.
- [ ] The supplied Forte O Level Study Assistant Botpress connection is configured in data/bots.ts. Verify it on the live site; database users must update their existing real-bot record. Additional file-based bots use additionalBots.
- [ ] Set OpenAI, actual site/auth origins, PostgreSQL, shared Redis, Gmail App Password, Turnstile, Blob and strong admin/auth/TOTP settings privately as needed. Remove seed/reset passwords from normal runtime.
- [ ] Resolve the Next.js 14 security blocker through an authorized patched-major upgrade before production.
- [ ] Verify real mail delivery, provider chat, database/cloud migrations, shared quotas, uploads, Turnstile, microphone/voice, DNS/SSL and backups on the final host. See DEPLOYMENT.md and VERIFICATION.md.

