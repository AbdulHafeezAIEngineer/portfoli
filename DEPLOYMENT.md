# Deploy to Netlify without downloading

The complete Parts 1 and 2 source is on GitHub. Netlify can build it directly from the repository.

[Deploy this repository to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/AbdulHafeezAIEngineer/portfoli)

1. Open the link and sign in to your own Netlify account.
2. Authorize GitHub access to `AbdulHafeezAIEngineer/portfoli` when prompted, then choose the repository/project name.
3. Use branch `main`, repository root `./`, build command `npm run build`, publish directory `.next`, and Node.js 24. These build settings are supplied by `netlify.toml`.
4. Click **Deploy**. Netlify's Next.js runtime handles the App Router, API routes, server-rendered images and image optimization. Do not add an SPA redirect that sends every request to index.html.
5. Wait for Netlify to report a successful published deployment, then open the actual HTTPS URL from its dashboard.

You can also use **Add new project → Import an existing project → GitHub**, select `portfoli`, and retain the settings above.

## Environment variables

No environment variable is required to view the portfolio and galleries. When `NEXT_PUBLIC_SITE_URL` is unset, the site uses Netlify's `URL` (or `DEPLOY_PRIME_URL`) for canonical URLs, sitemap and social metadata. For a custom domain, set `NEXT_PUBLIC_SITE_URL` to its actual HTTPS origin and redeploy. Never use the example placeholder domain on a live deployment.

The AI demos show a connection message until configured. Use Netlify's secure server environment settings for production secrets; this is the production equivalent of the ignored local `.env.local` file. Never put keys in source or `NEXT_PUBLIC_` variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL=gpt-4o-mini`
- `CHAT_REDIS_REST_URL`
- `CHAT_REDIS_REST_TOKEN`

Netlify uses serverless instances, so retain the shared Redis limiter and leave `CHAT_ALLOW_IN_MEMORY_LIMITER` unset or false. Leave `CHAT_TRUSTED_IP_HEADER` blank unless the chosen header has been confirmed to be overwritten by the trusted edge. Configure provider billing limits separately: app request quotas are not dollar spending caps. See `CHATBOT_SETUP.md` for details.

The real bot still needs your iframe/script/API details in `realBotConfig` in `data/bots.ts`. The website and galleries can be published before those details or AI secrets are supplied. Third-party embeds, real AI replies and actual microphone recognition need separate live verification.

## Verify the published site

- Confirm Netlify shows the expected Git commit as successfully published.
- Open the generated HTTPS URL on desktop and mobile.
- Test Work, all four galleries, AI Bots, theme switching and chat configuration messages.
- Verify `/icon.svg`, `/opengraph-image`, `/robots.txt` and `/sitemap.xml`.
- After adding AI/Redis secrets, redeploy and verify a real AI reply and usage limits.

A GitHub push or local build does not publish a website. No generated hosting URL is claimed as live until the provider reports success and the URL is verified.
