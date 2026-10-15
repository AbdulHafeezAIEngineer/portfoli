# Part 2 — AI chatbot services

Only AI Chatbot Services has been implemented in this part. Experience, Skills, Certification and a contact form remain future work. The AI Bots navbar anchor opens the AI tab, including direct links to `#ai-bots`.

## Install and run

```bash
npm ci --cache /tmp/portfoli-npm-cache
test -e .env.local || cp .env.example .env.local
npm run dev
```

Only copy the example if `.env.local` does not already exist. Edit that ignored file securely: set `OPENAI_API_KEY` and leave `OPENAI_MODEL=gpt-4o-mini` for the supplied Chat Completions implementation. Never put secrets in messages, public variables, bot data or browser code. No valid key is included. Restart Next.js after changing server variables.

Allow outbound HTTPS to `api.openai.com` where networking is restricted. Add the actual real-bot and Redis provider domains once selected, preserving existing network permissions. Saving an environment draft does not apply runtime network changes.

```bash
npm run lint
npm run typecheck
npm run test:chat
npm run build
npm start
```

Stop the development server before building the same `.next` directory. No separate application server is needed.

## One real-bot config

Replace only `realBotConfig` in `data/bots.ts` with ONE of these objects. The empty default displays “Connection pending”. Card content is in the same data file.

### Hosted iframe

```ts
export const realBotConfig: RealBotConfig = {
  method: "iframe",
  url: "https://your-provider.com/embed/your-bot",
};
```

Supply a public hosted embed URL without secret query parameters. The provider must permit framing. Its chat manages history, typing state and privacy. This iframe permits scripts, forms, provider storage and popups; use only a trusted cross-origin provider page. The portfolio cannot inspect an external conversation.

### Script widget

```ts
export const realBotConfig: RealBotConfig = {
  method: "script",
  src: "https://your-provider.com/widget.js",
  mountId: "bot-root",
  attributes: { "data-bot-id": "your-public-bot-id" },
};
```

Transfer the external script URL and public `data-*` attributes from your provider's snippet. Do not paste raw HTML, event attributes, inline JavaScript or secrets. Optional `integrity` accepts the provider's authentic SRI hash; never invent one. The script runs inside a sandboxed iframe document with a CSP allowing that script origin, not inside the portfolio DOM. Widgets requiring cookies/storage, extra script origins, inline bootstrapping or popup escape may need a reviewed provider adapter or the hosted iframe/API method. No blanket sandbox bypass is included.

### API endpoint

```ts
export const realBotConfig: RealBotConfig = {
  method: "api",
  endpoint: "https://your-provider.com/chat",
  requestField: "messages",
  responsePath: "reply",
  authHeader: "Authorization",
  authPrefix: "Bearer ",
};
```

Put optional authentication only in `REAL_BOT_API_KEY` in `.env.local`. For an `x-api-key` provider, set that `authHeader` and use `authPrefix: ""`. The owner-configured endpoint must be trusted public HTTPS; visitors cannot supply an endpoint. Redirects are rejected. Do not configure an internal service or untrusted hostname.

`requestField: "messages"` sends `{"messages":[{"role":"user","content":"Hello"}]}` with bounded history. `requestField: "message"` sends only `{"message":"Hello"}`; that provider must manage its own context. The default response is `{"reply":"Hello"}`. Dot paths such as `answer`, `data.reply` or `choices.0.message.content` are supported. Providers needing custom session IDs, streaming, tools or other payloads require an adapter in `lib/chat/provider.ts`. The external bot controls its own prompts and generation limits.

## Demo behavior

| Bot | Embed method | Prompt | Behavior |
| --- | --- | --- | --- |
| Cedar Support | Custom UI via API | `data/prompts/support.ts` | Fictional Cedar & Co. shipping, returns and product-care facts. No actual order access. |
| Meetly Booking | Custom UI via API | `data/prompts/booking.ts` | Collects a sample service, date and time; asks for confirmation; clearly marks the result as simulated. No real reservation. |
| Aura Voice | Custom UI via API + Web Speech | `data/prompts/voice.ts` | Editable speech transcript, manual sending and optional browser speech playback. |

