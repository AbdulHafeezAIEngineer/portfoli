export const consentContent = {
  version: 1,
  retentionDays: 180,
  key: "elvora-consent-v1",
  title: "A little choice. A better visit.",
  description:
    "Essential storage keeps your chosen theme and privacy choices working. Optional embedded chat connects to a third-party provider only when you allow it. No analytics or advertising trackers are installed by this portfolio.",
  accept: "Accept All",
  reject: "Reject All",
  manage: "Manage Preferences",
  save: "Save Preferences",
  settings: "Cookie Settings",
  close: "Close preferences",
  policy: "Cookie Policy",
  privacy: "Privacy Policy",
  dialogTitle: "Your privacy preferences",
  dialogDescription:
    "Optional features are off until you choose them. You can change your mind using Cookie Settings in the footer. Rejecting optional features leaves the rest of the portfolio available.",
  essential: "Essential storage",
  essentialNote:
    "Privacy choices, your explicitly selected theme, and security or sign-in functionality when used. Always active; no advertising or analytics.",
  external: "Third-party chat",
  externalNote:
    "Allow embedded services such as Botpress. Opening a chat then shares connection information with that provider, which may use its own cookies or local storage. AI API demos remain available without this permission.",
  withdrawal:
    "Withdrawing consent removes open chat embeds and stops future loading. It cannot erase information already sent to a provider or its stored data.",
  gateTitle: "Your choice before we connect.",
  gateNote:
    "This chat uses an external provider. Allow third-party chat to load it, or keep browsing without it.",
  allow: "Allow third-party chat",
  saved: "Privacy choices saved.",
  notSaved:
    "Preferences apply to this page, but this browser could not save them for your next visit.",
} as const;

