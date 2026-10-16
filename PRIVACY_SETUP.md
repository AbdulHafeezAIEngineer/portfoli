# Privacy controls and studio content

The cookie banner presents **Accept All**, **Reject All**, and **Manage Preferences** with equal visual weight. Optional third-party chat defaults off. Essential storage is explained separately, and the only optional toggle corresponds to a real loaded feature. No analytics, advertising pixels or embedded social feeds have been added.

`ConsentProvider` wraps the app. It stores a versioned decision and timestamp under `elvora-consent-v1` in local storage for 180 days. Invalid, future-dated, expired or superseded choices require another decision. Storage failures retain an in-page choice and give an honest status message. Storage events synchronize other tabs, and returning to the tab checks saved/expired consent. The preferences dialog uses native dialog semantics, keyboard focus containment, Escape and focus restoration.

`BotEmbed` creates no provider iframe until third-party chat is permitted. The existing Forte card still opens its in-page panel with one click; if permission is missing, the panel gives a just-in-time explanation and explicit permission button. Accepting the banner ahead of time preserves the direct chat experience. Revocation unmounts the active iframe and stops future loading. It cannot delete provider-side data or third-party stored values, so the notice does not claim otherwise. The server-side AI API demos remain usable without external-embed permission; their submitted text still goes to the configured AI provider when used.

Theme storage remembers an explicit theme choice. Sign-in and configured anti-abuse features are necessary security functions, explained in the policy. Contact form security may use Cloudflare Turnstile; it is not an advertising feature. No payment, analytics or social tracking SDK is installed.

## Policies and owner responsibilities

`/privacy`, `/cookies`, and `/terms` have readable responsive pages, independent titles/canonical URLs, footer navigation, and Cookie Settings. The policy copy describes the current architecture rather than promising integrations that have not been verified. The owner must review it against actual hosting/email/AI/anti-abuse providers, retention/deletion practice, business identity, served regions, and contractual/legal obligations before treating it as legal advice or a compliance guarantee. Update the policy and increment `consentContent.version` before introducing a new optional purpose. No universal legal-compliance certification is claimed.

## Genuine reviews and personal data

The Wall of Love currently contains three **explicit review layout previews**, not client testimonials. No real face or invented endorsement is used. Replace entries in `data/studio.ts` only after obtaining genuine review copy, the correct name/role, and permission to publish the portrait and review. Put approved portraits in `public/testimonials/`, use the local path in `portrait`, and set `placeholder: false`. The template renders one slide at a time, pauses on hover/focus or a hidden tab, supports manual controls, and disables autoplay under reduced-motion preferences.

The owner supplied the journey copy, four services, GitHub and Instagram URLs and requested the AI-tool category. No client/project/success totals or new experience-duration claims are added. The missing personal photo remains honestly labeled in About Me. The owner has now supplied the design-reference images, which inform the latest layouts; review copy and approved client portraits remain pending. The hero uses the existing Elvora logo as a CSS sculpture. Tool tiles use custom typographic marks and product names without endorsement claims.

All new section copy lives in `data/studio.ts`, `data/experience.ts`, `data/skills.ts`, and `data/privacy.ts`; no database migration is required for these sections. In database content mode, existing skills and site settings are preserved; update them through admin to match the file-based AI toolkit and email. Never seed destructive replacements over existing content.
