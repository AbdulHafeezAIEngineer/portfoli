export const contactContent = {
  eyebrow: "06 / START A CONVERSATION",
  title: "Let's talk.",
  description:
    "Have a project in mind? Tell me a little about it, and let's find a thoughtful way forward.",
  emailLabel: "EMAIL ELVORA",
  emailCta: "Open Gmail or your email app",
  emailNote: "Prefer email? Reach out directly using the address below.",
  formTitle: "Send a message",
  name: "Your name",
  email: "Email address",
  message: "Your message",
  namePlaceholder: "How should I address you?",
  emailPlaceholder: "you@example.com",
  messagePlaceholder:
    "What are you looking to build, and what matters most to you?",
  messageHint:
    "20–3,000 characters. Please avoid passwords or sensitive information.",
  honeypot: "Leave this field empty",
  send: "Send message",
  sending: "Sending…",
  characters: "characters",
  privacy:
    "Your contact details and project message are used to respond to your enquiry. See the Privacy Policy for storage and providers. Please avoid confidential information.",
  privacyLink: "Privacy Policy",
  success:
    "Your message was accepted by the mail server for delivery. Thank you for reaching out.",
  invalid: "Please check the highlighted fields.",
  failure:
    "Your message could not be confirmed as sent. Your details are still here; you can email Elvora directly.",
  sendingStatus: "Sending your message",
  errorTitle: "Message not sent",
  errors: {
    name: "Enter a name between 2 and 80 characters without line breaks.",
    email: "Enter a valid email address, up to 254 characters.",
    message: "Enter a message between 20 and 3,000 characters.",
    format: "The form request is invalid. Please check your details.",
    unavailable:
      "The contact form is not connected yet. Please email abdulhafeez@elvoraai.online directly.",
    limited:
      "Too many contact requests. Please try again later or email Elvora directly.",
    protection:
      "The contact form is temporarily unavailable. Please email Elvora directly.",
    origin: "Please use the contact form on the Elvora website.",
  },
} as const;
export const contactPolicy = {
  maxName: 80,
  maxEmail: 254,
  minMessage: 20,
  maxMessage: 3000,
  perTenMinutes: 3,
  perDay: 10,
} as const;
