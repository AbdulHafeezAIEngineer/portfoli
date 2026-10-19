# Custom business assistants

Three own-brand AI chat experiences are implemented on `/ai-bots`:

| Assistant | Example use | Approved source |
| --- | --- | --- |
| Veldt Support | Product recommendations, delivery, returns | `data/knowledge/veldt.ts` |
| Northline Assistant | Service explanations and a conversational project brief | `data/knowledge/northline.ts` |
| Solenne Concierge | Stay comparisons and guest enquiries | `data/knowledge/solenne.ts` |

These fictional businesses demonstrate real model-powered conversations once the AI service is configured. Sample rates and prices are not offers from Elvora or real clients. Solenne room names and base rates match the existing website concept: Garden Suite €280, Terrace Suite €320, Cove Villa €580. Forte's existing external connection and Aura's browser voice experience are retained. Legacy support/booking API IDs remain compatible.

## How the data works

Each request resolves one assistant ID on the server and adds only its approved business knowledge to the model context. The complete small knowledge file fits in context; there is no vector database or model fine-tuning. The server includes recent conversation turns for follow-ups. It never accepts client-supplied system instructions or knowledge overrides. The existing input, origin, concurrency, usage and response-size controls remain active.

Edit a source file and redeploy to update the file-mode assistant. Public source links at `/api/bot-knowledge?botId=veldt` (or `northline`, `solenne`) expose the same fictional facts, never credentials, full system prompts or CMS records. Do not put private client documents into these public demo sources. Backend knowledge modules are marked `server-only`.

Each assistant has its own avatar, starter questions and separate in-memory browser history. Visitors can clear a conversation. There is no provider badge in these three custom chat interfaces. No new dependency was added. An own-brand interface still uses a paid model provider; absence of a widget badge does not mean free or unlimited AI usage.

## Private activation

1. Configure **one** server-side OpenAI project API key with billing enabled: `OPENAI_API_KEY`, or the alternative `ELVORA_CHAT_API_KEY`. The alternative is checked first. Never use a `NEXT_PUBLIC_` prefix, paste credentials into chat, or commit them. ChatGPT subscription access does not supply the website's API credentials.
2. The existing default model is `gpt-4o-mini`, configurable through `OPENAI_MODEL` using a model supported by the existing Chat Completions request format. Set `CHAT_ENABLED=true`.
3. Production serverless/multi-instance hosting needs the existing `CHAT_REDIS_REST_URL` and `CHAT_REDIS_REST_TOKEN` settings for a shared Upstash-compatible REST usage store. Keep `CHAT_DAILY_REQUEST_CAP` conservative (default 100 across API bots) and configure provider billing limits/alerts separately. Do not enable `CHAT_ALLOW_IN_MEMORY_LIMITER` on serverless hosting; that exception is only for deliberate single-process deployments.
4. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS site origin, including `www` if canonical, and redeploy. Leave the trusted-IP header blank unless your edge actually overwrites it.
5. In ordinary `CONTENT_SOURCE=files` mode the cards and knowledge are selected automatically. Database content mode uses published CMS records instead; it intentionally does not substitute missing rows. Publish matching bot IDs, method `api`, null connection config and appropriate visible card content to use these built-in sources. A nonempty CMS system prompt overrides the built-in prompt for that row and must be reviewed for accuracy.
6. Test a question and a follow-up for each bot, unsupported facts, Urdu/Roman Urdu, limit responses and provider failure. Verify real answers against the approved source. These steps are not complete merely because a key variable is present.

The cloud environment draft contains the `ELVORA_CHAT_API_KEY` requirement scoped to `api.openai.com`, plus shared-store variable requirements. Review and save environment settings and publish the cloud environment to activate retained setup. That does not set secrets in the website's production host: the owner must configure the host privately too. API key prefixes named `OPENAI_` are reserved for cloud proxy-secret targets; the alternative key name avoids that restriction while preserving standard hosting support.

Without the key or production quota setup, the three built-in cards show **Preview assistant / Connection pending**, display a setup notice and disable sending. The API returns an honest unavailable response; no canned-answer fallback impersonates AI. Provider authentication, billing, shared-store connectivity and real model answer quality require actual private credentials and remain unverified until activated.

## Validation

- `npm run test:chat`: request validation, one-business-only prompt grounding, history, key alias, unavailable state, source endpoint and existing provider/limit/embed regression tests. Provider responses are mocked.
- `npm run lint`, `npm run typecheck`, `npm run test:security`, `npm run build`.
- `node tests/business-assistants.browser.mjs`: starts its own loopback production server, verifies missing-key API/UI, then uses an explicit dummy key and mocked chat responses to test all three interfaces at 360/390/768/1440 px in both themes. Checks starters, history isolation, follow-ups, clear, Escape focus return, avatars, source links and overflow. It never tests dummy credentials against the real model API. Screenshots in `docs/business-assistants/` are local UI fixtures, not proof of live model replies.
- Existing Apple UI browser test now targets Veldt instead of Cedar; run it against a locally configured UI fixture server if needed. The pages smoke test expects five cards including Forte and Aura.

No real purchases, order lookup, appointments, reservations, lead submissions, refunds or emails are implemented by these conversational demos. Actual actions need authenticated tools and separate integration work.

Completed local verification on 19 October 2026: production build (including lint/type checks), standalone lint/typecheck, 20 chat tests, 12 security tests and 24 browser scenarios passed. Missing-key API/UI checks also passed for all three assistants. A search of the generated client assets found none of the approved source-document headings or full business-prompt marker. Real AI replies, credentials/billing, live shared Redis connectivity and public-host behavior were not verified; no production provider secrets were available.
