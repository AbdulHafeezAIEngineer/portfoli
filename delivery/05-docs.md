## docs/EDITORIAL_UPGRADE.md

``````md
# Elvora editorial experience and production setup follow-up

## Deployment diagnosis

The supplied Vercel log ends with the first-owner credential validation error. It successfully installed dependencies, generated Prisma, applied migrations and queried the owner table before rejecting `ADMIN_EMAIL` or `ADMIN_PASSWORD`. The npm deprecations, missing local `.env.local` notice and PostgreSQL SSL-mode warning are not the terminating error.

The live owner must correct the private Production credential configuration: email `abdulhafeez@elvoraai.online`; a privately chosen password with 14+ characters, upper/lowercase, a number and a symbol, at most 72 UTF-8 bytes. This requirement is unchanged. No default password was added, existing passwords are preserved, and no private Vercel values were available to this execution session.

The setup script now separates invalid email from missing password requirements and reports only the unmet rules. Driver diagnostics remain fixed strings without URLs, SQL or credentials. Connection strings are validated against accidental variable assignments, masked text and password-only values. Migrations and first-owner creation remain behind `ADMIN_BOOTSTRAP_ON_BUILD=true` and Production gating. An invalid private password still deliberately stops owner activation; code cannot silently replace it.

## Audit and changes

| Finding                                                                                                       | Result                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The reveal observer stopped when reduced motion was enabled, but never restarted when that preference changed | Observer lifecycle now restarts and observes new filter content whenever motion becomes active                                                                                                                           |
| A desktop can inherit Windows/browser reduced-motion while a phone animates normally                          | A persistent, accessible Motion Auto/On/Off selector works across screen sizes; Auto honors the OS, On is explicit consent to full motion, Off disables recurring animation and optional effects                         |
| Chromium could stop responding during repeated preference changes with scroll-linked CSS timelines            | Removed those CSS timelines; reading and journey progress use a shared passive scroll listener with one queued animation frame                                                                                           |
| Only websites and bots had category controls                                                                  | All, Website concepts, UI/interface studies, AI chatbots/demos; actual counts, arrow/Home/End keys, animated entries, original study links                                                                               |
| Toolkit and skills repeated the same named products                                                           | One categorized skills section retains tool purposes, human-direction copy, original tools and the `#creative-toolkit` anchor; decorative seamless marquee                                                               |
| Navbar stayed in place with no active-section state                                                           | Direction-aware hide/show, keyboard focus brings it back, observer-based active links, staggered mobile navigation                                                                                                       |
| Desktop scrolling and hover effects were inconsistent                                                         | Lenis 1.3.23 is a lazy enhancement for fine-pointer devices with motion enabled; duration 1.15s. Native touch scrolling and reduced-motion scrolling remain available. Existing Framer Motion stays; GSAP is unnecessary |
| Large image variants could be requested                                                                       | Responsive variants capped at 1920px, existing accurate sizes retained, AVIF/WebP negotiated; only the hero emblem has priority                                                                                          |
| Repeated paint-heavy reveal blur                                                                              | Block reveals animate opacity/transform only; the oversized footer shimmer now uses opacity instead of an animated background position                                                                                   |
| Contact presentation lacked the requested field interaction                                                   | Visible associated labels float on focus/value, existing validation, honeypot, optional fields, character count and request semantics retained; success animates unobtrusively                                           |

Existing strengths retained: two self-hosted next/font variable families with swap (two initial files instead of five), server-rendered content and native FAQ, dynamically imported galleries/certificate viewer/chat, explicit consent gating, theme toggle, real contact behavior, canonical/OG/structured metadata, services, concepts, studies, journey, certification, permission-only reviews and legal links. No invented reviews, client identities, metrics or experience were introduced.

## Component plan and implementation

- `components/motion-preference.tsx`, `motion-provider.tsx`, `reveal-observer.tsx`: shared preference and progressive reveals.
- `components/editorial-effects.tsx`: dynamically loaded Lenis, lightweight desktop View badge and subtle magnetic CTA movement. Touch, reduced motion, dialogs and native scrolling areas are excluded.
- `lib/scroll.ts`, `components/scroll-progress.tsx`, `navbar.tsx`: one shared scroll subscriber, reading/journey progress and navigation direction.
- `components/work.tsx`: four categories, projects, six original interface studies, on-demand AI demos and deferred gallery.
- `components/skills.tsx`, `app/page.tsx`: unified toolkit and adjacent About/Journey content.
- `app/refinement.css`: editorial interactions, responsive filter cards, mobile navigation, stacked workflow and field polish; existing design styles retained.
- `lib/admin/password.ts`, `setup-errors.ts`, `scripts/prepare-production.ts`: private setup validation and actionable non-secret diagnostics.

