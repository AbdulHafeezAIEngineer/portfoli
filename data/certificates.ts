export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  dateLabel: string;
  issuedAt: string | null;
  description: string;
  image: string;
  alt: string;
  isPlaceholder: boolean;
};
export const certificates: Certificate[] = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering degree",
    issuer: "[PLACEHOLDER] Issuer not supplied",
    dateLabel: "[PLACEHOLDER] Award date not supplied",
    issuedAt: null,
    description:
      "[PLACEHOLDER] Add the exact qualification title, course description, and verified credential details when the certificate is supplied.",
    image: "/certificates/prompt-engineering-placeholder.png",
    alt: "Clearly labeled placeholder for a Prompt Engineering degree image; no genuine certificate is displayed",
    isPlaceholder: true,
  },
];
export const certificateContent = {
  eyebrow: "05 / CERTIFICATION",
  title: "Learning, with the details to match.",
  description:
    "A dedicated place for the Prompt Engineering credential. The actual image and supporting details are still pending.",
  placeholder: "[PLACEHOLDER] Certificate image pending",
  issuer: "ISSUER",
  date: "AWARDED",
  enlarge: "Click to enlarge",
  close: "Close certificate",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  reset: "Fit certificate",
  help: "Use + and − to zoom, 0 to reset, and Esc to close. Scroll or swipe to explore an enlarged image.",
  loading: "Loading certificate",
  unavailable:
    "The certificate image could not be loaded. Please try again later.",
} as const;
