# Custom business assistants

Three own-brand AI chat experiences are implemented on `/ai-bots`. The page now uses original business artwork, clickable HTML chat previews and alternating editorial feature rows inspired by the supplied chatbot.com references. A real prismatic WebGL hero draws animated spectral ribbons on black, inspired by the supplied shader screenshot. Only this route uses the new presentation:

| Assistant | Example use | Approved source |
| --- | --- | --- |
| Veldt Support | Product recommendations, delivery, returns | `data/knowledge/veldt.ts` |
| Northline Assistant | Service explanations and a conversational project brief | `data/knowledge/northline.ts` |
| Solenne Concierge | Stay comparisons and guest enquiries | `data/knowledge/solenne.ts` |

These fictional businesses demonstrate real model-powered conversations once the AI service is configured. Sample rates and prices are not offers from Elvora or real clients. Solenne room names and base rates match the existing website concept: Garden Suite €280, Terrace Suite €320, Cove Villa €580. Forte's existing external connection and Aura's browser voice experience are retained. Legacy support/booking API IDs remain compatible.

## How the data works

Each request resolves one assistant ID on the server and adds only its approved business knowledge to the model context. The complete small knowledge file fits in context; there is no vector database or model fine-tuning. The server includes recent conversation turns for follow-ups. It never accepts client-supplied system instructions or knowledge overrides. The existing input, origin, concurrency, usage and response-size controls remain active.

Edit a source file and redeploy to update the file-mode assistant. Public source links at `/api/bot-knowledge?botId=veldt` (or `northline`, `solenne`) expose the same fictional facts, never credentials, full system prompts or CMS records. Do not put private client documents into these public demo sources. Backend knowledge modules are marked `server-only`.

Each assistant has its own avatar, starter questions and separate in-memory browser history. Visitors can clear a conversation. Each native conversation now has an own-brand wordmark, matching logo, header, bubbles, composer, subtle patterned background and expandable privacy details. There is no provider badge in these three custom chat interfaces. No new dependency was added. An own-brand interface still uses a paid model provider; absence of a widget badge does not mean free or unlimited AI usage.

## Private activation

1. Choose a provider. For Gemini, configure the server-only `GEMINI_API_KEY` in your host, set `CHAT_PROVIDER=gemini` (or leave `auto`, which prefers Gemini when its key exists), and choose an eligible model through `GEMINI_MODEL`. The fallback model name is `gemini-2.5-flash`; confirm its current availability and quota in your own AI Studio project. The owner reported a Free tier project, but this environment has no private key to verify that project, its models or quota. Free tier is limited and eligibility can vary. Google AI Studio free-tier data terms should be reviewed before using confidential client data; these public demos use fictional information.

   Alternatively, configure **one** server-side OpenAI project API key with billing enabled: `OPENAI_API_KEY`, or the alternative `ELVORA_CHAT_API_KEY`. The alternative is checked first. Never use a `NEXT_PUBLIC_` prefix, paste credentials into chat, or commit them. ChatGPT subscription access does not supply the website's API credentials.
2. For OpenAI, the existing default model is `gpt-4o-mini`, configurable through `OPENAI_MODEL` using a model supported by the existing Chat Completions request format. Set `CHAT_ENABLED=true`.
3. Production serverless/multi-instance hosting needs the existing `CHAT_REDIS_REST_URL` and `CHAT_REDIS_REST_TOKEN` settings for a shared Upstash-compatible REST usage store. Keep `CHAT_DAILY_REQUEST_CAP` conservative (default 100 across API bots) and configure provider billing limits/alerts separately. Do not enable `CHAT_ALLOW_IN_MEMORY_LIMITER` on serverless hosting; that exception is only for deliberate single-process deployments.
4. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS site origin, including `www` if canonical, and redeploy. Leave the trusted-IP header blank unless your edge actually overwrites it.
5. In ordinary `CONTENT_SOURCE=files` mode the cards and knowledge are selected automatically. Database content mode uses published CMS records instead; it intentionally does not substitute missing rows. Publish matching bot IDs, method `api`, null connection config and appropriate visible card content to use these built-in sources. A nonempty CMS system prompt overrides the built-in prompt for that row and must be reviewed for accuracy.
6. Test a question and a follow-up for each bot, unsupported facts, Urdu/Roman Urdu, limit responses and provider failure. Verify real answers against the approved source. These steps are not complete merely because a key variable is present.

The cloud environment draft contains the `GEMINI_API_KEY` requirement scoped to `generativelanguage.googleapis.com`, plus the earlier optional OpenAI key requirement and shared-store variable requirements. Only the selected provider key is needed. Google destination access was added to the saved restricted policy through its secret requirement. Review and save environment settings and publish the cloud environment to activate retained setup. That does not set secrets in the website's production host: the owner must configure the host privately too. API key prefixes named `OPENAI_` are reserved for cloud proxy-secret targets; the alternative key name avoids that restriction while preserving standard hosting support.

