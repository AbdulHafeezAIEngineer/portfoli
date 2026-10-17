import { consentVisibilityScript } from "@/lib/consent";
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";
import "./bots.css";
import "./profile.css";
import "./devices.css";
import "./premium.css";
import "./studio.css";
import "./reference.css";
import "./editorial.css";
import "./agency.css";
import { ConsentProvider } from "@/components/consent-provider";

const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
const space = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-space",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const identity = site;
  return {
    metadataBase: new URL(site.url),
    title: identity.title,
    description: identity.description,
    robots:
      process.env.VERCEL_ENV === "preview" ||
      process.env.CONTEXT === "deploy-preview"
        ? { index: false, follow: false }
        : undefined,
    authors: [{ name: site.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: identity.brand,
      title: identity.title,
      description: identity.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: identity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
      images: ["/opengraph-image"],
    },
  };
}
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A12" },
    { media: "(prefers-color-scheme: light)", color: "#F7F6F2" },
  ],
};

const themeScript = `(function(){var t='dark';try{var s=localStorage.getItem('portfolio-theme');if(s==='light'||s==='dark')t=s;}catch(e){}document.documentElement.dataset.theme=t;if(window.IntersectionObserver&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.motionReveals='enabled';})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${space.variable}`}
    >
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: themeScript + consentVisibilityScript(),
          }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              url: site.url,
              jobTitle: site.role,
              email: site.email,
              sameAs: [
                "https://github.com/AbdulHafeezAIEngineer",
                "https://www.instagram.com/elvoraaistudio",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {site.ui.skip}
        </a>
        <noscript>
          <style>{`.consent-banner{display:none!important}.motion-reveal,.motion-word{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <ConsentProvider>{children}</ConsentProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