Complete implementation is in the repository and regenerated source snapshot. No credential placeholders need to be copied into application code. Provider secrets stay in hosting settings.

## Design choices and limits

The supplied reference informs easing, masks, rhythm and interaction density; its proprietary source and exact timing were not copied or claimed verified. Headings reveal within roughly one second. No blocking splash screen was introduced because it would delay useful content. The six-study gallery remains separate from the existing bunch-of-work collage. The FAQ remains server-rendered native details rather than adding JavaScript solely to animate its height.

Motion is not unconditionally forced on people who request less animation. An explicit On setting enables it on a desktop that otherwise inherits reduced motion. Theme and motion selections are functional preference storage. They are not permission to load external chat.

The supplied Lighthouse/INP/frame-rate goals are targets, not guarantees. Lab Lighthouse cannot establish field INP or consistent 60fps across devices. Production database, Redis, SMTP, AI and hosting access remain separate from local validation.

## Verify the experience

1. Run `npm ci`, `npm run build`, then `npm start` (or the documented local test port).
2. Run `node tests/editorial-motion.browser.mjs` against a local production app; tests cover 360,390,768,1024,1440,1920px, both themes, categories, live media preference changes, On/Off persistence, navigation, overflow and unsolicited bot traffic.
3. Test Auto with the OS reduced-motion setting; test On and Off; refresh with a saved choice. Test a real touch device in addition to desktop emulation.
4. Use Chrome Performance with CPU throttling: scroll, filter, open/close a gallery, use keyboard navigation, and verify no repeated layout long tasks or off-screen paint effects. Test with and without saved consent.
5. Use Lighthouse mobile with a clean browser and no other running audits. Keep actual scores distinct from requested targets. The measurement artifact records final validation results.
6. `npm run test:security`, `npm run test:login`, chat/contact/consent suites cover retained security paths. `tests/owner-setup.integration.mjs` refuses nonlocal databases and verifies real migrations, weak-password diagnostics, first-owner creation, and unchanged existing password hashes.

After the owner fixes the live private password, deploy the latest main commit, verify `/admin/login`, then remove temporary `ADMIN_PASSWORD`, set `ADMIN_BOOTSTRAP_ON_BUILD=false`, and redeploy. This cleanup preserves the account and its password hash.

## Final local measurement

Lighthouse 13.5 mobile: **95 performance, 100 accessibility, 100 best practices, 100 SEO**. FCP 1.4s, LCP 2.9s, TBT 30ms, CLS 0, speed index 1.6s. The under-2s LCP target remains unmet; field INP and universal 60fps are not established. See `editorial-performance.json`. A prior intermediate run measured 90 performance before variable fonts and system-font privacy controls.

## Five further directions

1. Add genuine project narratives with the problem, design decisions and actual outcomes when available.
2. Photograph the owner and use an original art-directed portrait instead of a stock identity.
3. Add approved client reviews with permission and portraits, retaining the existing rotation controls.
4. Build a small interactive before/after design study using one real project.
5. Collect consent-aware real-user performance measurements before tuning effects for the actual audience.
``````

## docs/about-preview.png

Binary asset: 701410 bytes. SHA-256 `33c5edb3c85019d356f3a28d62f1e9c7e92f16e4bc07ae21adc08572118f030e`. Available in the repository and source ZIP.

## docs/agency-about-desktop.png

Binary asset: 261585 bytes. SHA-256 `5a6e147dd9735dc3da818ae4e85a58279a14d55b684141a8d9f7e9b7bcd8517d`. Available in the repository and source ZIP.

## docs/agency-about-mobile.png

Binary asset: 150570 bytes. SHA-256 `99c66fa7f0ded0f35a0068aab5d7c858295a99731340d3cd5c8c288959d16e74`. Available in the repository and source ZIP.

## docs/agency-admin-dashboard-desktop.png

Binary asset: 48632 bytes. SHA-256 `fd49da33f939be6df7c60833641a5f470f4d814bb895cf449cc0eb137eb869ba`. Available in the repository and source ZIP.

## docs/agency-admin-dashboard-mobile.png