Without the key or production quota setup, the three built-in cards show **Explore assistant / AI connection pending**, display a specific setup notice. Typing and sending remain available; the backend still rejects unconfigured requests honestly and preserves the draft for retry. The API returns an honest unavailable response; no canned-answer fallback impersonates AI. Provider authentication, billing, shared-store connectivity and real model answer quality require actual private credentials and remain unverified until activated.

## Validation

- `npm run test:chat`: request validation, one-business-only prompt grounding, history, key alias, unavailable state, source endpoint and existing provider/limit/embed regression tests. Provider responses are mocked.
- `npm run lint`, `npm run typecheck`, `npm run test:security`, `npm run build`.
- `node tests/business-assistants.browser.mjs`: starts its own loopback production server, verifies missing-key API/UI, then uses an explicit dummy key and mocked chat responses to test all three interfaces at 360/390/768/1440 px in both themes. Checks starters, history isolation, follow-ups, clear, Escape focus return, avatars, source links and overflow. It never tests dummy credentials against the real model API. Screenshots in `docs/business-assistants/` are local UI fixtures, not proof of live model replies.
- Existing Apple UI browser test now targets Veldt instead of Cedar; run it against a locally configured UI fixture server if needed. The pages smoke test expects five cards including Forte and Aura.

No real purchases, order lookup, appointments, reservations, lead submissions, refunds or emails are implemented by these conversational demos. Actual actions need authenticated tools and separate integration work.

Completed local verification on 19 October 2026: production build (including lint/type checks), standalone lint/typecheck, 20 chat tests, 12 security tests and 24 browser scenarios passed. Missing-key API/UI checks also passed for all three assistants. A search of the generated client assets found none of the approved source-document headings or full business-prompt marker. Real AI replies, credentials/billing, live shared Redis connectivity and public-host behavior were not verified; no production provider secrets were available.


## Image-led page and shader

- `data/bot-showcase.ts` defines each feature headline, capabilities and sample conversation; samples are labeled and reflect the approved knowledge. They do not claim that a model request was performed.
- Three original generated photographs in `public/bots/` are optimized WebP files, about 27–205 KB each. UI lettering and example conversations are native HTML, so copy stays crisp and editable. Both the image and its CTA open the matching real chat dialog.
- The hero is a standalone WebGL fragment shader in `components/bot-prism-shader.tsx`. Render resolution is capped at 1100 × 800 and frame rate at 24. It pauses when offscreen, hidden or Motion Off; Motion Off retains a still frame. The reference image is visual direction, not a claim to use the exact proprietary Unicorn Studio scene.
- The static fallback in `public/bots/prism-fallback.webp` is an exported frame from this actual shader. Unsupported/lost WebGL still leaves legible content, links and chat controls. GPU resources are disposed when leaving the page.
- The generic full-page shader is replaced only on `/ai-bots`; other category shaders and the homepage retain their existing implementation. The supplied videos remain present and loop under the existing motion controls.
- The build process remains below the demos. Integration explanations and code examples are preserved inside expandable details instead of an always-open wall of cards.
- `node tests/bot-redesign.browser.mjs` checks image decoding, image-to-chat behavior, responsive layouts, preserved process/integration sections and actual WebGL pixels changing on desktop and DPR-3 touch. It also checks Motion Off/On, offscreen stop/resume, lost/unsupported context fallbacks and no bot scene on Home. `SHADER_ONLY=1` limits it to the graphics/lifecycle checks.
- `npm run test:chat` additionally exercises the Gemini endpoint/header, system instruction, model/user history mapping, output bounds, thought filtering, quota/safety failure behavior and explicit model validation. No real provider reply is claimed by these mocked tests.

For production Vercel activation, save `GEMINI_API_KEY` as a private production environment variable and redeploy. Changing the chat backend in Git does not automatically transfer keys from this workspace, nor does a Vercel key appear in this workspace. The existing shared `CHAT_REDIS_REST_URL` / `CHAT_REDIS_REST_TOKEN` configuration remains required on serverless production, even for a model provider's free tier. If the UI still says connection pending after adding a key, check the usage-store pair and `CHAT_ENABLED` too. Do not use the single-process memory exception as a Vercel workaround.

Redesign verification on 19 October 2026: production build (including lint and type validation), 22 chat/provider tests, 24 conversation UI scenarios and 8 responsive/theme layout cases passed. The tablet video overflow discovered during QA was fixed by bounding the inherited full-bleed video to its story grid. Real fragment pixels changed on desktop and a DPR-3 touch viewport; Motion Off/On, offscreen pause/resume, context loss and no-WebGL fallback checks passed. Public Home has no bot shader. The owner reported saving their key privately in Vercel; this workspace cannot read that key. Provider authentication, exact free quota/model eligibility, deployed shared-store connectivity and live-site AI replies remain separately unverified.


## Typing and deployment configuration follow-up