export const legal = {
  updated: "17 October 2026",
  updatedLabel: "Last updated",
  back: "Back to Elvora",
  contact: "Questions about this policy?",
  pages: {
    privacy: {
      title: "Privacy Policy",
      intro:
        "This policy describes how Elvora, the portfolio of independent developer Abdul Hafeez, handles information when you browse, send an enquiry or use a demo.",
      sections: [
        {
          title: "Who to contact",
          text: "Abdul Hafeez operates this portfolio under the Elvora name. Contact abdulhafeez@elvoraai.online about your information, a request, or this policy.",
        },
        {
          title: "Browsing and essential storage",
          text: "The hosting provider processes connection details, such as IP address, request information and operational logs, to deliver and protect the site. Your selected theme and privacy preferences may be stored locally in your browser. Admin sign-in uses security cookies when used. This portfolio does not install analytics or advertising trackers.",
        },
        {
          title: "Contact enquiries",
          text: "If you submit the form, your name, email and message are processed to respond to your enquiry and limit abuse. Messages are delivered through the configured email service; a private inbox may also store them if database features are enabled. Cloudflare Turnstile may process technical information for form security when configured. Do not send passwords, payment details, medical information or other sensitive content.",
        },
        {
          title: "AI demos, voice and embedded chat",
          text: "AI API demos send your question and limited conversation context to the configured AI provider to generate a reply. Provider processing and retention are governed by its terms. Portfolio chat logging is off by default; if enabled, the chat notice must disclose it. Optional external embeds such as Botpress load only after third-party chat permission and opening the chat. Microphone features require browser permission, and browser speech services may process audio externally. Avoid sharing private information. Demo answers can be inaccurate.",
        },
        {
          title: "Why information is processed",
          text: "Information is used to operate and secure the site, respond to requests, and provide features you choose to use. Where applicable, the basis is your request to take steps toward a service, legitimate interests in security and communication, or consent for optional embedded features. You may withdraw optional-feature consent at any time through Cookie Settings.",
        },
        {
          title: "Providers and international processing",
          text: "Hosting, email, anti-abuse and AI providers may process information in other countries under their applicable contracts and privacy terms. A GitHub or Instagram link takes you to that platform only when you choose to open it. Social feeds and tracking pixels are not embedded here. Information is not sold by Elvora.",
        },
        {
          title: "Retention and your choices",
          text: "Privacy choices expire after 180 days. Enquiries are kept only as needed to respond, manage a working relationship, or meet applicable record-keeping obligations, then reviewed for deletion. Provider retention may differ. Depending on your location, you may request access, correction, deletion, restriction or portability, object to processing, withdraw consent, or contact your local privacy regulator. Email Elvora to make a request; reasonable verification may be needed.",
        },
        {
          title: "Changes",
          text: "This policy will be updated when the actual services or processing change. The date above identifies this version. New optional purposes require a new consent choice before activation.",
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      intro:
        "Cookies and browser storage are used for specific features. Optional external chat is off by default, and you have equal options to accept, reject or manage it.",
      sections: [
        {
          title: "Essential features",
          text: "The local-storage key elvora-consent-v1 remembers your privacy choice and timestamp for up to 180 days. portfolio-theme remembers a theme you explicitly select. Necessary security, anti-abuse and admin sign-in features may use additional security storage when used. These are not used for advertising or audience analytics.",
        },
        {
          title: "Optional third-party chat",
          text: "Botpress and other configured embedded providers may use cookies or local storage once you permit third-party chat and open the feature. Their storage names and duration are provider-controlled and may change; consult their current policies. No embedded provider frame is created by the public chat component before this permission. AI API demos do not require embedded-chat consent.",
        },
        {
          title: "No analytics or advertising category",
          text: "This portfolio does not install analytics, advertising pixels or social-media tracking embeds. There is no inactive consent category pretending to control those technologies. If optional purposes are introduced later, this notice and the consent version must be updated before those features are loaded.",
        },
        {
          title: "Change or withdraw your choice",
          text: "Choose Cookie Settings in the footer to change preferences at any time. Reject All disables optional chat; Accept All allows it. Manage Preferences lets you keep it off or on separately from essential features. Withdrawing removes active provider frames but does not delete information already received or stored by the provider. Use your browser's site-data controls to clear stored browser data.",
        },
        {
          title: "Storage restrictions",
          text: "If your browser blocks storage, the choice applies to the current page but may be requested again on a later visit. Other browser tabs update when a saved preference changes. Expired or invalid choices are treated as no permission.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      intro:
        "These terms cover use of the Elvora portfolio and its demonstrations. A paid project needs its own agreed scope and terms.",
      sections: [
        {
          title: "Portfolio and concept work",
          text: "The sample websites are independent concept projects with fictional brands, generated hero images and original interface work. They do not represent client commissions, real reservations, vehicle sales or clinical services. Their sample planners and configurators create local demo summaries without submitting bookings or taking payment.",
        },
        {
          title: "Services and project agreements",
          text: "Website design, development, AI chatbot integration, scoped API automation and optimization are subject to requirements, feasibility and a separate written agreement. Scope, pricing, payment, timelines, support, ownership and any third-party costs must be agreed for each project. No search ranking, revenue or business outcome is guaranteed.",
        },
        {
          title: "AI limitations and acceptable use",
          text: "AI output may be incomplete or inaccurate and requires human judgment. The booking and support demos are examples, not professional advice or confirmed transactions. Do not submit sensitive data, abuse the services, bypass limits, attempt unauthorized access or use the site unlawfully. Voice features depend on device and browser support.",
        },
        {
          title: "Intellectual property and third-party services",
          text: "Elvora branding and original portfolio materials belong to their respective rights holders. Tool names, third-party brands and permitted client material remain their owners' property. Display does not imply endorsement or partnership. External links and providers have their own terms and availability.",
        },
        {
          title: "Availability and responsibility",
          text: "The site and demos are provided as available and may change, be limited or be interrupted. To the extent permitted by applicable law, Elvora does not guarantee uninterrupted or error-free demo operation. Nothing here excludes rights or liabilities that cannot lawfully be excluded. Any paid-project responsibility is set out in its own agreement, subject to law.",
        },
        {
          title: "Contact and updates",
          text: "Contact abdulhafeez@elvoraai.online with questions. These terms may be updated as the portfolio changes; the date above identifies the current version.",
        },
      ],
    },
  },
} as const;