Binary asset: 30293 bytes. SHA-256 `ace34bd6ae8a3f00ba1b4265e60d7c5e8aee67c64b8c5bcb9bdf596954a21b19`. Available in the repository and source ZIP.

## docs/agency-admin-inbox-desktop.png

Binary asset: 64708 bytes. SHA-256 `d6b39dd9749edebf8af1c4419479cd09dce2dd154c95104f5aab347b225498ff`. Available in the repository and source ZIP.

## docs/agency-admin-inbox-mobile.png

Binary asset: 45508 bytes. SHA-256 `41e0e7c52704f693b7ad72068bd6d56af280305dabff64195202948268e48592`. Available in the repository and source ZIP.

## docs/agency-contact-desktop.png

Binary asset: 770332 bytes. SHA-256 `3ba47b6b6053d56ce1607cc9a75bb395d05326ab39016ca8000d7667c11c70fb`. Available in the repository and source ZIP.

## docs/agency-contact-mobile.png

Binary asset: 427446 bytes. SHA-256 `86faeae554d3194f83ff342f64d8b178eb790ecd7ea1ca9bde8e457e6508f006`. Available in the repository and source ZIP.

## docs/agency-faq-desktop.png

Binary asset: 71833 bytes. SHA-256 `d0a60439618ede50a619f54c50424e8e15b8726d710e002088851331f304a960`. Available in the repository and source ZIP.

## docs/agency-faq-mobile.png

Binary asset: 51502 bytes. SHA-256 `e7f39d42eb54c62eea24bc07817f226671bce3d1078cde69c9218d3904b50f75`. Available in the repository and source ZIP.

## docs/agency-home-desktop.png

Binary asset: 310755 bytes. SHA-256 `f04625a63c7e7eec3ef96e71101ea24706aa46c8ebfec9473f296b427fc8da80`. Available in the repository and source ZIP.

## docs/agency-home-mobile.png

Binary asset: 93592 bytes. SHA-256 `00961c2ce87307f85258f5c9abf5ea17c10e02595b73229c5de02719d67a70e8`. Available in the repository and source ZIP.

## docs/agency-performance.json

``````json
{
  "source": "Local production build, explicit file content mode, fresh mobile-emulated Lighthouse run; no simultaneous captures/tests. Not a live deployment guarantee.",
  "date": "17 October 2026",
  "fetchTime": "2026-10-17T08:25:46.463Z",
  "lighthouseVersion": "13.5.0",
  "scores": {
    "performance": 92,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100
  },
  "metrics": {
    "first-contentful-paint": {
      "value": 1211.353,
      "display": "1.2 s"
    },
    "largest-contentful-paint": {
      "value": 3265.3677500000003,
      "display": "3.3 s"
    },
    "total-blocking-time": {
      "value": 17.5,
      "display": "20 ms"
    },
    "cumulative-layout-shift": {
      "value": 0,
      "display": "0"
    },
    "speed-index": {
      "value": 1211.353,
      "display": "1.2 s"
    }
  },
  "settings": {
    "formFactor": "mobile",
    "throttlingMethod": "simulate",
    "throttling": {
      "rttMs": 150,
      "throughputKbps": 1638.4,
      "requestLatencyMs": 562.5,
      "downloadThroughputKbps": 1474.5600000000002,
      "uploadThroughputKbps": 675,
      "cpuSlowdownMultiplier": 4
    },
    "screenEmulation": {
      "mobile": true,
      "width": 412,
      "height": 823,
      "deviceScaleFactor": 1.75,
      "disabled": false
    }
  },
  "limitations": [
    "Public hosting, actual provider services and physical devices were not audited.",
    "LCP is 3.3 seconds in this simulated mobile run; scores vary with host, CPU and network.",
    "Dependency security is a separate audit in SECURITY_STATUS.md."
  ]
}
``````

## docs/agency-project-desktop.png

Binary asset: 2009711 bytes. SHA-256 `d59af0835d6eec0f5b70e8a89698e660d984df00313dfa40b308aa8a5fc36551`. Available in the repository and source ZIP.

## docs/agency-project-mobile.png

Binary asset: 597787 bytes. SHA-256 `557d174f09482c8505bc755624b14b04c1d6d9dab4053e6c20f04a5063dfe418`. Available in the repository and source ZIP.

## docs/agency-service-desktop.png