The composer no longer disables typing or Send because the page's server-rendered readiness flag is false. A visitor can always write, select starters and attempt sending. Only an in-flight request temporarily locks the input. An actual failed request displays the server error and restores the full draft; failed sends are not inserted as fake successful conversation turns. Server-side key checks, shared quotas and provider validation remain enforced.

Readiness now distinguishes missing provider key, missing shared quota setup, pause switch and invalid provider choice. Vercel-provisioned quota stores are recognized using one complete pair in this order: `CHAT_REDIS_REST_URL/TOKEN`, `KV_REST_API_URL/TOKEN`, `UPSTASH_REDIS_REST_URL/TOKEN`. An explicitly present partial pair fails closed rather than borrowing a token or silently switching stores. No production in-memory workaround was enabled. The owner supplied a screenshot showing a production Gemini key; it did not establish any shared-store configuration or a successful Gemini response.

Veldt, Northline, Solenne and Aura chat windows use independently scoped brand themes regardless of the outer site's light/dark choice. The message transcript, input focus, error treatment and touch controls retain readable contrast. The original business marks are used in the header and next to assistant replies, with an Elvora credit. Privacy and factual-demo information remain accessible through About this chat; business source links remain visible. The composer can scroll within a short viewport so the keyboard cannot permanently hide its controls.

Typing/theme verification on 19 October 2026: all 24 backend tests passed, including matched Redis aliases and setup-state distinctions. The updated browser suite passed 24 viewport/theme conversation scenarios plus three real missing-key failure/retry cases. Eight additional 390/1440px scenarios at a 500px viewport height checked editable, visible inputs, brand wordmarks and credits for all four native assistants; branded screenshots are local QA fixtures. A keyboard check identified that the new privacy summary was absent from modal focus targets; it was added to retain Tab wrapping. Provider replies in conversation checks were mocked; no successful live Gemini call is claimed.

Final production rebuild passed with lint and type validation. All eight 320–1440px dark/light keyboard, touch-target, contrast/transparency and overflow checks passed after adding summary focus wrapping and 44px coarse-pointer controls.

Provider-failure diagnosis follow-up: the owner supplied a deployed screenshot of the generic upstream-failure message. That path means an upstream returned non-2xx; it does not establish whether the key, permissions, model or service caused it. HTTP 400 now shows configuration guidance, 401/403 access guidance, and native-provider 404 model guidance. HTTP 429 retains its distinct quota message. Vercel runtime logs receive only `chat_provider_failure`, the fixed provider name and upstream HTTP status; no key, prompt, headers, URL or raw provider body is logged. Actual Vercel secrets and model eligibility are unavailable in this workspace.

Model discovery and logo follow-up: when native Gemini generateContent returns 404, the server fetches the same key's fixed Google ListModels endpoint (bounded JSON, same timeout, no redirects). It retries once only with a listed generateContent model from the allowlist gemini-2.5-flash-lite/gemini-2.5-flash, excluding the failed model. It never switches on authentication or quota failures, selects arbitrary/Pro models, or fabricates replies. Listed availability is not a guarantee of remaining free quota. No-match diagnostics log only validated model identifiers; browser errors include the requested model to check that hosting configuration took effect. All four branded headers display the actual Elvora SVG at 48px, while business marks remain beside assistant messages.

All 27 backend tests passed, including ListModels discovery/retry, unchanged conversation/key forwarding, no arbitrary model selection and no quota retry. These are mocked upstream checks; live credentials remain outside this workspace.

Final build passed including lint/types. Eight 390/1440px browser cases confirmed loaded 48px Elvora SVG headers across all four native assistants, editable input and no horizontal chat overflow. New logo screenshots are local missing-key QA, not live reply evidence.

Brand correction and remaining live blocker: the owner clarified each assistant needs its own logo. Four original SVG marks now identify Veldt (woven V/leaf), Northline (N/north star), Solenne (sun/arch), and Aura (orbital voice waves), consistently in header, previews and assistant messages. Elvora remains only the builder credit. The old Elvora-header screenshots are historical QA, not the final branding.

Upstream 404 messages now distinguish generate versus list-models and include the actual attempted model. The common runtime-log filter is chat_provider_failure, not chat_model; discovery-specific logs alone do not cover every failure. No response body, secret or prompt is logged. The owner re-added a key in Vercel; that does not bind it to this workspace. Workspace GEMINI_API_KEY remains absent and its cloud secret binding remains unsaved, so live authentication/model access cannot be reproduced here. Direct public-host access is also blocked by this execution proxy's CONNECT 403. These external blockers are not successful model verification.

Brand correction verification: final production build and 27 chat tests passed. Eight mobile/desktop cases confirmed each of the four distinct SVG logos loads under the correct brand name, chat input remains editable and panels have no horizontal overflow. Custom-logo screenshots are isolated local fixtures. Live API remains unresolved pending actual runtime/provider evidence.
