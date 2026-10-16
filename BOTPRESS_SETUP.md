# Forte O Level Study Assistant

The first real-bot card is connected to the two public scripts supplied by the owner:

- Loader: `https://cdn.botpress.cloud/webchat/v5.0/inject.js`
- Configuration: `https://files.bpcontent.cloud/2026/10/09/06/20261009063223-SY2FHGEQ.js`

Both addresses live in `realBotConfig` in `data/bots.ts`. No Botpress admin token or OpenAI key is needed to embed this published widget. Botpress still controls its publishing state, usage allowance, conversation storage and replies.

After your host deploys GitHub `main`, open **AI Bots → Forte O Level Study Assistant** and click anywhere on the card or its **Open chat** label. The static chat preview shows the owner-supplied greeting; the real Botpress widget loads only after the click. The card is a single keyboard-accessible button (Enter/Space). The loader runs first, the configuration runs next, and the adapter opens the chat on Botpress's `webchat:ready` event. A loading message, timeout and retry button cover connection failures. Closing the panel removes the frame and its scripts; reopening starts a fresh embedded page. Provider-side session retention is managed by Botpress.

The trusted Botpress adapter runs in a dedicated same-origin frame with scripts, forms, storage and popups permitted. It is not an origin security boundary from the portfolio. Only official Botpress loader and configuration hosts/paths are accepted by this adapter; a nonce authorizes its fixed bootstrap code. Generic script widgets retain their opaque sandbox. Third-party code should only come from providers the owner trusts.

`CONTENT_SOURCE=files` uses this connection immediately. In database mode, edit the existing `real` bot at `/admin/bots`, change its name to **Forte O Level Study Assistant**, choose `script` and paste the equivalent public config from `data/bots.ts` into its config field. Add `cdn.botpress.cloud,files.bpcontent.cloud` to `BOT_PROVIDER_ALLOWLIST` before saving. Seeding preserves existing database records and will not replace the previous connection.

If the live widget does not appear, confirm the latest hosting deploy succeeded, publish the bot in Botpress, and check the provider's allowed website/domain settings if enabled. Permit the actual portfolio domain, including `portfolio3821.netlify.app` if that is the current site. Do not add API keys to these public script URLs.

Local validation uses explicit Botpress SDK fixtures to check script order, initialization/opening, storage, close cleanup, mobile layout, errors and retry. The cloud network returned HTTP 403 for the real Botpress assets, so actual provider loading and AI replies still need verification in the owner's browser after deployment.

## Privacy choice before embedding

The public card still opens its in-page panel with one click. `BotEmbed` now waits for the visitor to allow third-party chat through the cookie banner, preferences, or the explicit in-panel permission button. Before permission no provider frame is created. Withdrawing permission removes an open frame and prevents future loading. Visitors who already accepted external chat reach the connected chat directly. Provider-side data already sent is not erased by this control. See `PRIVACY_SETUP.md`.