Binary asset: 926485 bytes. SHA-256 `911a4e65624761b5e22ceee7e2f210b5c80e0a048ab0ada7ffa8169e4d316998`. Available in the repository and source ZIP.

## docs/agency-service-mobile.png

Binary asset: 442708 bytes. SHA-256 `7ecfe21f591ca291ea8e30ffddcdd0c187f6a06aaccc51b13309e914128e0c5d`. Available in the repository and source ZIP.

## docs/brand-preview.png

Binary asset: 496538 bytes. SHA-256 `5db7c029677108382f5669bc6053b8e60f395d9e26051f23315f539eb67341ff`. Available in the repository and source ZIP.

## docs/certificate-showcase.png

Binary asset: 288928 bytes. SHA-256 `d953dd4825170428cfc8bd8cfc4cb49f517455fece767fb291e2e48221decc38`. Available in the repository and source ZIP.

## docs/editorial-contact-desktop.png

Binary asset: 573344 bytes. SHA-256 `5a65396856bd3365ed68206dbac6f52ed6f7e473dd163bf99b8df540184b1ac3`. Available in the repository and source ZIP.

## docs/editorial-contact-mobile.png

Binary asset: 372892 bytes. SHA-256 `ad49bfc45d7c204b87573f541361ef8c84a9c5728c62b77f1ddee592511d4ce4`. Available in the repository and source ZIP.

## docs/editorial-desktop-hero.png

Binary asset: 322115 bytes. SHA-256 `0efb2e215fc22b1755d088863be129e6126bea1c44f49f880997b29bab6cdd70`. Available in the repository and source ZIP.

## docs/editorial-desktop-work.png

Binary asset: 181731 bytes. SHA-256 `b066b2b5c4d541cc7341578cb305b9a0d531a771144f0ade1459153839b7f06d`. Available in the repository and source ZIP.

## docs/editorial-domains-desktop.png

Binary asset: 276610 bytes. SHA-256 `52a023c8b8f31b739c00d4f374b5e5fdc1fc482b30a5fe652d245f43d0a6bb9d`. Available in the repository and source ZIP.

## docs/editorial-domains-mobile.png

Binary asset: 153554 bytes. SHA-256 `8ced7b04865fe7a11ccfb88a289fbfe0f36a6303013269ef4b59c02b8af7f72a`. Available in the repository and source ZIP.

## docs/editorial-footer-desktop.png

Binary asset: 917972 bytes. SHA-256 `1c3ecb2b683b7127a96c52b1b05bedba3a22836a8d15393d8469628fad0398bd`. Available in the repository and source ZIP.

## docs/editorial-footer-mobile.png

Binary asset: 345687 bytes. SHA-256 `75c9425155412d240c0cb99b3ef9f6fca68f9384faadc9613a364852fde032b5`. Available in the repository and source ZIP.

## docs/editorial-journey-desktop.png

Binary asset: 456344 bytes. SHA-256 `3ca3e5d53e7a36c20a1e27f465bc4b6697964b30db83fd944c7fb5adb1d976cb`. Available in the repository and source ZIP.

## docs/editorial-journey-mobile.png

Binary asset: 191852 bytes. SHA-256 `9c71dc3f5ac094eccfb12adf96029dbacf7405a9629bf12014b9ed10c08a46d0`. Available in the repository and source ZIP.

## docs/editorial-mobile-hero.png

Binary asset: 121656 bytes. SHA-256 `642b70d4d71fc2ed3c25a40eee6e9e0bf3b01a3338d9200885a8738baba1c156`. Available in the repository and source ZIP.

## docs/editorial-mobile-work.png

Binary asset: 71686 bytes. SHA-256 `e2832fb6cbda23ba971c8496ab0e3c6482b567a45e73551620f40c5cbde932e0`. Available in the repository and source ZIP.

## docs/editorial-performance.json

``````json
{
  "scope": "Local production, mobile simulated throttling, fresh consent banner, Lighthouse 13.5.0",
  "scores": {
    "performance": 95,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100,
    "agentic-browsing": 100
  },
  "metrics": {
    "first-contentful-paint": {
      "value": 1361.335,
      "display": "1.4 s"
    },
    "largest-contentful-paint": {
      "value": 2942.0025,
      "display": "2.9 s"
    },
    "total-blocking-time": {
      "value": 30.5,
      "display": "30 ms"
    },
    "cumulative-layout-shift": {
      "value": 0,
      "display": "0"
    },
    "speed-index": {
      "value": 1554.210417751738,
      "display": "1.6 s"
    }
  },
  "productionVerified": false
}
``````

