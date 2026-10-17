/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supported by the pinned Next version; avoids render-blocking stylesheet requests.
  experimental: { inlineCss: true },
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/query_compiler_bg.wasm"],
  },
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "gmail-smtp",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: process.env.BLOB_PUBLIC_HOST
      ? [{ protocol: "https", hostname: process.env.BLOB_PUBLIC_HOST }]
      : [],
  },
  htmlLimitedBots: /.*/,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
