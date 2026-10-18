import { consentVisibilityScript } from "@/lib/consent";
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import palette from "@/data/theme-tokens.json";
import { MotionProvider } from "@/components/motion-provider";
import { ThemeColorSync } from "@/components/theme-color-sync";
import "./globals.css";
import "./bots.css";
import "./profile.css";
import "./devices.css";
import "./premium.css";
import "./studio.css";
import "./reference.css";
import "./editorial.css";
import "./agency.css";
import "./refinement.css";
import "./showcase.css";
import "./finishing.css";
import "./reference-motion.css";
import "./theme-tokens.css";
import "./project-art-tokens.css";
import "./atelier.css";
import "./pages.css";
import { ConsentProvider } from "@/components/consent-provider";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
const space = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
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
  // The site defaults to dark independently of the OS; saved/manual choices
  // are applied by the inline initializer and ThemeColorSync.
  themeColor: palette.dark.background,
};

const themeScript = `(function(){var t='dark',m='full';try{var s=localStorage.getItem('portfolio-theme');if(s==='light'||s==='dark')t=s;var p=localStorage.getItem('elvora-motion');if(p==='full'||p==='reduced')m=p;}catch(e){}document.documentElement.dataset.theme=t;document.documentElement.dataset.motion=m;if(window.IntersectionObserver&&m==='full')document.documentElement.dataset.motionReveals='enabled';var colors=${JSON.stringify({ dark: palette.dark.background, light: palette.light.background })};function sync(){var selected=document.documentElement.dataset.theme==='light'?'light':'dark';document.querySelectorAll('meta[name="theme-color"]').forEach(function(meta){meta.content=colors[selected];});}sync();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});})();`;

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
        <ThemeColorSync />
        <MotionProvider>
          <ConsentProvider>{children}</ConsentProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