## docs/editorial-reviews-desktop.png

Binary asset: 222637 bytes. SHA-256 `589626faefcd496c917980a27be8668bbdc1b77fa85cfbf25312e5fabe31e5ec`. Available in the repository and source ZIP.

## docs/editorial-reviews-mobile.png

Binary asset: 70988 bytes. SHA-256 `57a4f96b80a0d1197c9d49c3becc0c81f2279f83a3c57df6a93983897fffc2de`. Available in the repository and source ZIP.

## docs/editorial-skills-desktop.png

Binary asset: 309964 bytes. SHA-256 `f15710e35cc02c4d92a77888f4d9cb8d8597637802b833001c6b424ac633b038`. Available in the repository and source ZIP.

## docs/editorial-skills-mobile.png

Binary asset: 119669 bytes. SHA-256 `2825147f5cfd55770f4fd9261fc5747ddc93bcb3ae7cdebdc649e90a022b3efc`. Available in the repository and source ZIP.

## docs/editorial-tools-desktop.png

Binary asset: 330001 bytes. SHA-256 `e05d211add7670940e322f66b8aa3a508f3b87ebd2938a61ab76a03b0e84927a`. Available in the repository and source ZIP.

## docs/editorial-tools-mobile.png

Binary asset: 121178 bytes. SHA-256 `884b0407e7d46517e4f3fad45a3b15b9966fdf3899ee8bb2377d14f7f1afaf28`. Available in the repository and source ZIP.

## docs/elvora-project-preview.png

Binary asset: 327312 bytes. SHA-256 `190310850af8858ee2ea97e33ba61e5809ffea539d014a19584ade8eb96db7b2`. Available in the repository and source ZIP.

## docs/forte-bot-card.png

Binary asset: 56227 bytes. SHA-256 `7fd938fd1da1dbc92babcd12adae4062f6fe3a1e7db31d845489884e5b08348c`. Available in the repository and source ZIP.

## docs/lighthouse-summary.json

``````json
{
  "source": "Earlier premium visual build, before the four-concept/direct-chat update; local file content mode, mobile emulation; not rerun for latest update and not a live-site guarantee",
  "fetchTime": "2026-10-15T18:45:43.020Z",
  "lighthouseVersion": "13.5.0",
  "scores": {
    "performance": 85,
    "accessibility": 100,
    "best-practices": 100,
    "seo": 100
  },
  "metrics": {
    "first-contentful-paint": "1.2\u00a0s",
    "largest-contentful-paint": "3.7\u00a0s",
    "total-blocking-time": "250\u00a0ms",
    "cumulative-layout-shift": "0",
    "speed-index": "2.7\u00a0s"
  },
  "securityNote": "Next.js 14 still has reported critical advisories; see SECURITY_STATUS.md"
}
``````

## docs/mobile-about-preview.png

Binary asset: 139652 bytes. SHA-256 `c43073f9bda4da3745f6961c2a17d66e594bc231607c7332fa0499ee5dd13e8a`. Available in the repository and source ZIP.

## docs/new-work-preview.png

Binary asset: 1052258 bytes. SHA-256 `efa86397780d804c8cc4b0c285a3e591c0d9e835fe2caab09136fb7a07735476`. Available in the repository and source ZIP.

## docs/preview.png

Binary asset: 1052258 bytes. SHA-256 `efa86397780d804c8cc4b0c285a3e591c0d9e835fe2caab09136fb7a07735476`. Available in the repository and source ZIP.

## docs/reference-about-preview.png

Binary asset: 492826 bytes. SHA-256 `7a3a97251b5aa14625cd779d5072e2668a76a50a7a8b9b561e4b74982e8d9bb0`. Available in the repository and source ZIP.

## docs/reference-footer-preview.png

Binary asset: 287876 bytes. SHA-256 `b0a6e83afe03ffd3af8e30e5eb8d3a3a9b7b2a238e483c869b54cf1bc30e2ae7`. Available in the repository and source ZIP.

## docs/reference-hero-preview.png

Binary asset: 400211 bytes. SHA-256 `4db1f2ee313766c4af758aa0b4f92378e44c41c3e139905e92353711b865e92c`. Available in the repository and source ZIP.

## docs/reference-journey-preview.png

Binary asset: 303282 bytes. SHA-256 `83e96da3e82747d10d082b9e9632329fd86572dd68e23e9bcbb81593e1af2e96`. Available in the repository and source ZIP.

