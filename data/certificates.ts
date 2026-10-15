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
    title: "Master of ChatGPT",
    issuer: "Coursiv",
    dateLabel: "31 October 2024",
    issuedAt: "2024-10-31",
    description:
      "Certificate of completion awarded to Abdul Hafeez for completing the ChatGPT guide, with 6 hours of training and skill development. Certificate ID: ADO6IJOS.",
    image: "/certificates/coursiv-master-of-chatgpt.webp",
    alt: "Coursiv Master of ChatGPT certificate issued to Abdul Hafeez on 31 October 2024 for a 6-hour course; certificate ID ADO6IJOS",
    isPlaceholder: false,
  },
];
export const certificateContent = {
  eyebrow: "05 / CERTIFICATION",
  title: "Certificate Showcase",
  description:
    "My course completion certificate, with the original award details. Select the image to explore it in full screen.",
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