The booking prompt receives the current server date in Asia/Karachi. Sample times use that timezone. There is no calendar, database write, account access or confirmation email. Do not request visitors' contact or sensitive details in these demos.

Successful conversations stay in React memory per bot across panel closes, with up to 40 displayed messages per bot. Reload/clear removes this local history. Only the newest complete pairs fitting the context limit go upstream. Failed or cancelled messages do not enter accepted context. Provider retention is separate from browser memory; avoid confidential input.

## Limits and spending

- 1,000 characters per user message, 11 alternating user/assistant messages, 6,000 total context characters and a 32 KiB request body.
- Demo replies: maximum 256 output tokens, 4,000 displayed characters, a 20-second provider timeout and 64 KiB upstream JSON limit. The model and token limit cannot be set by visitors.
- Six requests/minute and 30/day per visitor bucket; `CHAT_DAILY_REQUEST_CAP` defaults to 100/day globally across API bots. Days reset at UTC midnight. Reservations count even if an upstream call fails. Two provider calls can run concurrently per process.
- Leave `CHAT_TRUSTED_IP_HEADER` blank unless your trusted edge proxy overwrites it and prevents client spoofing. Blank deliberately uses one shared visitor bucket. Do not trust arbitrary incoming forwarding headers.
- Development supports in-memory counters. Production fails closed without a Redis REST store unless `CHAT_ALLOW_IN_MEMORY_LIMITER=true` is explicitly selected for a single-process deployment. Memory limits reset on restart and do not protect multiple instances.
- For serverless/multiple instances, set both `CHAT_REDIS_REST_URL` and `CHAT_REDIS_REST_TOKEN` for an Upstash-compatible REST service. An atomic Lua script reserves shared quotas. Store failures fail closed.
- Request quotas are NOT a dollar spending cap. Use a dedicated provider project/key, budget alerts and an enforceable billing limit where supported; verify whether a provider's budget is only a soft alert. Other uses of the key are outside these quotas. `CHAT_ENABLED=false` pauses all API bots. External real bots need their own generation/cost limits.

## Prompt-injection guard

The server selects server-only system prompts. Client system/developer roles, arbitrary models, endpoints and token limits are never accepted. Common Unicode-normalized instruction-override patterns are rejected, and the system boundary treats the entire conversation as untrusted data. AI output is plain text, never executable HTML. Models have no tools, secrets, private records or external actions. This is defense in depth, not a guarantee against every prompt injection; do not add confidential material to demo prompts. External providers control their own bot protections.

## Voice checks

Use HTTPS in production; loopback development is a secure context. Voice input supports `SpeechRecognition`/`webkitSpeechRecognition`; playback uses `speechSynthesis`. Only a user click starts the mic. Review transcripts before sending; they never auto-send. Unsupported browsers and permission denial keep text chat available. Your browser may send audio to its speech service. Closing the panel stops recognition, cancels speech and aborts pending chat requests. Actual recognition and voice quality require a manual test on your target device; automated tests simulate browser events.

## Replacement checklist

1. Securely set your OpenAI key in `.env.local` and restart Next.js.
2. Allow `api.openai.com` in restricted cloud network settings.
3. Supply your real public bot connection and choose one config shape; add an optional real API secret only to `.env.local`.
4. Configure shared Redis quotas for serverless/multiple instances, or explicitly choose the documented single-process option.
5. Set provider billing controls and review the fictional sample company policies/prompts before adapting them for real business.
6. Check actual provider embed permissions and Web Speech on your production HTTPS domain.
7. Retain Part 1's image, portrait, public email and production URL checklist. No new image assets are required.

## Database-managed bots and optional logging

`CONTENT_SOURCE=files` reads the four bots and the one `realBotConfig` object from `data/bots.ts`. Database mode reads published cards, public connections and optional custom system prompts from Prisma; edit them at `/admin/bots`. Add exact external provider hostnames to `BOT_PROVIDER_ALLOWLIST` before saving connections. New API bots can use their own server-only system prompt with the shared OpenAI adapter, or an external API configuration. Never store private keys in public configuration. Chat logs are off by default; if enabled in site settings, database retention and the public chat notice apply.