## docs/reference-mobile-about.png

Binary asset: 167143 bytes. SHA-256 `28e8b4cf92a7a45f2ca5f2b97fd34d329a94f7bdb4ab230385f532cec5bafbe8`. Available in the repository and source ZIP.

## docs/reference-mobile-consent-preview.png

Binary asset: 102393 bytes. SHA-256 `b772f6f81bb3cff2a776db2a84fe9deb0eea352aafcd2c90dc3f59e76520e0a1`. Available in the repository and source ZIP.

## docs/reference-mobile-work-bunch.png

Binary asset: 287979 bytes. SHA-256 `f505f07a9ef9e1d0665886c03c3ed677253fb913288a1b3a5ee9be9919cf2ebf`. Available in the repository and source ZIP.

## docs/reference-mobile-workflow.png

Binary asset: 110818 bytes. SHA-256 `16b8c5b18db8d4571a70119a0ef3018056a9bf4878c78855a8e2db61bd61e4c8`. Available in the repository and source ZIP.

## docs/reference-services-preview.png

Binary asset: 236255 bytes. SHA-256 `201fc914bdb903580069aa87c06d7d4bb6ffb315f362b9adfcfd1e4a63748ec4`. Available in the repository and source ZIP.

## docs/reference-tools-preview.png

Binary asset: 259707 bytes. SHA-256 `1f85a8f095633bd5185e90dcd532006009b99b57e45b65c2511d91b766b8eeb3`. Available in the repository and source ZIP.

## docs/reference-wall-of-love-preview.png

Binary asset: 208944 bytes. SHA-256 `0aa2d801e2b04c49df7fbf50339bab1234165b9ca3a0cc3f5b63f1d63b34b182`. Available in the repository and source ZIP.

## docs/reference-work-bunch-preview.png

Binary asset: 723689 bytes. SHA-256 `fe6849f1a3dc2c78769060ced64cc02a4bd4b0e20145f274f054c1efba187b7e`. Available in the repository and source ZIP.

## docs/reference-workflow-preview.png

Binary asset: 202277 bytes. SHA-256 `d0ce6a82ce67c89d56d9afa19fd5fc489c7480909978944267637f8fec950a4f`. Available in the repository and source ZIP.

## docs/studio-footer-preview.png

Binary asset: 348162 bytes. SHA-256 `c6e28917b071acc4f4dcf9353d0cad5e28cea4b962e17ef7d0adb08b3b517f43`. Available in the repository and source ZIP.

## docs/studio-hero-preview.png

Binary asset: 404977 bytes. SHA-256 `a28916fe17ad5bb2d5c0dee41503daaa1da0620675ce6b4fdf95b39d1856cf69`. Available in the repository and source ZIP.

## docs/studio-journey-preview.png

Binary asset: 454768 bytes. SHA-256 `81116fef24213f87af67514dcbbd8004e4924fc4315f9f1280055df4616b6fc0`. Available in the repository and source ZIP.

## docs/studio-mobile-consent-preview.png

Binary asset: 102849 bytes. SHA-256 `744f16d69ca2e94e25a858f203f8c4dbd55a126d51dc0761bf835bcac5555003`. Available in the repository and source ZIP.

## docs/studio-services-preview.png

Binary asset: 480712 bytes. SHA-256 `4337c789b10fd969e970263589d7ea655b3e1017b4ac0c8e9f4b9a66b33586a5`. Available in the repository and source ZIP.

## docs/studio-tools-preview.png

Binary asset: 259589 bytes. SHA-256 `74800de09b771bf2b08a3153098410bb192b0657e803281085877e39427d6884`. Available in the repository and source ZIP.

## docs/studio-wall-of-love-preview.png

Binary asset: 311106 bytes. SHA-256 `d330d0be48962dc185d37fdfc6be1fe3271da07f7225062a6f6e92060151f1df`. Available in the repository and source ZIP.

## docs/studio-work-bunch-preview.png

Binary asset: 845616 bytes. SHA-256 `8aabb777245d17af26d44e968a31fbab7a7be375d4247c92160c536c956ac932`. Available in the repository and source ZIP.

## docs/studio-workflow-preview.png

Binary asset: 454501 bytes. SHA-256 `1735d85969122e959103186f9ec912ce159531221178846f220ec1dc757ecb77`. Available in the repository and source ZIP.
