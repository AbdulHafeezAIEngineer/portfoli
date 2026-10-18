# Elvora — complete source review

Generated from the current checkout. Private environment values, Git metadata, dependencies and build artifacts are excluded. Binary assets remain in the repository/ZIP; text sections provide their hashes.

Next.js 15.5.28 is the owner-approved upgrade. Public content defaults to files; durable inquiries can be enabled separately. Run reviewed migrations and `npm run admin:bootstrap` with private settings to create the first administrator. `SEED_CONTENT=demo npm run db:seed` is development-only and refuses production. Genuine reviews require publication permission; fictional design samples are visibly labeled and never presented as client endorsements.

See [verification](../VERIFICATION.md), [deployment](../DEPLOYMENT.md), [security status](../SECURITY_STATUS.md) and [audit](../AGENCY_AUDIT.md). Production dependency audit is clean; an upstream development-tool finding remains. Local tests do not prove live provider/deployment success.

## Folder structure

```text
.env.example
.eslintrc.json
.gitignore
AGENCY_AUDIT.md
BOTPRESS_SETUP.md
CHATBOT_SETUP.md
CONCEPTS.md
CONTACT_SETUP.md
DEPLOYMENT.md
OWNER_LOGIN.md
PART_3.md
PRIVACY_SETUP.md
README.md
REFERENCE_DESIGN.md
SCREENSHOTS.md
SECURITY_STATUS.md
TESTING.md
VERIFICATION.md
app/about/page.tsx
app/admin/[[...path]]/loading.tsx
app/admin/[[...path]]/page.tsx
app/admin/admin.css
app/agency.css
app/ai-bots/how-i-embed-bots/page.tsx
app/ai-bots/page.tsx
app/ai-websites/page.tsx
app/api/admin/[resource]/route.ts
app/api/admin/upload/route.ts
app/api/auth/[...nextauth]/route.ts
app/api/bot-embed/route.ts
app/api/chat/route.ts
app/api/contact/route.ts
app/atelier.css
app/bots.css
app/bunch-of-work/page.tsx
app/certificates/page.tsx
app/contact/page.tsx
app/cookies/page.tsx
app/demo/[slug]/page.tsx
app/demo/concepts.css
app/demo/demo.css
app/demo-window.css
app/devices.css
app/editorial.css
app/error.tsx
app/finishing.css
app/global-error.tsx
app/globals.css
app/how-i-build/page.tsx
app/icon.svg
app/journey/page.tsx
app/layout.tsx
app/not-found.tsx
app/opengraph-image.tsx
app/page.tsx
app/pages.css
app/premium.css
app/privacy/page.tsx
app/profile.css
app/project-art-tokens.css
app/reference-motion.css
app/reference.css
app/refinement.css
app/robots.ts
app/services/[slug]/page.tsx
app/services/page.tsx
app/showcase.css
app/sitemap.ts
app/skills/page.tsx
app/studies/[slug]/page.tsx
app/studies/studies.css
app/studio.css
app/technical-domains/page.tsx
app/terms/page.tsx
app/testimonials/page.tsx
app/theme-tokens.css
app/websites/page.tsx
app/work/[slug]/page.tsx
components/AiBotVideo.tsx
components/VisibilityVideo.tsx
components/WorkShowcaseVideo.tsx
components/admin-app.tsx
components/back-to-top.tsx
components/bot-build-process.tsx
components/bot-chat-panel.tsx
components/bot-embed.tsx
components/bot-services.tsx
components/brand-mark.tsx
components/certificate-viewer.tsx
components/certifications.tsx
components/concept-site.tsx
components/consent-provider.tsx
components/contact-form.tsx
components/contact.tsx
components/demo-site.tsx
components/demo-window.tsx
components/design-study.tsx
components/editorial-effects.tsx
components/experience.tsx
components/faq-enhancement.tsx
components/faq-section.tsx
components/footer.tsx
components/forte-preview.tsx
components/hero-emblem.tsx
components/hero.tsx
components/home-directory.tsx
components/home-explore.tsx
components/legacy-section-redirect.tsx
components/legal-page.tsx
components/logo-motion.tsx
components/motion-preference.tsx
components/motion-provider.tsx
components/navbar.tsx
components/page-tabs.tsx
components/project-card.tsx
components/project-gallery.tsx
components/reading-effects.tsx
components/reading-text.tsx
components/reveal-observer.tsx
components/reveal.tsx
components/scroll-ambience.tsx
components/scroll-progress.tsx
components/site-shell.tsx
components/skills.tsx
components/social-links.tsx
components/studio-sections.tsx
components/testimonial-scene.tsx
components/testimonials.tsx
components/text-reveal.tsx
components/tool-mark.tsx
components/turnstile.tsx
components/work-bunch.tsx
components/work.tsx
data/admin.ts
data/agency.ts
data/bots.ts
data/certificates.ts
data/concept-images.ts
data/concepts.ts
data/contact.ts
data/demos.ts
data/experience.ts
data/image-previews.ts
data/navigation.ts
data/privacy.ts
data/project-art-colors.json
data/project-presentation.ts
data/projects.ts
data/prompts/booking.ts
data/prompts/support.ts
data/prompts/voice.ts
data/site.ts
data/skills.ts
data/studies.ts
data/studio.ts
data/testimonial-samples.ts
data/theme-tokens.json
data/tool-marks.ts
docs/BRIEF_COMPLETION.md
docs/CATEGORIZED_PAGES.md
docs/EDITORIAL_UPGRADE.md
docs/HOMEPAGE_BANDS.md
docs/PRESENTATION_UPDATE.md
docs/PURPLE_VIDEO_UPDATE.md
docs/READY_PLAYBACK_UPDATE.md
docs/RESTORED_HOMEPAGE.md
docs/SHOWCASE_UPDATE.md
docs/VIDEO_MOTION_UPDATE.md
docs/WEBSITES_TESTIMONIALS.md
docs/about-preview.png
docs/agency-about-desktop.png
docs/agency-about-mobile.png
docs/agency-admin-dashboard-desktop.png
docs/agency-admin-dashboard-mobile.png
docs/agency-admin-inbox-desktop.png
docs/agency-admin-inbox-mobile.png
docs/agency-contact-desktop.png
docs/agency-contact-mobile.png
docs/agency-faq-desktop.png
docs/agency-faq-mobile.png
docs/agency-home-desktop.png
docs/agency-home-mobile.png
docs/agency-performance.json
docs/agency-project-desktop.png
docs/agency-project-mobile.png
docs/agency-service-desktop.png
docs/agency-service-mobile.png
docs/brand-preview.png
docs/brief-performance.json
docs/certificate-showcase.png
docs/contact-desktop-dark.png
docs/contact-desktop-light.png
docs/contact-mobile-dark.png
docs/contact-mobile-light.png
docs/curated-work-desktop-dark.png
docs/curated-work-desktop-light.png
docs/curated-work-mobile-dark.png
docs/curated-work-mobile-light.png
docs/editorial-contact-desktop.png
docs/editorial-contact-mobile.png
docs/editorial-desktop-hero.png
docs/editorial-desktop-work.png
docs/editorial-domains-desktop.png
docs/editorial-domains-mobile.png
docs/editorial-footer-desktop.png
docs/editorial-footer-mobile.png
docs/editorial-journey-desktop.png
docs/editorial-journey-mobile.png
docs/editorial-mobile-hero.png
docs/editorial-mobile-work.png
docs/editorial-performance.json
docs/editorial-reviews-desktop.png
docs/editorial-reviews-mobile.png
docs/editorial-skills-desktop.png
docs/editorial-skills-mobile.png
docs/editorial-tools-desktop.png
docs/editorial-tools-mobile.png
docs/elvora-project-preview.png
docs/forte-bot-card.png
docs/home-bands-accessibility.json
docs/home-bands-dark-1440.png
docs/home-bands-dark-390.png
docs/home-bands-light-1440.png
docs/home-bands-light-390.png
docs/home-bands-overview-desktop.png
docs/home-bot-loop-1440.png
docs/home-bot-loop-390.png
docs/home-collection-loop-1440.png
docs/home-collection-loop-390.png
docs/home-explore-highlight-1440.png
docs/home-explore-highlight-390.png
docs/home-websites-loop-1440.png
docs/home-websites-loop-390.png
docs/horizon-explore-accessibility.json
docs/image-optimization.json
docs/lighthouse-summary.json
docs/login-fields-mobile.png
docs/logo-flipped.png
docs/logo-front.png
docs/mobile-about-preview.png
docs/new-work-preview.png
docs/pages-accessibility.json
docs/pages-ai-websites-1440.png
docs/pages-ai-websites-390.png
docs/pages-bunch-of-work-1440.png
docs/pages-bunch-of-work-390.png
docs/pages-home-1440.png
docs/pages-home-390.png
docs/pages-scroll-readiness.json
docs/pages-testimonials-1440.png
docs/pages-testimonials-390.png
docs/preview.png
docs/purple-accessibility.json
docs/purple-ai-video.png
docs/purple-contact-dark.png
docs/purple-contact-light.png
docs/purple-hero-dark.png
docs/purple-hero-light.png
docs/purple-preserved-work-wall.png
docs/purple-testimonials-dark.png
docs/purple-testimonials-light.png
docs/purple-testimonials-mobile-dark.png
docs/purple-testimonials-mobile-light.png
docs/purple-work-video.png
docs/reading-desktop-dark.png
docs/reading-desktop-light.png
docs/reading-mobile-dark.png
docs/reading-mobile-light.png
docs/ready-accessibility.json
docs/ready-demo-mobile.png
docs/ready-demo-window.png
docs/ready-scroll-results.json
docs/ready-video-1440.png
docs/ready-video-390.png
docs/reference-about-preview.png
docs/reference-footer-preview.png
docs/reference-hero-preview.png
docs/reference-journey-preview.png
docs/reference-mobile-about.png
docs/reference-mobile-consent-preview.png
docs/reference-mobile-work-bunch.png
docs/reference-mobile-workflow.png
docs/reference-services-preview.png
docs/reference-tools-preview.png
docs/reference-wall-of-love-preview.png
docs/reference-work-bunch-preview.png
docs/reference-workflow-preview.png
docs/restored-accessibility.json
docs/restored-footer-1440.png
docs/restored-footer-390.png
docs/restored-home-dark-1440.png
docs/restored-home-dark-390.png
docs/restored-home-light-1440.png
docs/restored-home-light-390.png
docs/restored-scroll-readiness.json
docs/reviews-empty-desktop-dark.png
docs/reviews-empty-desktop-light.png
docs/reviews-empty-mobile-dark.png
docs/reviews-empty-mobile-light.png
docs/showcase-1440-dark.png
docs/showcase-1440-light.png
docs/showcase-390-light.png
docs/studio-footer-preview.png
docs/studio-hero-preview.png
docs/studio-journey-preview.png
docs/studio-mobile-consent-preview.png
docs/studio-services-preview.png
docs/studio-tools-preview.png
docs/studio-wall-of-love-preview.png
docs/studio-work-bunch-preview.png
docs/studio-workflow-preview.png
docs/testimonials-floating-1440.png
docs/testimonials-floating-390.png
docs/web-positioning-about-1440.png
docs/web-positioning-about-390.png
docs/web-positioning-home-1440.png
docs/web-positioning-home-390.png
docs/web-positioning-skills-1440.png
docs/web-positioning-skills-390.png
docs/web-positioning-websites-1440.png
docs/web-positioning-websites-390.png
docs/websites-testimonials-accessibility.json
docs/websites-testimonials-readiness.json
docs/workflow-1440-dark.png
docs/workflow-1440-light.png
docs/workflow-390-light.png
hooks/use-modal.ts
hooks/use-voice.ts
lib/admin/auth.ts
lib/admin/configuration.ts
lib/admin/images.ts
lib/admin/login-client.ts
lib/admin/password.ts
lib/admin/rate-limit.ts
lib/admin/redis-configuration.ts
lib/admin/schemas.ts
lib/admin/security.ts
lib/admin/session.ts
lib/admin/setup-errors.ts
lib/admin/totp.ts
lib/bot-runtime.ts
lib/chat/embed.ts
lib/chat/guard.ts
lib/chat/http.ts
lib/chat/protocol.ts
lib/chat/provider.ts
lib/chat/rate-limit.ts
lib/consent.ts
lib/contact/mail.ts
lib/contact/rate-limit.ts
lib/contact/schema.ts
lib/contact/turnstile.ts
lib/content-loader.ts
lib/content.ts
lib/db.ts
lib/faq-animation.ts
lib/image-preview.ts
lib/page-metadata.ts
lib/records.ts
lib/scroll.ts
middleware.ts
netlify.toml
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
prisma/migrations/202610150001_initial/migration.sql
prisma/migrations/202610170001_agency_content_and_leads/migration.sql
prisma/migrations/migration_lock.toml
prisma/schema.prisma
prisma/seed.ts
public/avatars/demo-ethan.svg
public/avatars/demo-maya.svg
public/avatars/demo-nora.svg
public/avatars/demo-omar.svg
public/certificates/coursiv-master-of-chatgpt.webp
public/certificates/prompt-engineering-placeholder.png
public/concepts/aster-hero.webp
public/concepts/kovo-hero.webp
public/concepts/solenne-hero.webp
public/concepts/vanta-hero.webp
public/elvora-logo.svg
public/portrait-placeholder.svg
public/projects/aster-1.webp
public/projects/aster-2.webp
public/projects/aster-3.webp
public/projects/aster-4.webp
public/projects/aster-capture.json
public/projects/elvora-promo.webp
public/projects/kovo-1.webp
public/projects/kovo-2.webp
public/projects/kovo-3.webp
public/projects/kovo-4.webp
public/projects/kovo-capture.json
public/projects/real-estate-1.webp
public/projects/real-estate-2.webp
public/projects/real-estate-3.webp
public/projects/real-estate-4.webp
public/projects/real-estate-capture.json
public/projects/restaurant-1.webp
public/projects/restaurant-2.webp
public/projects/restaurant-3.webp
public/projects/restaurant-4.webp
public/projects/restaurant-capture.json
public/projects/saas-1.webp
public/projects/saas-2.webp
public/projects/saas-3.webp
public/projects/saas-4.webp
public/projects/saas-capture.json
public/projects/solenne-1.webp
public/projects/solenne-2.webp
public/projects/solenne-3.webp
public/projects/solenne-4.webp
public/projects/solenne-capture.json
public/projects/store-1.webp
public/projects/store-2.webp
public/projects/store-3.webp
public/projects/store-4.webp
public/projects/store-capture.json
public/projects/vanta-1.webp
public/projects/vanta-2.webp
public/projects/vanta-3.webp
public/projects/vanta-4.webp
public/projects/vanta-capture.json
public/studies/aura.webp
public/studies/capture.json
public/studies/elsewhere.webp
public/studies/form.webp
public/studies/noma.webp
public/studies/offscript.webp
public/studies/orbit.webp
public/tool-marks/SOURCES.md
public/tool-marks/claude.svg
public/tool-marks/css.svg
public/tool-marks/git.svg
public/tool-marks/github.svg
public/tool-marks/githubcopilot.svg
public/tool-marks/googlegemini.svg
public/tool-marks/html5.svg
public/tool-marks/nextdotjs.svg
public/tool-marks/openai.svg
public/tool-marks/python.svg
public/tool-marks/react.svg
public/tool-marks/tailwindcss.svg
public/tool-marks/typescript.svg
public/videos/ai-bot-mobile.mp4
public/videos/ai-bot-mobile.webm
public/videos/ai-bot-poster.webp
public/videos/ai-bot.mp4
public/videos/ai-bot.webm
public/videos/home-ai-bot-mobile.mp4
public/videos/home-ai-bot-mobile.webm
public/videos/home-ai-bot-poster.webp
public/videos/home-ai-bot.mp4
public/videos/home-ai-bot.webm
public/videos/home-collection-mobile.mp4
public/videos/home-collection-mobile.webm
public/videos/home-collection-poster.webp
public/videos/home-collection.mp4
public/videos/home-collection.webm
public/videos/home-websites-mobile.mp4
public/videos/home-websites-mobile.webm
public/videos/home-websites-poster.webp
public/videos/home-websites.mp4
public/videos/home-websites.webm
public/videos/work-showcase-mobile.mp4
public/videos/work-showcase-mobile.webm
public/videos/work-showcase-poster.webp
public/videos/work-showcase.mp4
public/videos/work-showcase.webm
scripts/bootstrap-admin.ts
scripts/capture-studies.ts
scripts/capture.ts
scripts/generate-certificate.mjs
scripts/generate-client.mjs
scripts/generate-image-previews.mjs
scripts/generate-theme-assets.mjs
scripts/package-source.py
scripts/prepare-production.ts
scripts/reset-admin.ts
tailwind.config.ts
tests/admin-database-outage.browser.mjs
tests/admin-login.browser.mjs
tests/admin-login.test.ts
tests/agency.integration.mjs
tests/auth.integration.mjs
tests/chat.test.mjs
tests/consent.test.ts
tests/contact.test.mjs
tests/demo-windows.browser.mjs
tests/editorial-motion.browser.mjs
tests/finishing.browser.mjs
tests/helpers/https-proxy.mjs
tests/login-fields.browser.mjs
tests/owner-setup.integration.mjs
tests/pages.browser.mjs
tests/review-motion.browser.mjs
tests/scroll-readiness.browser.mjs
tests/security.test.mjs
tests/showcase-videos.browser.mjs
tests/testimonials-floating.browser.mjs
tests/video-motion.browser.mjs
tsconfig.json
types/gmail-smtp.d.ts
types/next-auth.d.ts
```

## Database schema

``````prisma
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
  company String @default("")
  service String @default("")
  status String @default("new")
  notes String @default("")
  updatedAt DateTime @updatedAt
  read Boolean @default(false)
  deliveryStatus String @default("pending")
  createdAt DateTime @default(now())
  @@index([createdAt])
  @@index([status,createdAt])
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
  email String @default("abdulhafeez@elvoraai.online")
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
model Service {
  id String @id
  title String
  description String
  detail String
  tags String[]
  scope String[]
  requirements String[]
  order Int @default(0)
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Faq {
  id String @id
  question String
  answer String
  order Int @default(0)
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Testimonial {
  id String @id
  name String
  role String
  quote String
  portrait String @default("")
  permissionConfirmed Boolean @default(false)
  order Int @default(0)
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
``````

## Source by folder

- [root](01-root.md)
- [app](02-app.md)
- [components](03-components.md)
- [data](04-data.md)
- [docs](05-docs.md)
- [hooks](06-hooks.md)
- [lib](07-lib.md)
- [prisma](08-prisma.md)
- [public](09-public.md)
- [scripts](10-scripts.md)
- [tests](11-tests.md)
- [types](12-types.md)
