import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";
import "./bots.css";

const inter = localFont({
  src: [
    { path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-inter", display: "swap",
});
const space = localFont({
  src: [
    { path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2", weight: "500" },
    { path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-space", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: "/", siteName: site.name, title: site.title, description: site.description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }] },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/opengraph-image"] },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0A0A12" }, { media: "(prefers-color-scheme: light)", color: "#F7F6F2" }] };

const themeScript = `(function(){var t='dark';try{var s=localStorage.getItem('portfolio-theme');if(s==='light'||s==='dark')t=s;}catch(e){}document.documentElement.dataset.theme=t;})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${space.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><a className="skip-link" href="#main-content">{site.ui.skip}</a><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
