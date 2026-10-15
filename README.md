# Abdul Hafeez — portfolio, Parts 1 and 2

Next.js 14 App Router, TypeScript, Tailwind CSS and Framer Motion. Dark by default, with a persistent light-theme toggle. Part 1 supplies the navbar, hero, tabs and four concept-project galleries. Part 2 adds four bot cards, an accessible chat panel, three AI demos, voice controls and embedding explanations. Experience, Skills and Certification remain placeholders. Contact remains an email link. All backend work uses Next.js route handlers; there is no separate application server.

## Run

To publish without downloading: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/AbdulHafeezAIEngineer/portfoli). Sign in to your own Netlify account, authorize GitHub, and use the supplied `netlify.toml` settings. See `DEPLOYMENT.md` for production secrets and verification.

Use Node.js 22 or 24 with npm. From this directory:

```bash
npm ci --cache /tmp/portfoli-npm-cache
npm run placeholders
npm run dev
```

The placeholder command preserves existing screenshots. Use `npm run placeholders -- --force` only to deliberately replace all screenshots with the provided placeholders. It also refreshes `SCREENSHOTS.md` from the prompts in `data/projects.ts`.

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`next-env.d.ts`, `.next/` and the TypeScript cache are generated locally. `package-lock.json` pins the dependency tree; retain it. Fonts are bundled through npm and `next/font/local`, so builds do not contact Google Fonts.

## Content and assets

- `data/site.ts`: all identity, navigation, hero, section, contact and interface copy. Set your real `email` to enable the contact email action; no address is invented.
- `data/projects.ts`: typed projects, image paths, alt text, descriptions, intended concept stack and 20 individual generation prompts. The images are not working websites or client commissions.
- `getProjects()` is the server-side data boundary. It supplies display-only props to the gallery and keeps generation prompts out of the page payload. Replace this loader with a database query later without changing the gallery components.
- `data/bots.ts`: bot content, UI labels, integration examples and the single real-bot connection object; never put keys here. `getBots()` supplies display props.
- `data/prompts/`: separate server-only prompts for the three demos.
- `data/skills.ts`, `certificates.ts`: typed empty collections reserved for future parts.
- `public/projects/`: 20 replaceable 16:10 JPEG previews. See `SCREENSHOTS.md` for every filename and prompt.
- `public/portrait-placeholder.svg`: replace with your portrait, then update the path, alt text and placeholder label in `data/site.ts`.
- `app/icon.svg`: editable AH favicon. `app/opengraph-image.tsx`: generated 1200 × 630 social image.

Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_SITE_URL` to your real HTTPS origin, and set `OPENAI_API_KEY` securely in that ignored file. Never commit it or expose a key through a `NEXT_PUBLIC_` variable. Restart Next.js after editing server variables. The website galleries work without an AI key. See `CHATBOT_SETUP.md` for real-bot configurations, production rate limits and spending controls.

## Accessibility and performance

Semantic landmarks, a skip link, labeled controls, native modal focus trapping/restoration, keyboard tab navigation, arrow/Escape gallery controls, live slide announcements, touch swipes, reduced-motion support, lazy project images, local fonts and an on-demand gallery bundle are included. Gallery arrows wrap from the first to last screenshot. The mobile navigation is a disclosure and closes with Escape, an outside click or link selection.

Check the finished deployment with Lighthouse after replacing images. Scores depend on image sizes, the production host and later changes; no particular score is guaranteed. Keep replacement JPEGs compressed, preserve a 16:10 canvas and write accurate alt text. Chat panels load on demand, and external embeds load only after opening their panel. API demos use OpenAI; production shared quotas can use an Upstash-compatible Redis REST store. No analytics are installed.
